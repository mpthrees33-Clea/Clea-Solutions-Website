import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Email Voice Model · Fine-Tuned On-Prem | Clea Solutions",
  description:
    "A Gemma 4 model fine-tuned with QLoRA on real sent email, entirely on-prem, so drafts sound like the author — not a bot. Trained and served on our own hardware.",
};

// TODO(post-training): replace placeholder metrics below with real numbers
// from the weekend run — dataset size, wall-clock per rung, tok/s, and drop
// sanitized side-by-side screenshots into /public/email-voice/.

const STEPS = [
  {
    n: "01",
    name: "Data: real replies, ruthlessly cleaned",
    detail:
      "Every email the author actually sent, paired with the message it answered. Signatures, quoted history, and legal footers stripped; auto-replies, forwards, and one-liners dropped; near-duplicates removed. The model learns from what was really written — nothing else.",
  },
  {
    n: "02",
    name: "QLoRA: train 1% of the weights",
    detail:
      "The base model is quantized to 4-bit NF4 and frozen. Small low-rank adapters attach to the attention and MLP projections — the parameters that carry voice — and only those train. Full fine-tune quality of tone transfer at a fraction of the memory.",
  },
  {
    n: "03",
    name: "The ladder: E4B → 12B → 31B",
    detail:
      "Prove the loop on a 4B-class model in an hour, validate tone, then scale. Every data bug is caught on the cheap rung, not six hours into the 31B overnight run. The final target is Gemma 4 31B dense (Apache 2.0).",
  },
  {
    n: "04",
    name: "Held-out eval: base vs tuned vs reality",
    detail:
      "Twenty incoming emails the model never saw. For each: the stock model's draft, the fine-tuned draft, and the reply the author actually wrote. Greetings, sign-offs, sentence length, formality — side by side, no cherry-picking.",
  },
  {
    n: "05",
    name: "Merge, quantize, own it",
    detail:
      "Adapters merge back into the base weights, the result quantizes to GGUF Q4_K_M. The output is a single ~19GB file the company owns outright — Apache 2.0, no per-seat license, no vendor.",
  },
  {
    n: "06",
    name: "Served where the email lives",
    detail:
      "llama.cpp splits the model across both GPUs and serves an OpenAI-compatible endpoint on the LAN. No message ever leaves the building — training data, model, and inference all stay on-prem.",
  },
];

const STACK = [
  { name: "Gemma 4 31B (dense)", use: "Base model · Apache 2.0" },
  { name: "2× Tesla P40 · 48GB", use: "Training + inference GPUs" },
  { name: "HP DL380 · 160GB RAM", use: "On-prem server" },
  { name: "TRL + PEFT", use: "QLoRA supervised fine-tuning" },
  { name: "bitsandbytes NF4", use: "4-bit base quantization" },
  { name: "llama.cpp · GGUF Q4_K_M", use: "Serving, split across GPUs" },
  { name: "Python stdlib email", use: "Outlook archive extraction" },
  { name: "Claude Code", use: "Drove the whole pipeline" },
];

export default function EmailVoicePage() {
  return (
    <section className="section">
      <div className="container">
        <Link
          href="/work"
          className="mono"
          style={{
            display: "inline-block",
            marginBottom: "2.5rem",
            fontSize: "0.72rem",
            letterSpacing: "0.1em",
            color: "var(--ink-muted)",
          }}
        >
          ← ALL WORK
        </Link>

        {/* HERO */}
        <header style={{ marginBottom: "5rem" }}>
          <div className="eyebrow" style={{ marginBottom: "1.5rem" }}>
            (CASE STUDY) · On-prem fine-tuning
          </div>
          <h1
            className="display"
            style={{
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              marginBottom: "1.75rem",
              maxWidth: "900px",
            }}
          >
            Same model. Same email.{" "}
            <em style={{ fontStyle: "italic", color: "var(--ink-muted)" }}>
              One sounds like a bot. One sounds like me.
            </em>
          </h1>
          <p
            style={{
              fontSize: "1.15rem",
              color: "var(--ink-muted)",
              maxWidth: "680px",
              lineHeight: 1.65,
            }}
          >
            A Gemma 4 model fine-tuned with QLoRA on years of real sent email — trained,
            merged, quantized, and served entirely on our own hardware. Paste an incoming
            email, get two drafts: the stock model&rsquo;s, and one in the author&rsquo;s
            actual voice. No message ever left the building.
          </p>
        </header>

        <hr className="rule" style={{ marginBottom: "4rem" }} />

        {/* THE PROBLEM */}
        <section style={{ marginBottom: "5rem", maxWidth: "740px" }}>
          <div className="eyebrow" style={{ marginBottom: "1rem" }}>
            (01) · The problem
          </div>
          <h2
            className="display"
            style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", marginBottom: "1.5rem" }}
          >
            Everyone can smell an AI email.
          </h2>
          <p style={{ color: "var(--ink-muted)", lineHeight: 1.7, marginBottom: "1rem" }}>
            Off-the-shelf models have an off-the-shelf voice. Bolt one onto a mailbox and
            every customer gets the same eager, over-punctuated assistant-speak — &ldquo;I
            hope this email finds you well!&rdquo; — regardless of who is supposedly writing.
            It reads as outsourced attention, because it is.
          </p>
          <p style={{ color: "var(--ink-muted)", lineHeight: 1.7 }}>
            The fix isn&rsquo;t a longer prompt. Voice — greetings, sign-offs, sentence
            rhythm, when to be blunt and when to be warm — lives in the weights, and prompts
            only rent it. Fine-tuning moves it in permanently. Facts still come from
            grounding and context; that split — tone from tuning, truth from grounding —
            is the same conviction behind everything else we build.
          </p>
        </section>

        <hr className="rule" style={{ marginBottom: "4rem" }} />

        {/* THE METHOD */}
        <section style={{ marginBottom: "5rem" }}>
          <div className="eyebrow" style={{ marginBottom: "1rem" }}>
            (02) · The method
          </div>
          <h2
            className="display"
            style={{
              fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
              marginBottom: "0.75rem",
              maxWidth: "700px",
            }}
          >
            Six steps from mailbox to model.
          </h2>
          <p style={{ color: "var(--ink-muted)", marginBottom: "3rem", maxWidth: "640px" }}>
            The entire pipeline runs on one server with two eight-year-old GPUs. Nothing is
            rented, nothing is uploaded.
          </p>
          <div className="grid-2">
            {STEPS.map((s) => (
              <article
                key={s.n}
                style={{
                  paddingTop: "1.5rem",
                  borderTop: "1px solid var(--rule)",
                }}
              >
                <span
                  className="mono"
                  style={{
                    fontSize: "0.72rem",
                    color: "var(--ink-faint)",
                    letterSpacing: "0.1em",
                    display: "block",
                    marginBottom: "0.6rem",
                  }}
                >
                  STEP {s.n}
                </span>
                <h3
                  style={{
                    fontSize: "1.15rem",
                    fontWeight: 500,
                    letterSpacing: "-0.005em",
                    marginBottom: "0.6rem",
                    color: "var(--ink)",
                  }}
                >
                  {s.name}
                </h3>
                <p style={{ color: "var(--ink-muted)", fontSize: "0.92rem", lineHeight: 1.6 }}>
                  {s.detail}
                </p>
              </article>
            ))}
          </div>
        </section>

        <hr className="rule" style={{ marginBottom: "4rem" }} />

        {/* ARCHITECTURE */}
        <section style={{ marginBottom: "5rem" }}>
          <div className="eyebrow" style={{ marginBottom: "1rem" }}>
            (03) · Pipeline
          </div>
          <h2
            className="display"
            style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", marginBottom: "2rem" }}
          >
            Architecture.
          </h2>
          <pre
            className="mono"
            style={{
              fontSize: "0.82rem",
              lineHeight: 1.55,
              color: "var(--ink)",
              overflowX: "auto",
              margin: 0,
              padding: "2rem",
              background: "var(--bg-elevated)",
              border: "1px solid var(--rule)",
              borderRadius: "8px",
            }}
          >{`  Outlook archive (.pst / .msg / .eml)
       │
       ▼
  extract + thread-pair  ──  (incoming email → reply actually sent)
       │
       ▼
  clean  ──  strip signatures · quoted history · footers · noise
       │        └─ train.jsonl / val.jsonl / held-out eval inbox
       ▼
  QLoRA fine-tune  (Gemma 4, NF4-quantized + frozen, LoRA adapters train)
       │        └─ ladder: E4B → 12B → 31B across 2× Tesla P40
       ▼
  side-by-side eval  ──  stock draft · tuned draft · real reply
       │
       ▼
  merge adapters → fp16  →  GGUF Q4_K_M  (~19GB, company-owned)
       │
       ▼
  llama.cpp server  ──  split across both GPUs, OpenAI-compatible, LAN-only
       │
       ▼
  drafting UI  ──  one incoming email in, two drafts out`}</pre>
        </section>

        <hr className="rule" style={{ marginBottom: "4rem" }} />

        {/* RESULTS — TODO: fill with real numbers after the training weekend */}
        <section style={{ marginBottom: "5rem", maxWidth: "740px" }}>
          <div className="eyebrow" style={{ marginBottom: "1rem" }}>
            (04) · Results
          </div>
          <h2
            className="display"
            style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", marginBottom: "1.5rem" }}
          >
            Measured, not vibes.
          </h2>
          <p style={{ color: "var(--ink-muted)", lineHeight: 1.7, marginBottom: "1rem" }}>
            {/* TODO: replace with real figures: N training pairs, wall-clock per rung,
                tokens/sec served, and 3–4 sanitized side-by-side screenshots from
                /public/email-voice/ */}
            Full run in progress — dataset size, training wall-clock per model size, and
            sanitized side-by-side comparisons (stock draft vs tuned draft vs the reply the
            author actually wrote) will be published here.
          </p>
          <p style={{ color: "var(--ink-muted)", lineHeight: 1.7 }}>
            Marginal cost of the entire project: electricity. The same pipeline pointed at
            rented GPUs finishes in hours instead of a weekend — the point is that it
            doesn&rsquo;t have to be.
          </p>
        </section>

        <hr className="rule" style={{ marginBottom: "4rem" }} />

        {/* STACK */}
        <section style={{ marginBottom: "5rem" }}>
          <div className="eyebrow" style={{ marginBottom: "1rem" }}>
            (05) · Stack
          </div>
          <h2
            className="display"
            style={{
              fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
              marginBottom: "1rem",
            }}
          >
            Owned hardware. Open weights.
          </h2>
          <p
            style={{
              color: "var(--ink-muted)",
              marginBottom: "2.5rem",
              maxWidth: "680px",
              lineHeight: 1.65,
            }}
          >
            Gemma 4 ships under Apache 2.0 — the fine-tuned result can be used, modified,
            and commercialized without a vendor in the loop. The GPUs are secondhand
            datacenter cards; the server sits in a house.
          </p>
          <dl
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "1.5rem 2rem",
              margin: 0,
            }}
          >
            {STACK.map((s) => (
              <div
                key={s.name}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.15rem",
                  paddingTop: "1rem",
                  borderTop: "1px solid var(--rule)",
                }}
              >
                <dt
                  style={{
                    fontFamily: "var(--font-serif), serif",
                    fontSize: "1.05rem",
                    fontWeight: 500,
                    color: "var(--ink)",
                  }}
                >
                  {s.name}
                </dt>
                <dd
                  className="mono"
                  style={{
                    color: "var(--ink-faint)",
                    fontSize: "0.72rem",
                    letterSpacing: "0.06em",
                    margin: 0,
                    textTransform: "uppercase",
                  }}
                >
                  {s.use}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <hr className="rule" style={{ marginBottom: "4rem" }} />

        {/* CTA */}
        <section
          style={{
            padding: "4rem 3rem",
            background: "var(--bg-elevated)",
            border: "1px solid var(--rule)",
            borderRadius: "12px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "end",
            gap: "2rem",
            flexWrap: "wrap",
          }}
        >
          <div style={{ maxWidth: "560px" }}>
            <h2
              className="display"
              style={{
                fontSize: "clamp(1.5rem, 2.75vw, 2rem)",
                marginBottom: "0.75rem",
              }}
            >
              Want a model that writes like your team?
            </h2>
            <p style={{ color: "var(--ink-muted)", lineHeight: 1.6 }}>
              We fine-tune open models on your real communications — on your hardware or
              ours — so the AI in your workflow sounds like your people, not a bot. Your
              data never leaves your control.
            </p>
          </div>
          <Link href="/contact" className="btn btn-primary">
            Talk to us
            <span aria-hidden>→</span>
          </Link>
        </section>
      </div>
    </section>
  );
}
