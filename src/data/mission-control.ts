/**
 * Sanitized Mission Control dataset.
 *
 * This mirrors the SHAPE of the production control plane (agents, tools,
 * memory, connections, activity) with mock names and mock data. The real
 * system runs inside an employer Azure tenant behind Microsoft Entra ID
 * and cannot be shown publicly.
 *
 * Node positions are on a fixed 1200x700 design grid shared by the
 * homepage scroll graph and the /mission-control interactive demo.
 */

export type NodePos = { x: number; y: number };

export type Platform = {
  id: string;
  name: string;
  blurb: string;
};

export type ToolDef = {
  id: string;
  name: string;
  kind: "api" | "retrieval" | "function" | "action";
  authScope: string;
  description: string;
  pos: NodePos;
};

export type MemoryStore = {
  id: string;
  name: string;
  kind: "conversation" | "vector" | "structured";
  retention: string;
  description: string;
  pos: NodePos;
};

export type Agent = {
  id: string;
  platformId: string;
  name: string;
  role: string;
  model: string;
  systemPromptExcerpt: string;
  toolIds: string[];
  memoryIds: string[];
  guardrails: string[];
  status: "active" | "idle";
  pos: NodePos;
};

export type Connection = {
  from: string;
  to: string;
  kind: "invokes" | "reads" | "writes" | "observes";
  label?: string;
};

export type ActivityEvent = {
  offsetMs: number;
  agentId: string;
  type: "tool_call" | "handoff" | "grounding_check" | "memory_write" | "escalation";
  summary: string;
  status: "ok" | "flagged";
};

export const HUB = {
  id: "mission-control",
  name: "Mission Control",
  blurb:
    "The control plane. Every agent's prompt, memory bindings, tool permissions, and run history in one place — Azure AI backed, Entra ID secured.",
  pos: { x: 600, y: 395 } as NodePos,
};

export const PLATFORMS: Platform[] = [
  {
    id: "sales-hub",
    name: "Sales Hub",
    blurb: "Field-ready sales workspace: voice-first assistant, sample orders, CRM pipeline.",
  },
  {
    id: "quotes-hub",
    name: "Quotes Hub",
    blurb: "Inbound request to priced quote: drafting, crossover lookup, follow-ups, Q&A.",
  },
  {
    id: "service-desk",
    name: "Service Desk",
    blurb: "Customer-service intake: triage, document intelligence, human escalation.",
  },
];

export const TOOLS: ToolDef[] = [
  {
    id: "pdf-extract",
    name: "pdf_extract",
    kind: "function",
    authScope: "documents.read",
    description: "Deterministic PDF parsing + vision OCR fallback. Returns fields with source quotes and bounding boxes.",
    pos: { x: 195, y: 585 },
  },
  {
    id: "crm-api",
    name: "crm_api",
    kind: "api",
    authScope: "crm.read · crm.write:draft",
    description: "Accounts, contacts, and pipeline. Writes are draft-only; a person promotes them.",
    pos: { x: 360, y: 625 },
  },
  {
    id: "catalog-search",
    name: "catalog_search",
    kind: "retrieval",
    authScope: "catalog.read",
    description: "Product catalog + private-label crossover index. Every hit returns the source row.",
    pos: { x: 525, y: 600 },
  },
  {
    id: "pricing-engine",
    name: "pricing_engine",
    kind: "function",
    authScope: "pricing.read",
    description: "Deterministic price and margin math. Agents never do arithmetic on prices themselves.",
    pos: { x: 690, y: 625 },
  },
  {
    id: "email-send",
    name: "email_send",
    kind: "action",
    authScope: "mail.draft",
    description: "Drafts into the rep's outbox in their own voice. Nothing sends without a human click.",
    pos: { x: 855, y: 600 },
  },
  {
    id: "ticket-api",
    name: "ticket_api",
    kind: "api",
    authScope: "tickets.read · tickets.write",
    description: "Service tickets: create, update, route, and link source documents.",
    pos: { x: 1020, y: 580 },
  },
];

export const MEMORY: MemoryStore[] = [
  {
    id: "conv-store",
    name: "conversation_store",
    kind: "conversation",
    retention: "90 days · per-user scope",
    description: "Rolling per-rep conversation history so agents keep context across sessions.",
    pos: { x: 330, y: 455 },
  },
  {
    id: "doc-index",
    name: "document_index",
    kind: "vector",
    retention: "Rebuilt nightly · tenant-only",
    description: "Embedded catalogs, spec sheets, and past quotes. Grounding source for every retrieval answer.",
    pos: { x: 870, y: 465 },
  },
  {
    id: "quote-history",
    name: "quote_history",
    kind: "structured",
    retention: "7 years · audit-grade",
    description: "Every quote, revision, and outcome. Feeds follow-up timing and win-rate context.",
    pos: { x: 1065, y: 400 },
  },
];

export const AGENTS: Agent[] = [
  {
    id: "voice-assistant",
    platformId: "sales-hub",
    name: "Field Voice Assistant",
    role: "Voice-first rep copilot in Sales Hub",
    model: "Azure AI · GPT-class",
    systemPromptExcerpt: `You are the field assistant for outside sales reps.
You answer only from crm_api and catalog_search results — if a
lookup returns nothing, say so and offer to log a follow-up.
Never quote a price from memory; call pricing_engine.
Keep spoken replies under three sentences.`,
    toolIds: ["crm-api", "catalog-search", "pricing-engine"],
    memoryIds: ["conv-store"],
    guardrails: ["Grounded answers only", "No prices outside pricing_engine", "Draft-only CRM writes"],
    status: "active",
    pos: { x: 150, y: 200 },
  },
  {
    id: "email-drafter",
    platformId: "sales-hub",
    name: "Voice-Match Email Drafter",
    role: "Drafts replies in the rep's own voice (on-prem fine-tune)",
    model: "On-prem fine-tune · Gemma-class",
    systemPromptExcerpt: `Draft a reply in the sender's established voice.
Facts (prices, dates, order numbers) must come from the thread
or attached tool results — never invent them.
Output a draft only; a person reviews and sends.`,
    toolIds: ["email-send", "crm-api"],
    memoryIds: ["conv-store"],
    guardrails: ["Human sends every email", "Facts from sources only", "Tone model isolated from data model"],
    status: "active",
    pos: { x: 320, y: 130 },
  },
  {
    id: "quote-builder",
    platformId: "quotes-hub",
    name: "Quote Builder",
    role: "Turns inbound requests into priced draft quotes",
    model: "Azure AI · GPT-class",
    systemPromptExcerpt: `Extract requested products, quantities, and constraints
from the inbound request. Resolve products via catalog_search;
price only via pricing_engine. Attach the source line for every
extracted value. Below 0.70 confidence, route to human review.`,
    toolIds: ["catalog-search", "pricing-engine", "crm-api"],
    memoryIds: ["doc-index", "quote-history"],
    guardrails: ["Per-field source grounding", "Math reconciles to the cent", "Human review < 0.70 confidence"],
    status: "active",
    pos: { x: 555, y: 115 },
  },
  {
    id: "po-intake",
    platformId: "quotes-hub",
    name: "PO Intake (IDP)",
    role: "Purchase-order PDFs to validated orders — 7 validation gates",
    model: "Two-model cross-check",
    systemPromptExcerpt: `Extract the purchase order against the strict schema.
Every field carries a source quote + bounding box. A second,
independent model re-extracts; disagreement lowers confidence
and routes to a person. No reconciled math, no sales order.`,
    toolIds: ["pdf-extract", "catalog-search"],
    memoryIds: ["doc-index"],
    guardrails: ["7 independent validation layers", "Two-model self-consistency", "Escalates instead of guessing"],
    status: "active",
    pos: { x: 730, y: 190 },
  },
  {
    id: "catalog-lookup",
    platformId: "quotes-hub",
    name: "Crossover Lookup",
    role: "Private-label and competitor product crossover",
    model: "Azure AI · small",
    systemPromptExcerpt: `Given a product reference, return catalog matches with
the source row for each. If fuzzy-match confidence is below
threshold, return candidates ranked — never a single guess.`,
    toolIds: ["catalog-search"],
    memoryIds: ["doc-index"],
    guardrails: ["Ranked candidates over single guesses", "Source row attached to every match"],
    status: "idle",
    pos: { x: 475, y: 250 },
  },
  {
    id: "service-triage",
    platformId: "service-desk",
    name: "Service Triage",
    role: "Reads inbound service requests, classifies, links documents",
    model: "Azure AI · GPT-class",
    systemPromptExcerpt: `Classify the inbound request (claim, order issue, question).
Pull the related order via crm_api and any attached documents
via pdf_extract. Summarize with citations for the human queue.
You never resolve or promise anything to the customer.`,
    toolIds: ["ticket-api", "crm-api", "pdf-extract"],
    memoryIds: ["doc-index"],
    guardrails: ["Read-and-route only", "Citations on every summary", "No customer-facing promises"],
    status: "active",
    pos: { x: 985, y: 135 },
  },
  {
    id: "escalation-router",
    platformId: "service-desk",
    name: "Escalation Router",
    role: "Decides what reaches a human, with full context attached",
    model: "Rules + Azure AI",
    systemPromptExcerpt: `Score urgency and completeness. Anything ambiguous,
high-value, or low-confidence goes to a person with the full
evidence trail. When in doubt, escalate — never absorb risk.`,
    toolIds: ["ticket-api"],
    memoryIds: ["quote-history"],
    guardrails: ["Escalation is the default under uncertainty", "Evidence trail attached to every handoff"],
    status: "active",
    pos: { x: 1080, y: 245 },
  },
];

/** Agent -> tool/memory edges are derived from AGENTS; these are the
 *  cross-cutting edges that make the platform a platform. */
export const CONNECTIONS: Connection[] = [
  { from: "po-intake", to: "quote-builder", kind: "invokes", label: "validated order → quote" },
  { from: "po-intake", to: "service-triage", kind: "invokes", label: "document intelligence" },
  { from: "email-drafter", to: "quote-builder", kind: "invokes", label: "voice for quote follow-ups" },
  { from: "quote-builder", to: "escalation-router", kind: "invokes", label: "low confidence → human" },
  { from: "voice-assistant", to: "catalog-lookup", kind: "invokes", label: "crossover on request" },
  { from: "service-triage", to: "escalation-router", kind: "invokes", label: "routed with citations" },
];

export function derivedConnections(): Connection[] {
  const edges: Connection[] = [];
  for (const a of AGENTS) {
    for (const t of a.toolIds) edges.push({ from: a.id, to: t, kind: "invokes" });
    for (const m of a.memoryIds) edges.push({ from: a.id, to: m, kind: "reads" });
  }
  for (const a of AGENTS) edges.push({ from: HUB.id, to: a.id, kind: "observes" });
  return edges;
}

export const ACTIVITY: ActivityEvent[] = [
  { offsetMs: 0, agentId: "po-intake", type: "tool_call", summary: "pdf_extract → PO-88213.pdf · 14 fields, all grounded", status: "ok" },
  { offsetMs: 3800, agentId: "po-intake", type: "grounding_check", summary: "Cross-model diff clean · confidence 0.98", status: "ok" },
  { offsetMs: 7600, agentId: "po-intake", type: "handoff", summary: "Validated order handed to Quote Builder", status: "ok" },
  { offsetMs: 11400, agentId: "quote-builder", type: "tool_call", summary: "catalog_search → 3 SKUs resolved with source rows", status: "ok" },
  { offsetMs: 15200, agentId: "quote-builder", type: "tool_call", summary: "pricing_engine → margins computed, reconciles to the cent", status: "ok" },
  { offsetMs: 19000, agentId: "quote-builder", type: "memory_write", summary: "quote_history ← draft Q-2117 rev A", status: "ok" },
  { offsetMs: 22800, agentId: "voice-assistant", type: "tool_call", summary: "crm_api → account brief for 09:30 site visit", status: "ok" },
  { offsetMs: 26600, agentId: "voice-assistant", type: "grounding_check", summary: "Answer grounded in 2 CRM records · cited", status: "ok" },
  { offsetMs: 30400, agentId: "catalog-lookup", type: "tool_call", summary: "catalog_search → crossover: 4 candidates ranked", status: "ok" },
  { offsetMs: 34200, agentId: "email-drafter", type: "tool_call", summary: "email_send → draft reply in rep voice (awaiting human send)", status: "ok" },
  { offsetMs: 38000, agentId: "service-triage", type: "tool_call", summary: "pdf_extract → claim photos + invoice linked to ticket 4471", status: "ok" },
  { offsetMs: 41800, agentId: "service-triage", type: "grounding_check", summary: "Summary cites 3 sources · queued for human", status: "ok" },
  { offsetMs: 45600, agentId: "quote-builder", type: "grounding_check", summary: "Line 4 source confidence 0.62 — below threshold", status: "flagged" },
  { offsetMs: 49400, agentId: "quote-builder", type: "escalation", summary: "Quote Q-2117 line 4 routed to human review", status: "flagged" },
  { offsetMs: 53200, agentId: "escalation-router", type: "handoff", summary: "Escalation packaged with evidence trail → rep queue", status: "ok" },
  { offsetMs: 57000, agentId: "email-drafter", type: "memory_write", summary: "conversation_store ← thread context updated", status: "ok" },
  { offsetMs: 60800, agentId: "po-intake", type: "tool_call", summary: "pdf_extract → PO-88219.pdf · thin-source gate: routed to vision OCR", status: "ok" },
  { offsetMs: 64600, agentId: "service-triage", type: "tool_call", summary: "ticket_api → 2 tickets auto-linked to order history", status: "ok" },
  { offsetMs: 68400, agentId: "escalation-router", type: "escalation", summary: "High-value account flag → human owner notified", status: "flagged" },
  { offsetMs: 72200, agentId: "voice-assistant", type: "memory_write", summary: "conversation_store ← visit notes captured by voice", status: "ok" },
];

export function agentById(id: string): Agent | undefined {
  return AGENTS.find((a) => a.id === id);
}

export function toolById(id: string): ToolDef | undefined {
  return TOOLS.find((t) => t.id === id);
}

export function memoryById(id: string): MemoryStore | undefined {
  return MEMORY.find((m) => m.id === id);
}
