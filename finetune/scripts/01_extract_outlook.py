#!/usr/bin/env python3
"""Extract raw messages from an Outlook archive into JSONL.

Accepts any of:
  - a .pst file            (converted via `readpst` — apt install pst-utils)
  - a .mbox file
  - a directory containing .msg / .eml / .mbox files (searched recursively)

Output: one JSON object per message with the fields needed for reply-pairing:
  message_id, in_reply_to, references, from, to, date, subject, body

Usage:
  python 01_extract_outlook.py --input /path/to/archive.pst --out data/raw_messages.jsonl
"""

import argparse
import email
import email.policy
import json
import mailbox
import shutil
import subprocess
import sys
import tempfile
from email.message import EmailMessage
from pathlib import Path


def body_text(msg: EmailMessage) -> str:
    """Prefer text/plain; fall back to stripping tags from text/html."""
    part = msg.get_body(preferencelist=("plain", "html"))
    if part is None:
        return ""
    content = part.get_content()
    if part.get_content_type() == "text/html":
        import re

        content = re.sub(r"<(script|style)[^>]*>.*?</\1>", " ", content, flags=re.S | re.I)
        content = re.sub(r"<br\s*/?>|</p>|</div>", "\n", content, flags=re.I)
        content = re.sub(r"<[^>]+>", " ", content)
        content = (
            content.replace("&nbsp;", " ")
            .replace("&amp;", "&")
            .replace("&lt;", "<")
            .replace("&gt;", ">")
            .replace("&quot;", '"')
            .replace("&#39;", "'")
        )
    return content.strip()


def record_from_email(msg: EmailMessage) -> dict | None:
    try:
        body = body_text(msg)
    except Exception:
        return None
    if not body:
        return None
    return {
        "message_id": (msg.get("Message-ID") or "").strip(),
        "in_reply_to": (msg.get("In-Reply-To") or "").strip(),
        "references": (msg.get("References") or "").strip(),
        "from": (msg.get("From") or "").strip(),
        "to": (msg.get("To") or "").strip(),
        "date": (msg.get("Date") or "").strip(),
        "subject": (msg.get("Subject") or "").strip(),
        "body": body,
    }


def iter_mbox(path: Path):
    box = mailbox.mbox(str(path), factory=None)
    for raw in box:
        msg = email.message_from_bytes(bytes(raw), policy=email.policy.default)
        rec = record_from_email(msg)
        if rec:
            yield rec


def iter_eml(path: Path):
    msg = email.message_from_bytes(path.read_bytes(), policy=email.policy.default)
    rec = record_from_email(msg)
    if rec:
        yield rec


def iter_msg(path: Path):
    """Outlook .msg via the extract-msg library."""
    import extract_msg

    m = extract_msg.openMsg(str(path))
    try:
        headers = m.header
        rec = {
            "message_id": (headers.get("Message-ID") or "").strip() if headers else "",
            "in_reply_to": (headers.get("In-Reply-To") or "").strip() if headers else "",
            "references": (headers.get("References") or "").strip() if headers else "",
            "from": (m.sender or "").strip(),
            "to": (m.to or "").strip(),
            "date": str(m.date or "").strip(),
            "subject": (m.subject or "").strip(),
            "body": (m.body or "").strip(),
        }
        if rec["body"]:
            yield rec
    finally:
        m.close()


def iter_pst(path: Path):
    """Convert .pst → mbox tree with readpst, then walk the mboxes."""
    if shutil.which("readpst") is None:
        sys.exit("readpst not found. Install with: apt install pst-utils")
    with tempfile.TemporaryDirectory(prefix="pst_extract_") as tmp:
        print(f"  running readpst (large archives take a while)...", flush=True)
        subprocess.run(
            ["readpst", "-r", "-e", "-D", "-o", tmp, str(path)],
            check=True,
            capture_output=True,
        )
        # -e writes individual .eml files in a folder tree
        for eml in Path(tmp).rglob("*.eml"):
            yield from iter_eml(eml)


def iter_input(input_path: Path):
    if input_path.is_file():
        suffix = input_path.suffix.lower()
        if suffix == ".pst":
            yield from iter_pst(input_path)
        elif suffix == ".mbox":
            yield from iter_mbox(input_path)
        elif suffix == ".eml":
            yield from iter_eml(input_path)
        elif suffix == ".msg":
            yield from iter_msg(input_path)
        else:
            sys.exit(f"Unrecognized file type: {input_path}")
        return
    # Directory: walk recursively
    handlers = {".eml": iter_eml, ".msg": iter_msg, ".mbox": iter_mbox, ".pst": iter_pst}
    found = False
    for ext, handler in handlers.items():
        for f in sorted(input_path.rglob(f"*{ext}")):
            found = True
            try:
                yield from handler(f)
            except Exception as e:  # noqa: BLE001 - skip corrupt files, keep going
                print(f"  skipping {f.name}: {type(e).__name__}: {e}", file=sys.stderr)
    if not found:
        sys.exit(f"No .pst/.mbox/.eml/.msg files found under {input_path}")


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--input", required=True, help=".pst/.mbox/.eml/.msg file or directory of them")
    ap.add_argument("--out", default="data/raw_messages.jsonl")
    args = ap.parse_args()

    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)

    n = 0
    seen_ids = set()
    with out.open("w", encoding="utf-8") as fh:
        for rec in iter_input(Path(args.input)):
            mid = rec["message_id"]
            if mid and mid in seen_ids:
                continue
            if mid:
                seen_ids.add(mid)
            fh.write(json.dumps(rec, ensure_ascii=False) + "\n")
            n += 1
            if n % 1000 == 0:
                print(f"  {n} messages...", flush=True)

    print(f"Wrote {n} messages → {out}")
    if n < 300:
        print("Note: low message count — pairing typically yields ~10-30% of messages")
        print("as usable (incoming → reply) pairs. You want 200+ pairs.")


if __name__ == "__main__":
    main()
