#!/usr/bin/env bash
# Serve base + fine-tuned models with llama.cpp across both P40s.
#
#   :8080  stock base model      (the "bot")
#   :8081  your fine-tuned model (the "you")
#   :8082  gemma-4-26B-A4B MoE   (optional speed comparison — runs like a 4B)
#
# Then open demo/index.html in a browser on the LAN.
#
# Usage: bash 06_serve_demo.sh <tuned.gguf> [base.gguf] [moe.gguf]
#
# Get a prebuilt base GGUF (avoids converting the base yourself):
#   hf download ggml-org/gemma-4-31b-it-GGUF --include "*Q4_K_M*"
set -euo pipefail

TUNED_GGUF=${1:?usage: 06_serve_demo.sh <tuned.gguf> [base.gguf] [moe.gguf]}
BASE_GGUF=${2:-}
MOE_GGUF=${3:-}
LLAMA_SERVER=${LLAMA_SERVER:-"$HOME/llama.cpp/build/bin/llama-server"}

# P40 sweet spot: all layers on GPU, row-split across both cards.
COMMON_ARGS=(-ngl 999 --split-mode row -c 8192 --host 0.0.0.0)

PIDS=()
cleanup() { kill "${PIDS[@]}" 2>/dev/null || true; }
trap cleanup EXIT INT TERM

if [[ -n "$BASE_GGUF" ]]; then
  echo "==> base  :8080  $BASE_GGUF"
  "$LLAMA_SERVER" -m "$BASE_GGUF" --port 8080 "${COMMON_ARGS[@]}" --alias base &
  PIDS+=($!)
else
  echo "==> no base GGUF given — side-by-side needs one on :8080."
  echo "    hf download ggml-org/gemma-4-31b-it-GGUF --include \"*Q4_K_M*\""
fi

echo "==> tuned :8081  $TUNED_GGUF"
"$LLAMA_SERVER" -m "$TUNED_GGUF" --port 8081 "${COMMON_ARGS[@]}" --alias tuned &
PIDS+=($!)

if [[ -n "$MOE_GGUF" ]]; then
  echo "==> moe   :8082  $MOE_GGUF"
  "$LLAMA_SERVER" -m "$MOE_GGUF" --port 8082 "${COMMON_ARGS[@]}" --alias moe &
  PIDS+=($!)
fi

echo
echo "VRAM note: two 31B Q4_K_M models (~19GB each) barely fit in 48GB — if you"
echo "see OOM, lower context (-c 4096), pair the tuned 31B with a smaller stock"
echo "base (12B, ~8GB), or serve one at a time."
echo
echo "Open finetune/demo/index.html — endpoints are configurable in the page."
wait
