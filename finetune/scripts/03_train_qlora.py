#!/usr/bin/env python3
"""QLoRA fine-tune Gemma 4 (dense sizes) on the email dataset — Pascal-safe.

Tesla P40 (sm_61) rules baked in:
  - NF4 quantized base with fp32 compute (bnb_4bit_compute_dtype=float32)
  - eager attention (no FlashAttention on Pascal)
  - no bf16/fp16 autocast — fp32 all the way
  - gradient checkpointing + batch 1 + grad accum for the big sizes

Usage:
  python 03_train_qlora.py --model-size e4b --data-dir data/ --out-dir runs/e4b
  python 03_train_qlora.py --model-size 31b --data-dir data/ --out-dir runs/31b --resume
  python 03_train_qlora.py --model google/gemma-4-12b-it ...   # explicit override

Do NOT point this at gemma-4-26B-A4B: bitsandbytes cannot quantize its fused
MoE expert tensors — QLoRA on the MoE is blocked. Dense sizes only.
"""

import argparse
from pathlib import Path

PRESETS = {
    # model id, per-device batch, grad accum, seq len, epochs
    # batch 1 even on the small size: fp32 activations at seq 2048 OOM a 24GB
    # P40 at batch 2 (device_map=auto splits layers unevenly)
    "e4b": dict(model="google/gemma-4-e4b-it", batch=1, grad_accum=16, seq_len=2048, epochs=3),
    "12b": dict(model="google/gemma-4-12b-it", batch=1, grad_accum=16, seq_len=2048, epochs=2),
    "31b": dict(model="google/gemma-4-31b-it", batch=1, grad_accum=16, seq_len=2048, epochs=2),
}


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--model-size", choices=PRESETS.keys(), default="e4b")
    ap.add_argument("--model", default=None, help="explicit HF model id (overrides --model-size)")
    ap.add_argument("--data-dir", default="data/")
    ap.add_argument("--out-dir", required=True)
    ap.add_argument("--seq-len", type=int, default=None, help="lower to 1536/1024 on 31B OOM")
    ap.add_argument("--epochs", type=float, default=None)
    ap.add_argument("--lr", type=float, default=2e-4)
    ap.add_argument("--lora-r", type=int, default=16)
    ap.add_argument("--lora-alpha", type=int, default=32)
    ap.add_argument("--optimizer", default="paged_adamw_8bit",
                    help="fallback to adamw_torch if the bnb optimizer fails on Pascal")
    ap.add_argument("--save-steps", type=int, default=50)
    ap.add_argument("--resume", action="store_true", help="resume from last checkpoint in out-dir")
    args = ap.parse_args()

    preset = PRESETS[args.model_size]
    model_id = args.model or preset["model"]
    seq_len = args.seq_len or preset["seq_len"]
    epochs = args.epochs or preset["epochs"]

    if "a4b" in model_id.lower():
        raise SystemExit("Refusing: QLoRA on the 26B-A4B MoE is blocked (bnb can't quantize "
                         "fused expert tensors). Use a dense size.")

    import torch
    from datasets import load_dataset
    from peft import LoraConfig
    from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig
    from trl import SFTConfig, SFTTrainer

    data_dir = Path(args.data_dir)
    dataset = load_dataset(
        "json",
        data_files={"train": str(data_dir / "train.jsonl"), "val": str(data_dir / "val.jsonl")},
    )
    print(f"train={len(dataset['train'])} val={len(dataset['val'])} model={model_id} "
          f"seq_len={seq_len} epochs={epochs}")

    quant_config = BitsAndBytesConfig(
        load_in_4bit=True,
        bnb_4bit_quant_type="nf4",
        bnb_4bit_use_double_quant=True,
        bnb_4bit_compute_dtype=torch.float32,  # Pascal: fp16 compute is ~1/64 speed
    )

    tokenizer = AutoTokenizer.from_pretrained(model_id)
    model = AutoModelForCausalLM.from_pretrained(
        model_id,
        quantization_config=quant_config,
        attn_implementation="eager",  # no FlashAttention on sm_61
        torch_dtype=torch.float32,
        device_map="auto",  # layer-split the 31B across both P40s
    )
    model.config.use_cache = False  # incompatible with gradient checkpointing

    peft_config = LoraConfig(
        r=args.lora_r,
        lora_alpha=args.lora_alpha,
        lora_dropout=0.05,
        bias="none",
        task_type="CAUSAL_LM",
        # regex, not list: the vision/audio towers reuse these proj names but
        # wrap them in Gemma4ClippableLinear, which PEFT can't adapt. Scope to
        # everything OUTSIDE the towers (text-only fine-tune anyway).
        target_modules=r"^(?!.*(?:vision_tower|audio_tower)).*\.(?:q_proj|k_proj|v_proj|o_proj|gate_proj|up_proj|down_proj)$",
    )

    sft_config = SFTConfig(
        output_dir=args.out_dir,
        num_train_epochs=epochs,
        per_device_train_batch_size=preset["batch"],
        per_device_eval_batch_size=1,  # batch 8 default OOMs: fp32 logits at seq 2048
        gradient_accumulation_steps=preset["grad_accum"],
        learning_rate=args.lr,
        lr_scheduler_type="cosine",
        warmup_ratio=0.05,
        max_length=seq_len,
        optim=args.optimizer,
        bf16=False,  # P40 has no bf16
        fp16=False,  # P40 fp16 compute is crippled — stay fp32
        gradient_checkpointing=True,
        gradient_checkpointing_kwargs={"use_reentrant": False},
        logging_steps=5,
        save_steps=args.save_steps,
        save_total_limit=3,
        eval_strategy="steps",
        eval_steps=args.save_steps,
        report_to="none",
        seed=42,
    )

    trainer = SFTTrainer(
        model=model,
        args=sft_config,
        train_dataset=dataset["train"],
        eval_dataset=dataset["val"],
        processing_class=tokenizer,
        peft_config=peft_config,
    )

    trainable = sum(p.numel() for p in trainer.model.parameters() if p.requires_grad)
    total = sum(p.numel() for p in trainer.model.parameters())
    print(f"trainable params: {trainable:,} ({100 * trainable / total:.2f}% of {total:,})")

    trainer.train(resume_from_checkpoint=args.resume or None)
    trainer.save_model(args.out_dir)  # adapter + config
    tokenizer.save_pretrained(args.out_dir)
    print(f"\nAdapter saved → {args.out_dir}")
    print(f"Next: python scripts/04_eval_side_by_side.py --adapter {args.out_dir} "
          f"--model-size {args.model_size} --data-dir {args.data_dir} "
          f"--out reports/{args.model_size}.html")


if __name__ == "__main__":
    main()
