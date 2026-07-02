#!/usr/bin/env bash
# Merge the LoRA adapter into the base model, convert to GGUF, quantize Q4_K_M.
#
# Merging runs on CPU in fp16 — the DL380's 160GB RAM handles the 31B (~62GB)
# easily, and it leaves the GPUs free.
#
# Usage: bash 05_merge_and_gguf.sh <adapter_dir> <base_model_id> <llama_cpp_dir>
#   e.g. bash 05_merge_and_gguf.sh runs/31b google/gemma-4-31b-it ~/llama.cpp
set -euo pipefail

ADAPTER_DIR=${1:?usage: 05_merge_and_gguf.sh <adapter_dir> <base_model_id> <llama_cpp_dir>}
BASE_MODEL=${2:?missing base model id, e.g. google/gemma-4-31b-it}
LLAMA_CPP=${3:-"$HOME/llama.cpp"}

MERGED_DIR="$ADAPTER_DIR/merged"
NAME="email-voice-$(basename "$ADAPTER_DIR")"
F16_GGUF="$ADAPTER_DIR/$NAME-f16.gguf"
Q4_GGUF="$ADAPTER_DIR/$NAME-Q4_K_M.gguf"

echo "==> [1/3] Merging adapter into $BASE_MODEL (CPU, fp16)"
python - "$ADAPTER_DIR" "$BASE_MODEL" "$MERGED_DIR" <<'PY'
import sys
import torch
from peft import PeftModel
from transformers import AutoModelForCausalLM, AutoTokenizer

adapter_dir, base_model, merged_dir = sys.argv[1:4]
model = AutoModelForCausalLM.from_pretrained(
    base_model, torch_dtype=torch.float16, device_map="cpu", attn_implementation="eager"
)
model = PeftModel.from_pretrained(model, adapter_dir)
model = model.merge_and_unload()
model.save_pretrained(merged_dir, safe_serialization=True)
AutoTokenizer.from_pretrained(base_model).save_pretrained(merged_dir)
print(f"merged -> {merged_dir}")
PY

echo "==> [2/3] Converting to GGUF (f16)"
python "$LLAMA_CPP/convert_hf_to_gguf.py" "$MERGED_DIR" \
  --outfile "$F16_GGUF" --outtype f16

echo "==> [3/3] Quantizing Q4_K_M"
"$LLAMA_CPP/build/bin/llama-quantize" "$F16_GGUF" "$Q4_GGUF" Q4_K_M

echo
echo "Done: $Q4_GGUF"
echo "Reclaim disk when happy:  rm -rf '$MERGED_DIR' '$F16_GGUF'"
echo "Serve it:                 bash scripts/06_serve_demo.sh '$Q4_GGUF'"
