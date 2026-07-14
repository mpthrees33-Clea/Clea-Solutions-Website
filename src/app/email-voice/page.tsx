import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Email in Your Own Voice · Built On-Prem | Clea Solutions",
  description:
    "An AI trained on years of real sent email, entirely on our own hardware, so drafts sound like the author, not a bot. No message ever left the building.",
};

const RESULTS = [
  { stat: "369", label: "Real email pairs distilled from a 3 GB mail archive" },
  { stat: "46 min", label: "Of training for the validation run" },
  { stat: "5.0 GB", label: "The entire finished model. One file, company-owned" },
  { stat: "$0", label: "Per message, per seat, per month. Running cost: electricity" },
];

const OWNERSHIP = [
  {
    n: "01",
    name: "Your data never leaves your building",
    detail:
      "The training, the model, and every draft it writes all run on hardware inside your walls. No cloud accounts, no third-party AI vendor reading your mail.",
  },
  {
    n: "02",
    name: "You own the model outright",
    detail:
      "The result is a single file, about 5 GB, that belongs to your company. The license lets you use it commercially, forever, with no vendor in the loop.",
  },
  {
    n: "03",
    name: "No per-seat, no per-message fees",
    detail:
      "After the build, the running cost is electricity. Ten people using it cost the same as one. There is no subscription to cancel because there is no subscription.",
  },
  {
    n: "04",
    name: "It sounds like your people",
    detail:
      "Not \"I hope this email finds you well.\" Your greetings, your sign-offs, your sentence length, your way of being blunt or warm.",
  },
];

const EXAMPLES = [
  {
    incoming:
      "Thank you for confirming! Attached is the signed order. Once material ships, please provide tracking and ETA. Accurate ETAs are required to ensure smooth scheduling and warehouse flow.",
    stock:
      "Thanks for sending over the signed OA. We'll make sure to get the tracking and ETA over to you as soon as it ships. We understand the importance of accurate timing for your scheduling and warehouse flow, and we'll make sure to stick to those delivery windows.",
    tuned: "Sam, Noted! Thanks for sending over the PO!",
  },
  {
    incoming: "That was NOT on my 2026 bingo card! ok let me know as soon as you can!",
    stock: "Casey, I'll get back to you as soon as I can. Best regards, Colton",
    tuned: "Casey, Sorry! We can get it down to a 16x24.",
  },
  {
    incoming:
      "Good morning. Did you speak with the flooring contractor regarding the billing of this material last month? They are not paying this invoice, stating the order was cancelled.",
    stock:
      "Good morning, I have not yet spoken with them regarding this billing issue. I will reach out to them today to sort this out. If you have any documentation that you think would help secure payment, please send it my way. Thanks, Colton",
    tuned:
      "Kim, We have already discussed this with the sales rep, and they are not following up. I have already sent them a copy of the invoice and PO number. I will follow up again today.",
  },
];

const STEPS = [
  {
    n: "01",
    name: "Onboarding, not programming",
    detail:
      "We take a capable general-purpose AI and put it through onboarding: it studies years of real sent email, every incoming message paired with the reply that was actually written. It learns the voice the way a new hire would, by reading the real thing.",
  },
  {
    n: "02",
    name: "Only the real stuff",
    detail:
      "Signatures, legal footers, quoted history, forwards, and auto-replies are stripped out before training. The AI learns from what was really written, nothing else. Most of the work, and most of the quality, is in this cleaning.",
  },
  {
    n: "03",
    name: "A cheap dress rehearsal before the full run",
    detail:
      "We prove the whole process on a small, fast version first, about an hour of training. Any problem in the data gets caught cheaply, not six hours into the full-size overnight run. Then we scale up using the same data and the same process.",
  },
  {
    n: "04",
    name: "Graded against reality",
    detail:
      "Twenty incoming emails the AI never saw during training. For each one, side by side: the stock AI's draft, the trained AI's draft, and the reply that was actually sent. Greetings, sign-offs, sentence length, formality. No cherry-picking.",
  },
  {
    n: "05",
    name: "Installed where the work happens",
    detail:
      "The finished model runs on a server on your own network and plugs into your drafting workflow. Training data, model, and every draft it writes stay inside the building.",
  },
];

const STACK = [
  { name: "Gemma 4 31B (dense)", use: "Base model · Apache 2.0" },
  { name: "2× Tesla P40 · 48GB", use: "Training + inference GPUs" },
  { name: "HP DL380 · 160GB RAM", use: "On-prem server" },
  { name: "TRL + PEFT", use: "QLoRA supervised fine-tuning" },
  { name: "bitsandbytes NF4", use: "4-bit base quantization" },
  { name: "llama.cpp · GGUF Q4_K_M", use: "Serving, split across GPUs" },
  { name: "Python stdlib email", use: "Mail archive extraction" },
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
            (CASE STUDY) · Email in your own voice
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
            <em style={{ fontStyle: "normal", color: "var(--ink-muted)" }}>
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
            We taught an AI to write email the way our founder actually writes, by
            training it on years of his real sent mail, on a server in his own office.
            Below: the same incoming emails answered by a stock AI and by the trained
            one. Not a single message ever left the building.
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
            every customer gets the same eager, over-punctuated assistant-speak (&ldquo;I
            hope this email finds you well!&rdquo;) regardless of who is supposedly writing.
            It reads as outsourced attention, because it is.
          </p>
          <p style={{ color: "var(--ink-muted)", lineHeight: 1.7 }}>
            The fix isn&rsquo;t a longer prompt or a cleverer instruction. A voice is
            something the AI has to learn the way a new hire learns it: by reading years
            of the real thing. Training makes it permanent. Facts still come from your
            systems, tone comes from training, and that split is behind everything we
            build.
          </p>
        </section>

        <hr className="rule" style={{ marginBottom: "4rem" }} />

        {/* BEFORE AND AFTER */}
        <section style={{ marginBottom: "5rem" }}>
          <div className="eyebrow" style={{ marginBottom: "1rem" }}>
            (02) · Before and after
          </div>
          <h2
            className="display"
            style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", marginBottom: "1.5rem" }}
          >
            Same incoming email, two drafts.
          </h2>
          <p
            style={{
              color: "var(--ink-muted)",
              lineHeight: 1.7,
              marginBottom: "2rem",
              maxWidth: "740px",
            }}
          >
            Three of the twenty test emails the AI never saw during training, names
            changed. Watch the greeting, the punctuation, and the two-line reply where
            the stock model writes three paragraphs.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {EXAMPLES.map((ex) => (
              <article
                key={ex.incoming}
                style={{
                  border: "1px solid var(--rule)",
                  borderRadius: "8px",
                  padding: "1.75rem",
                  background: "var(--bg-elevated)",
                }}
              >
                <span
                  className="mono"
                  style={{
                    fontSize: "0.68rem",
                    letterSpacing: "0.1em",
                    color: "var(--ink-faint)",
                    display: "block",
                    marginBottom: "0.5rem",
                  }}
                >
                  INCOMING
                </span>
                <p
                  style={{
                    fontStyle: "italic",
                    color: "var(--ink-muted)",
                    lineHeight: 1.6,
                    marginBottom: "1.5rem",
                    maxWidth: "680px",
                  }}
                >
                  {ex.incoming}
                </p>
                <div className="grid-2">
                  <div>
                    <span
                      className="mono"
                      style={{
                        fontSize: "0.68rem",
                        letterSpacing: "0.1em",
                        color: "var(--ink-faint)",
                        display: "block",
                        marginBottom: "0.5rem",
                      }}
                    >
                      STOCK MODEL
                    </span>
                    <p style={{ color: "var(--ink-muted)", fontSize: "0.92rem", lineHeight: 1.6 }}>
                      {ex.stock}
                    </p>
                  </div>
                  <div>
                    <span
                      className="mono"
                      style={{
                        fontSize: "0.68rem",
                        letterSpacing: "0.1em",
                        color: "var(--ink-faint)",
                        display: "block",
                        marginBottom: "0.5rem",
                      }}
                    >
                      TRAINED ON REAL MAIL
                    </span>
                    <p style={{ color: "var(--ink)", fontSize: "0.92rem", lineHeight: 1.6 }}>
                      {ex.tuned}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <p
            style={{
              marginTop: "2rem",
              maxWidth: "740px",
              padding: "1.25rem 1.5rem",
              border: "1px solid var(--rule)",
              borderRadius: "8px",
              color: "var(--ink-muted)",
              fontSize: "0.92rem",
              lineHeight: 1.65,
            }}
          >
            <span
              className="mono"
              style={{
                fontSize: "0.68rem",
                letterSpacing: "0.1em",
                color: "var(--ink-faint)",
                display: "block",
                marginBottom: "0.5rem",
              }}
            >
              DEMO NOTE
            </span>
            Names and order details in these drafts are placeholders. Hooking the model
            up to live order data is a deliberate second step, kept separate so facts
            always come from your systems, never from the AI&rsquo;s memory. What
            you&rsquo;re evaluating here is the voice.
          </p>
        </section>

        <hr className="rule" style={{ marginBottom: "4rem" }} />

        {/* WHAT YOU OWN */}
        <section style={{ marginBottom: "5rem" }}>
          <div className="eyebrow" style={{ marginBottom: "1rem" }}>
            (03) · What you own
          </div>
          <h2
            className="display"
            style={{
              fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
              marginBottom: "3rem",
              maxWidth: "700px",
            }}
          >
            At the end, everything is yours.
          </h2>
          <div className="grid-2">
            {OWNERSHIP.map((s) => (
              <article
                key={s.n}
                style={{
                  paddingTop: "1.5rem",
                  borderTop: "1px solid var(--rule)",
                }}
              >
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

        {/* HOW IT WORKS */}
        <section style={{ marginBottom: "5rem" }}>
          <div className="eyebrow" style={{ marginBottom: "1rem" }}>
            (04) · How it works
          </div>
          <h2
            className="display"
            style={{
              fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
              marginBottom: "0.75rem",
              maxWidth: "700px",
            }}
          >
            Five steps from mailbox to model.
          </h2>
          <p style={{ color: "var(--ink-muted)", marginBottom: "3rem", maxWidth: "640px" }}>
            The entire process ran on one server with two eight-year-old graphics cards.
            Nothing rented, nothing uploaded.
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

        {/* RESULTS */}
        <section style={{ marginBottom: "5rem" }}>
          <div className="eyebrow" style={{ marginBottom: "1rem" }}>
            (05) · Results
          </div>
          <h2
            className="display"
            style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", marginBottom: "1.5rem" }}
          >
            Measured, not vibes.
          </h2>
          <p
            style={{
              color: "var(--ink-muted)",
              lineHeight: 1.7,
              marginBottom: "2.5rem",
              maxWidth: "740px",
            }}
          >
            These numbers are from the small validation model, the dress-rehearsal run
            from step 03. The full-size versions reuse the same data and the same
            process.
          </p>
          <dl
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "1.5rem 2rem",
              margin: "0 0 2.5rem 0",
            }}
          >
            {RESULTS.map((r) => (
              <div
                key={r.stat}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.3rem",
                  paddingTop: "1rem",
                  borderTop: "1px solid var(--rule)",
                }}
              >
                <dt
                  className="display"
                  style={{ fontSize: "1.75rem", color: "var(--ink)" }}
                >
                  {r.stat}
                </dt>
                <dd
                  style={{
                    color: "var(--ink-muted)",
                    fontSize: "0.85rem",
                    lineHeight: 1.5,
                    margin: 0,
                  }}
                >
                  {r.label}
                </dd>
              </div>
            ))}
          </dl>
          <p style={{ color: "var(--ink-muted)", lineHeight: 1.7, maxWidth: "740px" }}>
            Marginal cost of the entire project: electricity. The same pipeline pointed at
            rented GPUs finishes in hours instead of a weekend. The point is that it
            doesn&rsquo;t have to.
          </p>
        </section>

        <hr className="rule" style={{ marginBottom: "4rem" }} />

        {/* OWNERSHIP + TECHNICAL APPENDIX */}
        <section style={{ marginBottom: "5rem" }}>
          <div className="eyebrow" style={{ marginBottom: "1rem" }}>
            (06) · The fine print
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
            The base model ships under the Apache 2.0 license, so the trained result can
            be used, modified, and commercialized without a vendor in the loop. The GPUs
            are secondhand datacenter cards. The server sits in a house.
          </p>
          <details className="tech-appendix">
            <summary className="mono">
              FOR YOUR TECHNICAL ADVISOR: THE FULL STACK AND TRAINING DETAIL
            </summary>
            <div style={{ paddingTop: "2rem" }}>
              <p
                style={{
                  color: "var(--ink-muted)",
                  lineHeight: 1.7,
                  marginBottom: "2rem",
                  maxWidth: "740px",
                }}
              >
                The base model is Gemma 4 31B dense. Training is QLoRA: the base is
                quantized to 4-bit NF4 and frozen, and low-rank adapters attach to the
                attention and MLP projections, so only 0.61% of the weights train. That
                light touch is deliberate: it preserves everything the base model knows
                while moving the voice in permanently. Validation runs climb a size
                ladder (E4B → 12B → 31B) so data bugs surface on the cheap rung. Adapters
                merge back into the base, the result quantizes to GGUF Q4_K_M, and
                llama.cpp serves it across two Tesla P40s as an OpenAI-compatible
                endpoint, LAN-only.
              </p>
              <pre
                className="mono"
                style={{
                  fontSize: "0.82rem",
                  lineHeight: 1.55,
                  color: "var(--ink)",
                  overflowX: "auto",
                  margin: "0 0 2.5rem 0",
                  padding: "2rem",
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--rule)",
                  borderRadius: "8px",
                }}
              >{`  Mail archive (.pst / .msg / .eml)
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
  merge adapters → fp16  →  GGUF Q4_K_M  (company-owned)
       │
       ▼
  llama.cpp server  ──  split across both GPUs, OpenAI-compatible, LAN-only
       │
       ▼
  drafting UI  ──  one incoming email in, two drafts out`}</pre>
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
            </div>
          </details>
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
              We train AI on your real communications, on your hardware or ours, so the
              AI in your workflow sounds like your people, not a bot. Your data never
              leaves your control.
            </p>
          </div>
          <Link href="/contact" className="btn btn-primary">
            Book a free assessment
            <span aria-hidden>→</span>
          </Link>
        </section>
      </div>
    </section>
  );
}
