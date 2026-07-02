#!/usr/bin/env python3
"""Preflight for QLoRA on Tesla P40s (Pascal, sm_61).

Run this before anything else. Every check must be green.
Pascal is old enough that modern wheels silently drop it — the failure mode is
a cryptic "no kernel image is available" hours into setup, so we force it now.
"""

import sys

GREEN = "\033[92m✓\033[0m"
RED = "\033[91m✗\033[0m"

failures = []


def check(name, fn):
    try:
        detail = fn() or ""
        print(f"{GREEN} {name} {detail}")
    except Exception as e:  # noqa: BLE001 - report everything, fail at the end
        print(f"{RED} {name}: {type(e).__name__}: {e}")
        failures.append(name)


def gpus_visible():
    import torch

    if not torch.cuda.is_available():
        raise RuntimeError("torch.cuda.is_available() is False — check driver / CUDA install")
    n = torch.cuda.device_count()
    names = []
    for i in range(n):
        cap = torch.cuda.get_device_capability(i)
        name = torch.cuda.get_device_name(i)
        names.append(f"{name} (sm_{cap[0]}{cap[1]})")
        if cap < (6, 0):
            raise RuntimeError(f"GPU {i} {name} is pre-Pascal — unsupported")
    if n < 2:
        print(f"  warning: expected 2 GPUs, found {n}")
    return "— " + ", ".join(names)


def sm61_kernels_present():
    """The real test: run a matmul on every GPU. A wheel built without sm_61
    imports fine but dies here with 'no kernel image is available'."""
    import torch

    for i in range(torch.cuda.device_count()):
        a = torch.randn(256, 256, device=f"cuda:{i}")
        (a @ a).sum().item()
        torch.cuda.synchronize(i)
    return f"— torch {torch.__version__} wheel includes Pascal kernels"


def fp32_compute_sanity():
    """P40 fp16 is ~1/64 speed; training must run fp32 compute. Just confirm
    fp32 GEMM works and bf16 is correctly reported unsupported."""
    import torch

    if torch.cuda.is_bf16_supported():
        print("  note: bf16 reported supported — unexpected on P40, double-check GPU model")
    a = torch.randn(512, 512, device="cuda", dtype=torch.float32)
    (a @ a).sum().item()
    return "— fp32 GEMM ok (use bnb_4bit_compute_dtype=float32, never bf16)"


def bitsandbytes_nf4():
    import torch
    from bitsandbytes.nn import Linear4bit

    layer = Linear4bit(
        256, 256, bias=False, quant_type="nf4", compute_dtype=torch.float32
    ).cuda()
    x = torch.randn(4, 256, device="cuda", dtype=torch.float32)
    layer(x).sum().item()
    import bitsandbytes as bnb

    return f"— bitsandbytes {bnb.__version__} NF4 forward pass ok"


def transformers_gemma4():
    import transformers
    from transformers import AutoConfig

    # Resolves the architecture from the hub config without downloading weights.
    AutoConfig.from_pretrained("google/gemma-4-e4b-it")
    return f"— transformers {transformers.__version__} resolves Gemma 4"


def trl_peft_importable():
    import peft
    import trl

    return f"— trl {trl.__version__}, peft {peft.__version__}"


def readpst_available():
    import shutil

    if shutil.which("readpst") is None:
        raise RuntimeError("readpst not found — needed only for .pst input: apt install pst-utils")
    return "— readpst on PATH (needed for .pst archives)"


def main():
    check("GPUs visible", gpus_visible)
    check("Pascal (sm_61) kernels in torch wheel", sm61_kernels_present)
    check("fp32 compute path", fp32_compute_sanity)
    check("bitsandbytes NF4 quantization", bitsandbytes_nf4)
    check("transformers Gemma 4 support", transformers_gemma4)
    check("TRL + PEFT importable", trl_peft_importable)
    check("readpst (optional, .pst only)", readpst_available)

    hard_failures = [f for f in failures if not f.startswith("readpst")]
    if hard_failures:
        print(f"\n{len(hard_failures)} check(s) failed: {', '.join(hard_failures)}")
        print("Fix these before spending any GPU time. If the Pascal-kernel check")
        print("failed, install progressively older torch cu12x wheels until it passes.")
        sys.exit(1)
    print("\nAll checks green — safe to start the ladder.")


if __name__ == "__main__":
    main()
