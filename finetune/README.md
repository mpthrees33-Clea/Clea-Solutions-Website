# Email Voice Model — Weekend Fine-Tuning Runbook

Fine-tune **Gemma 4** (Apache 2.0) on your own sent email so it drafts replies in
*your* voice — entirely on-prem, on 2× Tesla P40 (48GB VRAM) in an HP DL380 with
160GB RAM. Executed with Claude Code driving on the server.

**End state (Sunday night):** a side-by-side demo where the same incoming email
gets a draft from stock Gemma 4 and from *your* fine-tuned Gemma 4 — the
"bot vs me" moment — served locally by llama.cpp, with a live drafting UI.

---

## The pipeline (say this correctly in the meeting)

1. **Quantize** the base model to 4-bit NF4 (bitsandbytes) and **freeze** it.
2. **Attach LoRA adapters** — small trainable matrices — to the attention and MLP
   projection layers. Choosing target modules + rank is the "which parameters
   matter" decision. This is **QLoRA**: quantized base, trainable adapters.
3. **Train only the adapters** on (incoming email → your actual reply) pairs.
4. **Merge** the adapters back into the base weights (fp16).
5. **Re-quantize** the merged model to GGUF Q4_K_M and serve with llama.cpp.

Fine-tuning teaches **tone, format, and voice**. It does not teach facts —
facts come from grounding/context. That split is the sophisticated position
(and it's exactly what clea-solutions.ai already argues).

## Hardware constraints you must respect (Tesla P40 = Pascal, sm_61)

| Constraint | Consequence |
|---|---|
| No bf16, fp16 compute is ~1/64 speed | Use `bnb_4bit_compute_dtype=float32` and fp32 training compute. Never `bf16=True`. |
| No FlashAttention (needs Ampere+) | `attn_implementation="eager"` everywhere. |
| Unsloth requires compute ≥ 7.0 | **Unsloth will not run.** Stack is TRL + PEFT + bitsandbytes. |
| Recent torch wheels drop old archs | Pin a torch build that still includes sm_61 — `00_env_check.py` verifies before anything else. |
| 24GB per card, no NVLink | 31B trains with `device_map="auto"` (layer split across both cards), batch 1 + grad accum. |
| P40s excel at llama.cpp inference | Serve GGUF with `--split-mode row` across both cards. This is the demo path. |

**Model ladder:** `gemma-4-e4b-it` → `gemma-4-12b-it` → `gemma-4-31b-it` (all dense).
**Do not try to QLoRA `gemma-4-26B-A4B`** — bitsandbytes cannot quantize its fused
3D expert tensors yet. Use the MoE only as an inference-speed comparison (it runs
like a 4B on the P40s).

**Fallback models if Gemma 4's tuned voice disappoints** (all Apache 2.0 / MIT,
same scripts work with `--model` override): Mistral Small 3.x 24B (Apache 2.0),
Qwen3 14B/32B dense (Apache 2.0), Phi-4 14B (MIT), GLM-4-32B-0414 (MIT).

---

## Friday night — environment + data (burn zero GPU-hours on this Saturday)

### 1. Environment

```bash
cd finetune
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt        # adjust torch pin if 00_env_check fails
python scripts/00_env_check.py         # MUST be all green before continuing
```

`00_env_check.py` verifies: both P40s visible, torch wheel actually contains
sm_61 kernels (tiny matmul on each GPU), bitsandbytes NF4 round-trip, and that
transformers resolves the Gemma 4 architecture. If the matmul fails with
`no kernel image is available`, your torch wheel dropped Pascal — install an
older cu12x wheel (try stepping down minor versions) until it passes.

```bash
# Gemma 4 weights (Apache 2.0 — no license gate, but set HF_TOKEN if you have one for rate limits)
hf download google/gemma-4-e4b-it
hf download google/gemma-4-12b-it
hf download google/gemma-4-31b-it
# MoE for the inference-speed comparison only (prebuilt GGUF, no training)
hf download unsloth/gemma-4-26B-A4B-it-GGUF --include "*Q4_K_M*"
```

Also build llama.cpp now (needed Sunday, and its `convert_hf_to_gguf.py` for step 05):

```bash
git clone https://github.com/ggml-org/llama.cpp ~/llama.cpp
cmake -B ~/llama.cpp/build -S ~/llama.cpp -DGGML_CUDA=ON
cmake --build ~/llama.cpp/build --config Release -j"$(nproc)"
```

### 2. Dataset from your Outlook archive

```bash
python scripts/01_extract_outlook.py --input /path/to/outlook-archive --out data/raw_messages.jsonl
python scripts/02_build_dataset.py \
  --raw data/raw_messages.jsonl \
  --my-addresses you@company.com you@clea-solutions.ai \
  --out-dir data/
```

`01` handles `.pst` (via `readpst` — `apt install pst-utils`), folders of `.msg`
(via `extract-msg`), `.eml`, and `.mbox`. `02` pairs each reply you *sent* with
the message it answered (via `In-Reply-To`/`References`), then cleans:

- strips signatures, quoted history (`On ... wrote:`, `-----Original Message-----`), legal footers
- drops one-liners ("thanks!"), auto-replies, forwards, calendar noise
- dedupes near-identical replies
- emits `data/train.jsonl`, `data/val.jsonl`, and holds out `data/eval_inbox.jsonl`
  (~20 incoming emails whose real replies are kept aside as reference)

**Target: 200–1,000 pairs.** Below ~150, tone transfer gets weak.
**Review `data/train.jsonl` by hand for 10 minutes.** Data quality is the whole
game — every cleaning miss (a signature, a quoted thread) is something the model
will faithfully learn to regurgitate.

Each example is chat-format JSONL (the trainer applies the Gemma 4 chat template):

```json
{"messages": [
  {"role": "system", "content": "You draft email replies as <NAME>, <ROLE>. Match his voice: direct, warm, no corporate filler."},
  {"role": "user", "content": "From: ...\nSubject: ...\n\n<incoming email body>"},
  {"role": "assistant", "content": "<your verbatim reply>"}
]}
```

---

## Saturday — the ladder

**Rule of the ladder: if a rung doesn't sound like you, fix the DATASET, not the
hyperparameters, and rerun that rung.** Small model + clean data beats big model
+ dirty data every time.

### 3. E4B — prove the loop (~1 hr)

```bash
python scripts/03_train_qlora.py --model-size e4b --data-dir data/ --out-dir runs/e4b
python scripts/04_eval_side_by_side.py --adapter runs/e4b --model-size e4b --data-dir data/ --out reports/e4b.html
```

Open the report. You're looking for: your greetings, your sign-offs, your
sentence length, your bluntness/warmth — visibly different from base.

### 4. 12B — the credible middle (~3–5 hrs)

```bash
python scripts/03_train_qlora.py --model-size 12b --data-dir data/ --out-dir runs/12b
python scripts/04_eval_side_by_side.py --adapter runs/12b --model-size 12b --data-dir data/ --out reports/12b.html
```

### 5. 31B — kick off overnight (~8–16 hrs)

```bash
nohup python scripts/03_train_qlora.py --model-size 31b --data-dir data/ --out-dir runs/31b \
  > runs/31b.log 2>&1 &
tail -f runs/31b.log
```

Checkpoints save every 50 steps (`--save-steps`), so a crash resumes with
`--resume`. Watch the first 10 steps for OOM before walking away; if it OOMs,
retry with `--seq-len 1536` then `--seq-len 1024`.

Preset details (all sizes): NF4 double-quant, fp32 compute, eager attention,
LoRA r=16 α=32 dropout=0.05 on all linear projections, lr 2e-4 cosine,
2–3 epochs, gradient checkpointing, `paged_adamw_8bit` with automatic fallback
to `adamw_torch` if the bnb optimizer fails on Pascal.

---

## Sunday — merge, quantize, demo

### 6. Merge + GGUF

```bash
bash scripts/05_merge_and_gguf.sh runs/31b google/gemma-4-31b-it ~/llama.cpp
# → runs/31b/merged/  (fp16)  → runs/31b/email-voice-31b-Q4_K_M.gguf  (~19GB)
```

### 7. Serve + demo

```bash
bash scripts/06_serve_demo.sh runs/31b/email-voice-31b-Q4_K_M.gguf   # tuned :8081, base :8080
# then open demo/index.html in a browser on the LAN
```

`06` runs two `llama-server` instances with `--split-mode row` across both P40s
(base on :8080, tuned on :8081; add a third arg to also serve the 26B-A4B MoE on
:8082 for the speed comparison). Grab a prebuilt base GGUF so you don't have to
convert the stock model: `hf download ggml-org/gemma-4-31b-it-GGUF --include "*Q4_K_M*"`.
Two 31B Q4_K_M (~19GB each) barely fit in 48GB — if you OOM, drop context to
`-c 4096`, use the 12B as the stock "bot" side (~8GB, arguably a fairer
"what you'd get off the shelf" comparison anyway), or serve one at a time.
`demo/index.html` is a single self-contained page: paste an incoming email →
both drafts stream side-by-side, plus a live drafting box. **This is the
artifact you show.**

### 8. Capture for the website

- Screenshot 3–4 side-by-side pairs (sanitize names/companies).
- Record a 60–90s screen capture of the live demo.
- Note the real numbers: dataset size, training wall-clock per rung, GPU cost ($0).
- Drop assets into `public/email-voice/` in the website repo, replace the TODOs
  in `src/app/email-voice/page.tsx`, push.

---

## Talking points for the company

1. **"This is why the bots you've seen sound like bots."** Off-the-shelf models
   have an off-the-shelf voice. Fine-tuning is how you get *your* voice —
   demonstrated live, same email, two drafts.
2. **Tone from fine-tuning, facts from grounding.** The model drafts in my voice;
   what it *says* is grounded in the thread and our data. Two different problems,
   two different tools — vendors selling one as the other is the cringe you've seen.
3. **No email left the building.** Trained and served on our own hardware.
   That's the answer to every privacy/compliance objection.
4. **Apache 2.0.** We own the result. No per-seat SaaS, no vendor lock-in,
   redistribution and commercial use allowed.
5. **Cost:** electricity. The same pipeline scales to rented GPUs when speed matters.

## Troubleshooting quick-refs

| Symptom | Fix |
|---|---|
| `no kernel image is available for execution` | torch wheel lacks sm_61 — step down torch versions (see 00_env_check output) |
| OOM on 31B | `--seq-len 1536` → `1024`; confirm gradient checkpointing on; close llama-server instances |
| bnb optimizer crash on Pascal | rerun with `--optimizer adamw_torch` |
| Loss ~0 immediately / gibberish output | chat template mismatch — retrain; confirm dataset is `messages` format, don't pre-apply the template |
| Tuned model parrots signatures/quoted text | cleaning miss — fix `02_build_dataset.py` filters, rebuild, retrain the small rung |
| llama-server slow / single-GPU | ensure `-ngl 999 --split-mode row` and both cards visible in `nvidia-smi` |
