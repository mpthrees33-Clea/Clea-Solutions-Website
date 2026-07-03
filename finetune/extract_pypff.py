#!/usr/bin/env python3
"""Robust PST -> JSONL extractor using libpff (pypff) instead of readpst.

readpst 0.6.76 segfaults on some of these split PSTs (the Inbox parts). libpff
reads them fine. Emits the SAME record schema as scripts/01_extract_outlook.py so
scripts/02_build_dataset.py consumes it unchanged:
  message_id, in_reply_to, references, from, to, date, subject, body

Reply-pairing needs In-Reply-To/References, which live in the message's
transport_headers (RFC822). We parse those when present and fall back to MAPI
properties (sender_name, subject, submit time) when they're not.

Usage: python extract_pypff.py --input data/pst_parts --out data/raw_messages.jsonl
"""

import argparse
import email
import email.policy
import glob
import json
import os
import re
from pathlib import Path

import pypff


def strip_html(html: str) -> str:
    html = re.sub(r"<(script|style)[^>]*>.*?</\1>", " ", html, flags=re.S | re.I)
    html = re.sub(r"<br\s*/?>|</p>|</div>", "\n", html, flags=re.I)
    html = re.sub(r"<[^>]+>", " ", html)
    for a, b in (("&nbsp;", " "), ("&amp;", "&"), ("&lt;", "<"), ("&gt;", ">"),
                 ("&quot;", '"'), ("&#39;", "'")):
        html = html.replace(a, b)
    return html.strip()


def decode(v) -> str:
    if v is None:
        return ""
    if isinstance(v, bytes):
        return v.decode("utf-8", "replace")
    return str(v)


def body_of(msg) -> str:
    try:
        b = decode(msg.get_plain_text_body())
        if b.strip():
            return b.strip()
    except Exception:
        pass
    try:
        h = decode(msg.get_html_body())
        if h.strip():
            return strip_html(h)
    except Exception:
        pass
    try:
        return decode(msg.get_rtf_body())[:0]  # RTF is not worth de-compressing here
    except Exception:
        return ""


# MAPI property ids that mirror the RFC822 threading/addressing headers.
# Sent Items usually have no transport_headers, so these are the only source there.
PR_INTERNET_MESSAGE_ID = 0x1035
PR_INTERNET_REFERENCES = 0x1039
PR_IN_REPLY_TO_ID = 0x1042
PR_SENDER_SMTP_ADDRESS = 0x5D01
PR_DISPLAY_TO = 0x0E04

_WANTED_PROPS = {
    PR_INTERNET_MESSAGE_ID,
    PR_INTERNET_REFERENCES,
    PR_IN_REPLY_TO_ID,
    PR_SENDER_SMTP_ADDRESS,
    PR_DISPLAY_TO,
}


def mapi_props(msg) -> dict:
    out = {}
    try:
        rs = msg.get_record_set(0)
        for i in range(rs.get_number_of_entries()):
            e = rs.get_entry(i)
            et = e.get_entry_type()
            if et in _WANTED_PROPS:
                try:
                    out[et] = e.get_data_as_string() or ""
                except Exception:
                    pass
    except Exception:
        pass
    return out


def record(msg) -> dict | None:
    # Prefer the RFC822 transport headers (they carry the threading fields).
    hdr = None
    try:
        raw = msg.get_transport_headers()
        if raw:
            hdr = email.message_from_string(decode(raw), policy=email.policy.default)
    except Exception:
        hdr = None

    props = mapi_props(msg)

    body = body_of(msg)
    if not body:
        return None

    def h(name, default=""):
        return (hdr.get(name) if hdr else None) or default

    # MAPI fallbacks when headers are absent (common on Sent Items)
    from_ = h("From")
    if not from_:
        try:
            name = decode(msg.get_sender_name())
        except Exception:
            name = ""
        smtp = props.get(PR_SENDER_SMTP_ADDRESS, "").strip()
        if name and smtp:
            from_ = f"{name} <{smtp}>"
        else:
            from_ = name or smtp
    subject = h("Subject")
    if not subject:
        try:
            subject = decode(msg.get_subject())
        except Exception:
            subject = ""
    date = h("Date")
    if not date:
        try:
            date = str(msg.get_client_submit_time() or msg.get_delivery_time() or "")
        except Exception:
            date = ""

    return {
        "message_id": (h("Message-ID") or props.get(PR_INTERNET_MESSAGE_ID, "")).strip(),
        "in_reply_to": (h("In-Reply-To") or props.get(PR_IN_REPLY_TO_ID, "")).strip(),
        "references": (h("References") or props.get(PR_INTERNET_REFERENCES, "")).strip(),
        "from": from_.strip(),
        "to": (h("To") or props.get(PR_DISPLAY_TO, "")).strip(),
        "date": date.strip(),
        "subject": subject.strip(),
        "body": body,
    }


def walk(folder, out, counts):
    for i in range(folder.get_number_of_sub_messages()):
        counts["seen"] += 1
        try:
            rec = record(folder.get_sub_message(i))
        except Exception:
            counts["errored"] += 1
            continue
        if rec is None:
            counts["empty"] += 1
            continue
        out.append(rec)
    for j in range(folder.get_number_of_sub_folders()):
        walk(folder.get_sub_folder(j), out, counts)


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--input", required=True, help="dir of .pst files (or a single .pst)")
    ap.add_argument("--out", default="data/raw_messages.jsonl")
    args = ap.parse_args()

    inp = Path(args.input)
    psts = [str(inp)] if inp.is_file() else sorted(glob.glob(str(inp / "**/*.pst"), recursive=True))
    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)

    records, counts = [], {"seen": 0, "errored": 0, "empty": 0}
    for p in psts:
        f = pypff.file()
        try:
            f.open(p)
            walk(f.get_root_folder(), records, counts)
            print(f"  {os.path.basename(p)}: running total {len(records)} usable", flush=True)
        except Exception as e:  # keep going across files
            print(f"  {os.path.basename(p)}: FILE ERROR {type(e).__name__}: {e}")
        finally:
            f.close()

    n, seen_ids = 0, set()
    with out.open("w", encoding="utf-8") as fh:
        for rec in records:
            mid = rec["message_id"]
            if mid and mid in seen_ids:
                continue
            if mid:
                seen_ids.add(mid)
            fh.write(json.dumps(rec, ensure_ascii=False) + "\n")
            n += 1

    print(f"\nWrote {n} messages -> {out}")
    print(f"  raw seen={counts['seen']} errored={counts['errored']} empty(no body)={counts['empty']} "
          f"deduped={len(records) - n}")


if __name__ == "__main__":
    main()
