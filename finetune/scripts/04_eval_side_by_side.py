#!/usr/bin/env python3
"""Generate base-vs-tuned drafts for the held-out inbox and write an HTML report.

Loads the quantized base once, generates all base drafts, then attaches the
LoRA adapter in-place and generates the tuned drafts — one model in VRAM at a
time. Output: an HTML table per email — incoming | stock model | fine-tuned |
your actual reply — the artifact that shows whether it sounds like you.

Usage:
  python 04_eval_side_by_side.py --adapter runs/e4b --model-size e4b \
      --data-dir data/ --out reports/e4b.html
"""

import argparse
import html
import json
from pathlib import Path

PRESETS = {
    "e4b": "google/gemma-4-e4b-it",
    "12b": "google/gemma-4-12b-it",
    "31b": "google/gemma-4-31b-it",
}


def build_prompt(tokenizer, item):
    messages = [
        {"role": "system", "content": item["system_prompt"]},
        {
            "role": "user",
            "content": (
                f"From: {item['incoming']['from']}\n"
                f"Subject: {item['incoming']['subject']}\n\n"
                f"{item['incoming']['body']}\n\n"
                "Draft the reply."
            ),
        },
    ]
    return tokenizer.apply_chat_template(
        messages, tokenize=False, add_generation_prompt=True
    )


def generate_all(model, tokenizer, items, label, max_new_tokens):
    import torch

    outputs = []
    for i, item in enumerate(items):
        prompt = build_prompt(tokenizer, item)
        inputs = tokenizer(prompt, return_tensors="pt").to(model.device)
        with torch.no_grad():
            out = model.generate(
                **inputs,
                max_new_tokens=max_new_tokens,
                do_sample=True,
                temperature=0.7,
                top_p=0.9,
                pad_token_id=tokenizer.eos_token_id,
            )
        text = tokenizer.decode(out[0][inputs["input_ids"].shape[1]:], skip_special_tokens=True)
        outputs.append(text.strip())
        print(f"  [{label}] {i + 1}/{len(items)}", flush=True)
    return outputs


HTML_HEAD = """<!doctype html><meta charset="utf-8">
<title>Email voice eval — base vs fine-tuned</title>
<style>
body{font:14px/1.5 -apple-system,Segoe UI,sans-serif;margin:2rem;max-width:1400px}
h1{font-size:1.3rem} .case{border:1px solid #ccc;border-radius:8px;margin:1.5rem 0;overflow:hidden}
.case h2{font-size:.95rem;background:#f4f4f4;margin:0;padding:.6rem 1rem}
.cols{display:grid;grid-template-columns:repeat(4,1fr);gap:0}
.col{padding:1rem;border-left:1px solid #eee;white-space:pre-wrap;overflow-wrap:anywhere}
.col b{display:block;margin-bottom:.5rem;font-size:.75rem;letter-spacing:.08em;text-transform:uppercase;color:#666}
.tuned{background:#f3fff3}
</style>
<h1>Base vs fine-tuned — does it sound like you?</h1>
<p>Green column is the fine-tune. Compare greetings, sign-offs, sentence length, formality.</p>
"""


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--adapter", required=True, help="adapter dir from 03_train_qlora.py")
    ap.add_argument("--model-size", choices=PRESETS.keys(), default="e4b")
    ap.add_argument("--model", default=None, help="explicit HF model id override")
    ap.add_argument("--data-dir", default="data/")
    ap.add_argument("--out", default="reports/eval.html")
    ap.add_argument("--max-new-tokens", type=int, default=400)
    ap.add_argument("--limit", type=int, default=0, help="only eval first N emails")
    args = ap.parse_args()

    import torch
    from peft import PeftModel
    from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig

    model_id = args.model or PRESETS[args.model_size]
    items = [
        json.loads(line)
        for line in Path(args.data_dir, "eval_inbox.jsonl").read_text(encoding="utf-8").splitlines()
    ]
    if args.limit:
        items = items[: args.limit]
    print(f"{len(items)} held-out emails, model={model_id}")

    tokenizer = AutoTokenizer.from_pretrained(model_id)
    model = AutoModelForCausalLM.from_pretrained(
        model_id,
        quantization_config=BitsAndBytesConfig(
            load_in_4bit=True,
            bnb_4bit_quant_type="nf4",
            bnb_4bit_use_double_quant=True,
            bnb_4bit_compute_dtype=torch.float32,
        ),
        attn_implementation="eager",
        torch_dtype=torch.float32,
        device_map="auto",
    )

    base_drafts = generate_all(model, tokenizer, items, "base", args.max_new_tokens)

    model = PeftModel.from_pretrained(model, args.adapter)
    tuned_drafts = generate_all(model, tokenizer, items, "tuned", args.max_new_tokens)

    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    parts = [HTML_HEAD]
    for item, base, tuned in zip(items, base_drafts, tuned_drafts):
        e = lambda s: html.escape(s)  # noqa: E731
        parts.append(
            f'<div class="case"><h2>{e(item["incoming"]["subject"])} '
            f'<small>— from {e(item["incoming"]["from"])}</small></h2><div class="cols">'
            f'<div class="col"><b>Incoming</b>{e(item["incoming"]["body"])}</div>'
            f'<div class="col"><b>Stock {e(model_id.split("/")[-1])}</b>{e(base)}</div>'
            f'<div class="col tuned"><b>Fine-tuned (you)</b>{e(tuned)}</div>'
            f'<div class="col"><b>Your actual reply</b>{e(item["reference_reply"])}</div>'
            "</div></div>"
        )
    out.write_text("".join(parts), encoding="utf-8")
    print(f"\nReport → {out}")
    print("If the green column doesn't sound like you: fix the dataset, retrain this rung.")


if __name__ == "__main__":
    main()
