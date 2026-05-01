/**
 * Tungsten DocAI™ Platform — umbrella narrative constants.
 *
 * Sourced from Tungsten Automation's March 2026 AI Strategy ("Advance Document
 * Intelligence") and the IDP 2.0 Capability Map. These constants define the
 * corporate-level positioning shared by every pillar (DWA, AP/AR, Print, PDF).
 *
 * Pillar-specific products (TotalAgility for DWA, InvoiceAgility for AP/AR,
 * Printix/ControlSuite for Print, Power PDF for PDF) sit underneath this umbrella
 * as the commercial and deployment vehicles that deliver the DocAI capabilities.
 */

export const AI_UNDERSTANDING_LAYER = `### Tungsten's Position: The AI Understanding Layer

Tungsten is **the AI Understanding Layer** — the missing layer between unstructured enterprise content and any AI agent, model, or workflow that needs to act on it. We turn 80–90% of an enterprise's data (the unstructured side: contracts, invoices, claims, emails, call transcripts, social posts, news, case notes, system data streams) into **trusted, AI-ready data**: structured, validated, governed, with lineage and context.

The category is no longer "Intelligent Document Processing" in the IDP 1.0 sense. It is **document intelligence**: transformation, understanding, knowledge discovery, and agentic orchestration. Tungsten is redefining the category for the AI era as the 2025 Gartner Magic Quadrant Leader for IDP.`;

export const DATA_PROBLEM_NOT_MODEL_PROBLEM = `### The Wedge: It's a Data Problem, Not a Model Problem

The prevailing assumption is that the barrier to enterprise AI is model access or model quality. It isn't. Models are abundant and improving weekly. The real barrier is the 80–90% of enterprise information that is unstructured, ungoverned, and invisible to AI.

Without trusted, AI-ready data, the consequences are predictable:

- **AI hallucinates** — models generate plausible but wrong answers because they lack reliable source material. In regulated industries, a single hallucination can trigger compliance violations, financial loss, or reputational damage.
- **Governance fails** — there is no lineage, no provenance, no audit trail connecting AI outputs to verified inputs. When a regulator asks where an AI-driven decision came from, there is no answer.
- **Agents can't act** — agentic workflows require structured, validated, contextual data to make decisions. Raw documents don't provide that. An agent without trusted data is automation without accountability.

A powerful model is like a brilliant mind: without experience, it knows nothing. **Data provides that experience.** AI exposes the data quality problem that has always existed but never mattered this much. In the AI era, the organisations with the most trusted data win, not the ones with the best models.`;

export const AI_EXECUTION_GAP = `### The AI Execution Gap

The gap between AI ambition and AI execution is not closing — it's widening. The root cause is consistently the same: organisations invest in model capability while neglecting the data foundation underneath. The result is **pilots that succeed in controlled environments but collapse in production** under real-world variability, compliance requirements, and scale.

This gap widens further when organisations attempt to build document understanding capability internally. The democratisation of AI tools makes prototyping easy: a handful of sample documents, a code-generation tool, a cloud AI service, and the demo looks impressive. But production-grade document understanding at enterprise scale is a fundamentally different discipline. It requires deep domain expertise, continuous model learning, governance infrastructure, and years of accumulated know-how that prototypes simply don't have.

And the real cost isn't the initial build — it's what comes after. AI may be compressing the act of writing code, but the engineering discipline around that code is more demanding than ever. Who maintains the system when AI-generated code is shipping faster than any team can review it? Who refactors brittle integrations when the underlying model is updated or deprecated? Who owns the security reviews, compliance certifications, regression testing, and the documentation that was never written in the first place?

**AI pilots are easy. AI at scale is brutal.**`;

export const IDP_1_VS_2 = `### From IDP 1.0 to IDP 2.0

- **IDP 1.0** was capture, classification, and extraction — *digitising* documents.
- **IDP 2.0** is fundamentally different: **transformation, understanding, knowledge, and orchestration** — making documents AI-ready.

The definition of "document" itself has expanded. In IDP 1.0, a document was a digitised piece of paper or an electronic file. In IDP 2.0, a document is **any unstructured content** — an email, a call-centre transcript, a social media post, an online news story, case notes, a response from a system service, a stream of data. The enterprise content that carries decisions, obligations, and risk is no longer confined to PDFs and invoices, and the platform that processes it can't be either.

This expanded scope unlocks **knowledge discovery**: the ability to identify entities, relationships, and patterns *across* documents — not just *within* them. A compliance team doesn't just need to extract clauses from contracts; they need to understand which obligations relate to which counterparties across which jurisdictions over time. A claims organisation doesn't just need to read individual case files; they need to detect patterns across thousands of cases that reveal systemic risk. This is the evolution from document processing to **document intelligence**.`;

export const DOCAI_STAGES = `### The Tungsten DocAI™ Platform — Three Stages

The platform operates across three stages, producing trusted, AI-ready data for any downstream workflow, any agent, any system:

1. **Document Ingestion** — any source, any format. Structured, semi-structured, and unstructured content flowing in from scanners, email, REST APIs, mobile capture SDK, web portals, watch folders, cloud storage (S3, Azure Blob, GCS), SharePoint, Box, Dropbox, SFTP/FTP, batch import, real-time event streaming, and first/third-party agents.
2. **Document Understanding** — pre-processing, OCR/ICR, classification, extraction, validation. Confidence scoring, human-in-the-loop review, business-rule validation, data normalisation, duplicate detection, audit trail and logging, auto-learning feedback loops, output formatting.
3. **Agentic Orchestration** — workflow, case management, RPA, and agent invocation. Probabilistic agents handle interpretation and reasoning; deterministic workflows handle rules, validation, and compliance. Both are native to the platform.`;

export const DOCAI_DESIGN_PRINCIPLES = `### DocAI Platform Design Principles

1. **Governed by design** — confidence scoring, audit trails, human-in-the-loop review, and self-learning feedback loops are built into the platform, not bolted on. Tungsten invests significant engineering resources into ensuring repeatable, consistent results from inherently probabilistic technology — so that the same document processed today produces the same trusted output tomorrow.
2. **LLM-agnostic** — use Tungsten's models or bring your own. The platform separates AI understanding from model dependency, ensuring durability as models evolve. Full BYOLLM support across all major foundation and open models.
3. **Agent-addressable** — third-party agents invoke Tungsten capabilities on demand via open protocols (**MCP, A2A**). This shifts Tungsten from "a platform you integrate with" to **AI-native capabilities any agent can hire**.
4. **Deterministic + probabilistic AI working together** — probabilistic agents interpret and reason; deterministic workflows enforce rules, validation, and compliance. The winners don't choose between them — they architect systems where probabilistic agents operate inside deterministic constraints. **Probabilistic intelligence belongs inside deterministic systems.**
5. **Right AI for the right problem** — a spectrum of techniques rather than a single approach. Traditional ML (template matching, feature-based classifiers, rule-driven extraction, table recognition, regex parsing) for highly structured formats at minimal compute cost; pre-trained deep-learning models for high-volume document types; **Tungsten Copilot™** for zero-shot classification and extraction of documents never seen before. Customers combine these seamlessly within a single workflow, balancing performance, security, accuracy, cost, and environmental impact — reserving compute-intensive generative AI for problems that truly require it.`;

export const DEFENSIBLE_IP = `### Defensible IP — Why This Cannot Be Prototyped

Tungsten has invested deeply in the science of making LLMs work reliably on enterprise documents. Conventional approaches **serialise document content into flat text** before sending it to a language model — discarding structural context (tables, columns, hierarchies, graphical relationships) that a human reader naturally understands.

Tungsten's **patented hierarchical document representation** (US Patent 12,197,412 B2) transforms document content into structured, hierarchical representations that preserve this context **before the model ever sees it**. The result:

- **Dramatically more accurate and repeatable extraction** — the model reasons against structure, not raw text.
- **Significantly reduced attack surface for adversarial inputs** like prompt injection, because the model operates on a controlled, structured representation rather than raw, untrusted content.

This is one of 230+ Tungsten patents and is not something a code-generation prototype can replicate.`;

export const TUNGSTEN_COPILOT_BRAND = `### Tungsten Copilot™

**Tungsten Copilot™** is the parent brand for Tungsten's generative-AI capabilities — most prominently **zero-shot classification and extraction** of documents that have never been seen before. It sits over our existing in-product Copilot modules:

- **Copilot for Extraction** — patent-pending technology that learns from minimal training samples; reduces model creation time by 80%. A core component of TotalAgility and the DocAI Platform.
- **Knowledge Discovery** — a core component of the DocAI Platform. Conversational interface for querying unstructured content, with full source annotation and lineage. Powers cross-document entity extraction, relationship mapping, and semantic search. (This subsumes the capability formerly marketed as "Copilot for Insights".)
- **Copilot for Development** — accelerates solution delivery by transforming hand-drawn designs into executable workflows, forms, and data models.

When prospects ask about generative AI, Tungsten Copilot™ is the brand answer. When they ask about specific capabilities, Copilot for Extraction and Knowledge Discovery are the two prominent components to lead with; Copilot for Development is a powerful but secondary differentiator.`;

export const BORING_AI = `### Boring AI — The Build-vs-Buy Reinforcement

"Boring AI" means two things, and both are central to the Tungsten pitch.

**First**, it's about focusing on what works rather than what's new. The highest-value AI solves real, repeatable business problems reliably — not what generates the best demo.

**Second**, and more importantly, it's about **where you point your best people**. Every organisation has finite AI talent, time, and budget. Why would you deploy your top engineers to build an accounts-payable system, a document classification pipeline, or a compliance validation engine? These capabilities are critical, but they're not what differentiates you in your market.

**Let a trusted platform handle the boring, mandatory, high-stakes data foundation. Focus your best people on the AI that makes your business unique.**

When invoices are transformed into trusted, AI-ready data with validated line items, GL codes, and PO matches, AI agents handle straight-through processing for the majority of transactions while surfacing only genuine exceptions for human review. The AP team's best analysts are freed to focus on supplier strategy and cash-flow optimisation, not manual data entry. The same logic applies in trade finance, claims, lending, healthcare records, and every other unstructured-data-heavy workflow.

**Focus your AI talent on what makes you different. Let the platform handle what reduces your risk.**`;

export const AGENT_ADDRESSABLE_INVERSION = `### The Inversion: Agents Don't Log In, They Call Capabilities

The enterprise integration model is inverting. AI agents don't log into platforms; they **call capabilities**. Tungsten is evolving from a destination platform to an **agent-addressable AI understanding layer** that any enterprise system, any orchestrator, any agent can invoke on demand via open protocols (MCP, A2A).

Practical implication: a customer's own agent — built on whatever framework they prefer — can invoke Tungsten's classification, extraction, redaction, validation, knowledge-discovery, or workflow capabilities as needed, the same way it would call any other tool. Tungsten contributes the trusted data and governed actions; the customer's agent contributes the orchestration logic. Both win.`;

export const KNOWLEDGE_DISCOVERY_VALUE = `### Knowledge Discovery — Cross-Document Intelligence

Knowledge Discovery is a core component of the DocAI Platform and a top-tier differentiator. It's not just another extraction tool; it's the capability that lets the platform understand **relationships across content, not just within it**:

- **Entity extraction** across thousands of documents
- **Relationship mapping** — counterparties, obligations, jurisdictions, time
- **Semantic analysis** — meaning, not just keywords
- **Hybrid search** — text, vector, and structured data combined, with intelligent re-ranking
- **AI Knowledge Bases** with full source annotation and lineage

Use cases where this is the headline capability:
- Syndicated lending — deal-document analysis across hundreds of pages and parties
- Banking trust & escrow
- Commercial lending underwriting
- Insurance claims pattern detection (incl. fraud — Aviva uncovered $116M)
- Supply chain document management — bills of lading, customs, compliance

Knowledge Discovery is the modern name for what was previously marketed as "Copilot for Insights"; the old brand goes away.`;

/**
 * Composed umbrella block — the standard "AI Understanding Layer" framing dropped
 * into every pillar's system prompt. Includes the wedge, IDP 2.0 transition,
 * platform stages, design principles, defensible IP, Tungsten Copilot™ brand,
 * Boring AI reinforcement, and the agent-addressable inversion.
 */
export function buildDocAIUmbrellaBlock(): string {
  return [
    AI_UNDERSTANDING_LAYER,
    DATA_PROBLEM_NOT_MODEL_PROBLEM,
    AI_EXECUTION_GAP,
    IDP_1_VS_2,
    DOCAI_STAGES,
    DOCAI_DESIGN_PRINCIPLES,
    DEFENSIBLE_IP,
    TUNGSTEN_COPILOT_BRAND,
    BORING_AI,
    AGENT_ADDRESSABLE_INVERSION,
  ].join("\n\n");
}

/**
 * A condensed umbrella suitable for pillars where DocAI is corporate context, not
 * the primary product narrative (Print, PDF). Drops the deeper IDP 2.0 / Copilot /
 * Knowledge Discovery framing in favour of a concise statement of position.
 */
export function buildDocAICondensedBlock(): string {
  return `### Corporate Umbrella: Tungsten DocAI™ Platform — The AI Understanding Layer

Tungsten Automation positions itself as **the AI Understanding Layer** — the platform that turns 80–90% of enterprise data (the unstructured side) into trusted, AI-ready data for any downstream agent, model, or workflow. Tungsten is the 2025 Gartner Magic Quadrant Leader for IDP and is redefining the category from IDP 1.0 (capture/classify/extract) to **IDP 2.0** (transformation, understanding, knowledge, agentic orchestration).

Every Tungsten product — TotalAgility, InvoiceAgility, Printix, ControlSuite, Power PDF — is part of the DocAI Platform family. They share the same design principles: **governed by design, LLM-agnostic, agent-addressable (MCP, A2A), deterministic + probabilistic together, right AI for the right problem.** When a buyer asks "what does Tungsten stand for as a company?" — this is the answer.`;
}
