#!/usr/bin/env python3
"""Turn raw messages into a chat-format SFT dataset of (incoming → your reply) pairs.

Pairing: every message YOU sent whose In-Reply-To/References resolves to a
message someone else sent you becomes one training example.

Cleaning is where the quality lives:
  - strip quoted history, signatures, legal footers from your replies
  - drop auto-replies, forwards, calendar noise, one-liners
  - dedupe near-identical replies

Outputs (in --out-dir):
  train.jsonl / val.jsonl   chat "messages" format, ready for the trainer
  eval_inbox.jsonl          ~20 held-out incoming emails + your real reply as reference

Usage:
  python 02_build_dataset.py --raw data/raw_messages.jsonl \
      --my-addresses you@company.com you@clea-solutions.ai \
      --name "Your Name" --out-dir data/
"""

import argparse
import difflib
import hashlib
import json
import random
import re
from pathlib import Path

# ---------------------------------------------------------------- cleaning

# Outlook's HTML-to-text bodies indent quoted blocks, so every anchor must
# tolerate leading whitespace.
QUOTE_MARKERS = [
    re.compile(r"^[ \t]*-{2,}\s*Original Message\s*-{2,}", re.I | re.M),
    re.compile(r"^[ \t]*On .{5,120} wrote:\s*$", re.M),
    re.compile(r"^[ \t]*From:[ \t].{1,200}?^[ \t]*Sent:[ \t].{1,200}?^[ \t]*To:[ \t]", re.S | re.M),  # Outlook inline header block
    re.compile(r"^>{1,}\s?", re.M),  # classic quote prefixes (marker only)
    re.compile(r"^[ \t]*_{10,}\s*$", re.M),  # Outlook divider
]

SIGNOFF_RE = re.compile(
    r"^\s*(best regards|kind regards|regards|best|thanks|thank you|cheers|sincerely|talk soon|v/r|respectfully)\s*[,!.]?\s*$",
    re.I,
)

FOOTER_MARKERS = re.compile(
    r"(this e-?mail .{0,80}(confidential|privileged)|unsubscribe|disclaimer:"
    r"|sent from (my )?(iphone|ipad|android|galaxy)|please excuse (any )?typos|get outlook for)",
    re.I,
)

AUTOREPLY_RE = re.compile(
    r"(out of (the )?office|automatic reply|auto-?reply|delivery (status notification|has failed)|undeliverable|calendar invit|accepted:|declined:|tentative:)",
    re.I,
)


def strip_quoted_history(body: str) -> str:
    """Cut everything from the first quoted-history marker onward."""
    cut = len(body)
    for rx in QUOTE_MARKERS:
        m = rx.search(body)
        if m and m.start() < cut:
            cut = m.start()
    return body[:cut].rstrip()


PHONE_LINE_RE = re.compile(r"^[\s(]*\+?\d[\d\s().-]{6,}$")


def strip_signature(body: str, name_tokens: list[str]) -> str:
    """Trim a trailing signature block: a sign-off line near the end, or a
    short trailing block starting with the author's name."""
    lines = body.rstrip().splitlines()
    # scan the last 8 lines for a sign-off; cut from there
    for i in range(max(0, len(lines) - 8), len(lines)):
        if SIGNOFF_RE.match(lines[i]):
            # keep the sign-off itself (it's part of the voice), drop what follows
            return "\n".join(lines[: i + 1]).rstrip()
    # fallback: trailing block that begins with the author's name; ignore the
    # blank/phone-only lines Outlook pads signatures with
    if name_tokens:
        tail = [i for i in range(len(lines)) if lines[i].strip()][-10:]
        for i in tail:
            stripped = lines[i].strip().lower()
            if all(t in stripped for t in name_tokens) and len(stripped) < 60:
                rest = [lines[j].strip() for j in range(i + 1, len(lines)) if lines[j].strip()]
                # only cut if what follows looks like signature furniture, not prose
                if all(PHONE_LINE_RE.match(r) or len(r) < 60 for r in rest):
                    return "\n".join(lines[:i]).rstrip()
    return body.rstrip()


def strip_footers(body: str) -> str:
    m = FOOTER_MARKERS.search(body)
    return body[: m.start()].rstrip() if m else body


def normalize_ws(body: str) -> str:
    """HTML-converted bodies pad lines with trailing spaces, which defeats the
    blank-line collapse and the line-anchored markers."""
    body = re.sub(r"[ \t]+\n", "\n", body)
    return re.sub(r"\n{3,}", "\n\n", body)


def clean_reply(body: str, name_tokens: list[str]) -> str:
    body = normalize_ws(body)
    body = strip_quoted_history(body)
    body = strip_footers(body)
    body = strip_signature(body, name_tokens)
    return normalize_ws(body).strip()


# Mail-gateway banner fragments that HTML flattening scatters through the text.
SECURITY_BANNER_RE = re.compile(
    r"(graymail\s*(\|\s*)?|phish\s*(\|\s*)?|report suspicious\b.{0,60}|caution\s*:\s*internal"
    r"|external\s*\(\s*[\w.+-]+@[\w.-]+\s*\)|^[ \t]*(external|spam|more\.{3})[ \t]*$)",
    re.I | re.M,
)
JUNK_LINE_RE = re.compile(r"^[\W_ �]*$", re.M)  # lines of pipes/nbsp/� furniture


def clean_incoming(body: str) -> str:
    """Incoming mail keeps more context but still drop footers and deep quotes."""
    body = re.sub("[\\u200b\\u200c\\u200d\\ufeff]", "", body)  # zero-width chars Outlook scatters
    body = SECURITY_BANNER_RE.sub("", body)
    body = "\n".join("" if JUNK_LINE_RE.fullmatch(l) else l for l in body.splitlines())
    body = strip_footers(strip_quoted_history(normalize_ws(body)))
    return normalize_ws(body).strip()[:6000]  # cap pathological threads


# ---------------------------------------------------------------- pairing


ADDR_RE = re.compile(r"[\w.+-]+@[\w-]+\.[\w.-]+")


def is_mine(header: str, addresses: set[str], name_tokens: list[str]) -> bool:
    """Sent Items extracted via MAPI fallback often carry a display name with no
    SMTP address, so match by address when one is present, by name otherwise."""
    header = (header or "").lower()
    addrs = ADDR_RE.findall(header)
    if addrs:
        return any(a in addresses for a in addrs)
    return bool(name_tokens) and all(t in header for t in name_tokens)


# An Outlook quoted-header block inside a reply body. HTML-to-text conversion
# pads these lines unpredictably, so each field is matched separately within
# the header region rather than as one strict multi-line pattern.
QUOTED_ANCHOR_RE = re.compile(r"^[ \t]*From:[ \t]*\S.{0,200}?^[ \t]*Sent:[ \t].{0,120}?^[ \t]*To:[ \t]", re.S | re.M)
QUOTED_FIELD_RES = {
    "from": re.compile(r"^[ \t]*From:[ \t]*(.+)$", re.M),
    "subject": re.compile(r"^[ \t]*Subject:[ \t]*(.+)$", re.M),
}


def parent_from_quoted(body: str, my_addresses: set[str], name_tokens: list[str]) -> dict | None:
    """When the incoming email is missing from the archive, reconstruct it from
    the quoted block the reply itself carries. Walk blocks top-down and take the
    first one authored by someone else (skips own mail in self-reply chains)."""
    body = normalize_ws(body)
    anchors = list(QUOTED_ANCHOR_RE.finditer(body))
    for i, m in enumerate(anchors):
        block_end = anchors[i + 1].start() if i + 1 < len(anchors) else len(body)
        block = body[m.start():block_end]
        header_zone = block[:1200]
        from_m = QUOTED_FIELD_RES["from"].search(header_zone)
        if not from_m:
            continue
        from_ = from_m.group(1).strip()
        if is_mine(from_, my_addresses, name_tokens):
            continue
        subj_m = QUOTED_FIELD_RES["subject"].search(header_zone)
        subject = subj_m.group(1).strip() if subj_m else ""
        # the quoted body starts after the last header line found near the top
        hdr_end = max(
            rx.search(header_zone).end() if rx.search(header_zone) else 0
            for rx in (
                QUOTED_FIELD_RES["subject"],
                re.compile(r"^[ \t]*To:[ \t]*(.+)$", re.M),
                re.compile(r"^[ \t]*Cc:[ \t]*(.+)$", re.M),
            )
        )
        quoted_body = block[hdr_end:]
        return {"from": from_, "subject": subject, "body": quoted_body}
    return None


def echoish(reply: str, incoming: str) -> bool:
    """Guard against contaminated pairs where the 'reply' is really the quoted
    incoming text (cleaning failure) — the model learns to parrot from these."""
    a = re.sub(r"\s+", " ", reply.lower()).strip()
    b = re.sub(r"\s+", " ", incoming.lower()).strip()
    if not a or not b:
        return False
    return a in b or difflib.SequenceMatcher(None, a, b).ratio() > 0.85


def build_pairs(raw_path: Path, my_addresses: set[str], name_tokens: list[str]):
    by_id: dict[str, dict] = {}
    records = []
    with raw_path.open(encoding="utf-8") as fh:
        for line in fh:
            rec = json.loads(line)
            records.append(rec)
            if rec["message_id"]:
                by_id[rec["message_id"]] = rec

    pairs = []
    dropped = {"no_parent": 0, "not_mine": 0, "noise": 0, "too_short": 0, "dupe": 0, "echo": 0}
    matched = {"direct": 0, "chain": 0, "quoted": 0}
    seen_hashes = set()

    for rec in records:
        if not is_mine(rec["from"], my_addresses, name_tokens):
            dropped["not_mine"] += 1
            continue
        # resolve the message this reply answers: exact id first (in_reply_to,
        # then references newest→oldest, skipping my own messages in the chain),
        # then fall back to the quoted block carried inside the reply itself
        parent, via = None, None
        refs = [rec["in_reply_to"], *reversed(rec["references"].split())]
        for n, ref in enumerate(r.strip() for r in refs):
            cand = by_id.get(ref)
            if cand and not is_mine(cand["from"], my_addresses, name_tokens):
                parent, via = cand, ("direct" if n == 0 else "chain")
                break
        if parent is None:
            parent = parent_from_quoted(rec["body"], my_addresses, name_tokens)
            via = "quoted"
        if parent is None:
            dropped["no_parent"] += 1
            continue
        if AUTOREPLY_RE.search(rec["subject"]) or AUTOREPLY_RE.search(parent["subject"]):
            dropped["noise"] += 1
            continue
        if rec["subject"].lower().startswith(("fw:", "fwd:")):
            dropped["noise"] += 1
            continue

        reply = clean_reply(rec["body"], name_tokens)
        incoming = clean_incoming(parent["body"])
        # floor tuned low: this author's voice IS short replies — only drop
        # bare acknowledgements ("thanks!", "sounds good")
        if len(reply) < 40 or len(reply.split()) < 6 or not incoming:
            dropped["too_short"] += 1
            continue
        if echoish(reply, incoming):
            dropped["echo"] += 1
            continue

        h = hashlib.sha1(re.sub(r"\s+", " ", reply.lower()).encode()).hexdigest()
        if h in seen_hashes:
            dropped["dupe"] += 1
            continue
        seen_hashes.add(h)
        matched[via] += 1

        pairs.append(
            {
                "incoming": {
                    "from": parent["from"],
                    "subject": parent["subject"],
                    "body": incoming,
                },
                "reply": reply,
                "date": rec["date"],
                "matched_via": via,
            }
        )
    return pairs, dropped, matched


# ---------------------------------------------------------------- output


def to_chat(pair: dict, system_prompt: str) -> dict:
    user = (
        f"From: {pair['incoming']['from']}\n"
        f"Subject: {pair['incoming']['subject']}\n\n"
        f"{pair['incoming']['body']}\n\n"
        "Draft the reply."
    )
    return {
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user},
            {"role": "assistant", "content": pair["reply"]},
        ]
    }


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--raw", default="data/raw_messages.jsonl")
    ap.add_argument("--my-addresses", nargs="+", required=True, help="every address you send from")
    ap.add_argument("--name", default="", help='your name, e.g. "Jane Smith" (improves signature stripping)')
    ap.add_argument("--out-dir", default="data/")
    ap.add_argument("--val-fraction", type=float, default=0.05)
    ap.add_argument("--eval-holdout", type=int, default=20)
    ap.add_argument("--seed", type=int, default=42)
    ap.add_argument(
        "--system-prompt",
        default=(
            "You draft email replies as {name}. Match their voice exactly: their "
            "greetings, sign-offs, sentence length, and level of formality. Reply "
            "only with the email body — no subject line, no explanations."
        ),
    )
    args = ap.parse_args()

    name_tokens = [t.lower() for t in args.name.split() if len(t) > 1]
    system_prompt = args.system_prompt.format(name=args.name or "the user")

    pairs, dropped, matched = build_pairs(
        Path(args.raw), {a.lower() for a in args.my_addresses}, name_tokens
    )
    print(f"Usable pairs: {len(pairs)}  (matched via: {matched})  (dropped: {dropped})")
    if len(pairs) < 150:
        print("WARNING: under 150 pairs — tone transfer will be weak. Add more archive data.")

    rng = random.Random(args.seed)
    rng.shuffle(pairs)

    out = Path(args.out_dir)
    out.mkdir(parents=True, exist_ok=True)

    eval_pairs = pairs[: args.eval_holdout]
    rest = pairs[args.eval_holdout :]
    n_val = max(1, int(len(rest) * args.val_fraction))
    val_pairs, train_pairs = rest[:n_val], rest[n_val:]

    with (out / "train.jsonl").open("w", encoding="utf-8") as fh:
        for p in train_pairs:
            fh.write(json.dumps(to_chat(p, system_prompt), ensure_ascii=False) + "\n")
    with (out / "val.jsonl").open("w", encoding="utf-8") as fh:
        for p in val_pairs:
            fh.write(json.dumps(to_chat(p, system_prompt), ensure_ascii=False) + "\n")
    with (out / "eval_inbox.jsonl").open("w", encoding="utf-8") as fh:
        for p in eval_pairs:
            fh.write(
                json.dumps(
                    {
                        "incoming": p["incoming"],
                        "reference_reply": p["reply"],
                        "system_prompt": system_prompt,
                    },
                    ensure_ascii=False,
                )
                + "\n"
            )

    print(f"train: {len(train_pairs)}  val: {len(val_pairs)}  eval holdout: {len(eval_pairs)}")
    print(f"→ {out / 'train.jsonl'}")
    print("\nNow spend 10 minutes reading train.jsonl. Every signature or quoted")
    print("thread the cleaner missed is something the model WILL learn to output.")


if __name__ == "__main__":
    main()
