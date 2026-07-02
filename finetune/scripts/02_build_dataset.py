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
import hashlib
import json
import random
import re
from pathlib import Path

# ---------------------------------------------------------------- cleaning

QUOTE_MARKERS = [
    re.compile(r"^-{2,}\s*Original Message\s*-{2,}", re.I | re.M),
    re.compile(r"^On .{5,120} wrote:\s*$", re.M),
    re.compile(r"^From:\s.+^Sent:\s.+^To:\s.+", re.S | re.M),  # Outlook inline header block
    re.compile(r"^>{1,}\s?", re.M),  # classic quote prefixes (marker only)
    re.compile(r"^_{10,}\s*$", re.M),  # Outlook divider
]

SIGNOFF_RE = re.compile(
    r"^\s*(best regards|kind regards|regards|best|thanks|thank you|cheers|sincerely|talk soon|v/r|respectfully)\s*[,!.]?\s*$",
    re.I,
)

FOOTER_MARKERS = re.compile(
    r"(this e-?mail .{0,80}(confidential|privileged)|unsubscribe|disclaimer:|sent from my (iphone|ipad|android|galaxy)|get outlook for)",
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


def strip_signature(body: str, name_tokens: list[str]) -> str:
    """Trim a trailing signature block: a sign-off line near the end, or a
    short trailing block starting with the author's name."""
    lines = body.rstrip().splitlines()
    # scan the last 8 lines for a sign-off; cut from there
    for i in range(max(0, len(lines) - 8), len(lines)):
        if SIGNOFF_RE.match(lines[i]):
            # keep the sign-off itself (it's part of the voice), drop what follows
            return "\n".join(lines[: i + 1]).rstrip()
    # fallback: trailing block that begins with the author's name
    if name_tokens:
        for i in range(max(0, len(lines) - 6), len(lines)):
            first = lines[i].strip().lower()
            if first and all(t in first for t in name_tokens):
                return "\n".join(lines[:i]).rstrip()
    return body.rstrip()


def strip_footers(body: str) -> str:
    m = FOOTER_MARKERS.search(body)
    return body[: m.start()].rstrip() if m else body


def clean_reply(body: str, name_tokens: list[str]) -> str:
    body = strip_quoted_history(body)
    body = strip_footers(body)
    body = strip_signature(body, name_tokens)
    body = re.sub(r"\n{3,}", "\n\n", body)
    return body.strip()


def clean_incoming(body: str) -> str:
    """Incoming mail keeps more context but still drop footers and deep quotes."""
    body = strip_footers(strip_quoted_history(body))
    body = re.sub(r"\n{3,}", "\n\n", body)
    return body.strip()[:6000]  # cap pathological threads


# ---------------------------------------------------------------- pairing


def address_in(header: str, addresses: set[str]) -> bool:
    header = (header or "").lower()
    return any(a in header for a in addresses)


def build_pairs(raw_path: Path, my_addresses: set[str], name_tokens: list[str]):
    by_id: dict[str, dict] = {}
    records = []
    with raw_path.open(encoding="utf-8") as fh:
        for line in fh:
            rec = json.loads(line)
            records.append(rec)
            if rec["message_id"]:
                by_id[rec["message_id"]] = rec

    pairs, dropped = [], {"no_parent": 0, "not_mine": 0, "noise": 0, "too_short": 0, "dupe": 0}
    seen_hashes = set()

    for rec in records:
        if not address_in(rec["from"], my_addresses):
            dropped["not_mine"] += 1
            continue
        # resolve the message this reply answers
        parent = None
        for ref in [rec["in_reply_to"], *reversed(rec["references"].split())]:
            ref = ref.strip()
            if ref and ref in by_id:
                parent = by_id[ref]
                break
        if parent is None or address_in(parent["from"], my_addresses):
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
        if len(reply) < 80 or len(reply.split()) < 15 or not incoming:
            dropped["too_short"] += 1
            continue

        h = hashlib.sha1(re.sub(r"\s+", " ", reply.lower()).encode()).hexdigest()
        if h in seen_hashes:
            dropped["dupe"] += 1
            continue
        seen_hashes.add(h)

        pairs.append(
            {
                "incoming": {
                    "from": parent["from"],
                    "subject": parent["subject"],
                    "body": incoming,
                },
                "reply": reply,
                "date": rec["date"],
            }
        )
    return pairs, dropped


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

    pairs, dropped = build_pairs(
        Path(args.raw), {a.lower() for a in args.my_addresses}, name_tokens
    )
    print(f"Usable pairs: {len(pairs)}  (dropped: {dropped})")
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
