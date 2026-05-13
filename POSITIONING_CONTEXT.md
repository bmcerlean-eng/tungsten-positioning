# Tungsten Positioning — Application Context & Content Reference

**Last updated:** May 13, 2026
**Branch:** `claude/status-check-uJilv`
**Scope:** Single consolidated reference for everything that shapes the `tungsten-positioning` application — the corporate positioning narrative, the IDP 2.0 capability taxonomy, the four pillar pitches, the brand mapping, the centralised proof points, the build-vs-buy framework, the decisions made in the May 2026 messaging refresh, and the open items still to do.

---

## Table of contents

1. [Application overview](#1-application-overview)
2. [Repository structure](#2-repository-structure)
3. [Corporate positioning narrative — Artifact 1](#3-corporate-positioning-narrative--artifact-1)
4. [IDP 2.0 Complete Enterprise Capability Map — Artifact 2](#4-idp-20-complete-enterprise-capability-map--artifact-2)
5. [Pillar positioning summaries](#5-pillar-positioning-summaries)
6. [Brand and product mapping (post-2026 refresh)](#6-brand-and-product-mapping-post-2026-refresh)
7. [Proof points reference](#7-proof-points-reference)
8. [Build-vs-Buy and Boring AI framework](#8-build-vs-buy-and-boring-ai-framework)
9. [Session-level decisions](#9-session-level-decisions)
10. [New shared modules — exports reference](#10-new-shared-modules--exports-reference)
11. [Open items and future work](#11-open-items-and-future-work)
12. [Source attributions](#12-source-attributions)

---

## 1. Application overview

`tungsten-positioning` is a Next.js 16 web application that serves as an **AI Positioning Assistant** for Tungsten Automation's global sales organisation. It is used by Account Executives, Business Development Representatives, and Sales Engineers to generate account-specific, value-led positioning content that wins deals.

The app is organised around **four pillars**, each with its own route, system prompt, supplementary content, and quick-start prompts:

| Pillar | Route | Product | Audience |
|---|---|---|---|
| **DWA** — Document & Workflow Automation | `/dwa` | Tungsten DocAI™ Platform / TotalAgility | CIO, CDO, Head of AI, IT Director, LoB |
| **AP/AR** — Accounts Payable & Receivable Automation | `/ap-ar` | Tungsten InvoiceAgility | CFO, VP Finance, AP Director, Shared Services |
| **Print** — Print Management & Output | `/print` | Tungsten Printix + ControlSuite | CIO, IT Director |
| **PDF** — PDF Productivity | `/pdf` | Tungsten Power PDF | CIO, Procurement, LoB |

Each pillar page renders a left-hand chat panel (`components/chat-interface.tsx`) wired to `app/api/chat/route.ts` (calling Anthropic Claude Opus 4.6 via the AI SDK) and a right-hand Content Generator panel that downloads a branded `.pptx` deck and `.docx` positioning document after the user clicks **Generate Both**.

### Tech stack

- **Framework**: Next.js 16.2.0 (Turbopack, App Router) — note: AGENTS.md flags this as not the Next.js most training data assumes; read `node_modules/next/dist/docs/` before writing framework code.
- **UI**: React 19.2.4, TypeScript, Tailwind CSS v4, `tailwind-merge`, Lucide icons, React Markdown.
- **AI**: `@ai-sdk/anthropic` v3.0.63, `@ai-sdk/react` v3.0.136, `ai` v6.0.133. Model = `claude-opus-4-6`.
- **Persistence**: `lib/chat-storage.ts` — localStorage only, per-pillar key, up to 50 messages.
- **Lint / typecheck**: `npm run lint` (ESLint), `npx tsc --noEmit`.
- **Dev**: `npm run dev` on port 3002.

---

## 2. Repository structure

```
tungsten-positioning/
├── app/
│   ├── api/chat/route.ts          # Shared chat API route (Claude Opus 4.6 via streamText)
│   ├── dwa/page.tsx               # DWA pillar page
│   ├── ap-ar/page.tsx             # AP/AR pillar page
│   ├── print/page.tsx             # Print pillar page
│   ├── pdf/page.tsx               # PDF pillar page
│   ├── layout.tsx                 # Root layout + NavHeader
│   └── page.tsx                   # Home (four-pillar grid)
├── components/
│   ├── chat-interface.tsx         # Shared chat UI (useChat from @ai-sdk/react)
│   ├── content-generator.tsx      # Right-hand deck/doc download panel
│   └── nav-header.tsx
├── lib/
│   ├── docai-platform.ts          # ★ NEW — DocAI umbrella narrative (May 2026)
│   ├── docai-capability-map.ts    # ★ NEW — Typed capability taxonomy (May 2026)
│   ├── proof-points.ts            # ★ NEW — Centralised stats (May 2026)
│   ├── dwa-system-prompt.ts       # DWA master prompt (deep rewrite, May 2026)
│   ├── dwa-content.ts             # DWA discovery questions, objections, industry hooks
│   ├── dwa-sample-prompts.ts      # DWA quick-start prompts and prompt categories
│   ├── apar-system-prompt.ts      # AP/AR master prompt
│   ├── apar-content.ts
│   ├── apar-sample-prompts.ts
│   ├── print-system-prompt.ts
│   ├── print-content.ts
│   ├── print-sample-prompts.ts
│   ├── pdf-system-prompt.ts
│   ├── pdf-content.ts
│   ├── pdf-sample-prompts.ts
│   ├── pillar-prompts.ts          # Switch on pillarId → returns prompt + content
│   ├── chat-storage.ts            # localStorage save/load helpers
│   ├── constants.ts               # Pillar metadata (label, gradient, icon, active)
│   └── utils.ts                   # cn() className helper
├── public/                        # Pillar hero images, icons, Tungsten logos
├── scripts/                       # Build/setup scripts
├── templates/                     # .pptx and .docx templates for Content Generator
├── AGENTS.md                      # "This is NOT the Next.js you know" warning
├── CLAUDE.md                      # References AGENTS.md
├── README.md                      # Next.js boilerplate
├── MASTER_BUILD_PROMPT.txt        # Pre-existing build instructions (Apr 2026)
├── Tungsten_AI_Positioning_Full_Project_Prompt.txt  # Pre-existing seed (Apr 2026)
├── Barry_Build_Directions.txt     # Pre-existing direction (Apr 2026)
├── POSITIONING_CONTEXT.md         # ← This file
└── package.json
```

**Per-pillar trio**: Every pillar has the same three files — `<pillar>-system-prompt.ts` (master rules and product knowledge), `<pillar>-content.ts` (discovery questions, objection responses, industry hooks), `<pillar>-sample-prompts.ts` (quick-start prompts shown in the chat UI).

**New shared modules** (introduced in this May 2026 refresh and imported by all four pillar prompts):

- `lib/docai-platform.ts` — composable umbrella narrative.
- `lib/proof-points.ts` — single source of truth for every cited statistic.
- `lib/docai-capability-map.ts` — typed taxonomy of the IDP 2.0 Capability Map; the model surfaces clusters contextually as build-vs-buy evidence.

---

## 3. Corporate positioning narrative — Artifact 1

> Source: *"Tungsten Automation's AI Strategy: Advance Document Intelligence"* (March 2026).

### 3.1 Everyone has AI

Models are commoditising. Every enterprise has an AI Center of Excellence; barriers to getting started have never been lower. Natural language interfaces, code-generation tools, and cloud-hosted AI services let anyone build a prototype in hours.

- Gartner projects **more than 80% of enterprises will deploy GenAI-enabled agents and applications in production by end of 2026**.
- IT budgets are shifting decisively toward AI.
- Buyers are consolidating vendors and platforms to reduce complexity.
- **Trust, scale, and proven ROI** are replacing "cool AI tech" as decision criteria.

Yet the gap between AI investment and AI value is widening. **More than $30–40 billion** has been invested in generative AI, with **95% of investments seeing zero measurable ROI** (MIT NANDA, 2025). The question is no longer whether enterprises will adopt AI — it's whether they'll get value from it. The reason has nothing to do with model capability.

### 3.2 It's a data problem

The prevailing assumption is that the barrier to enterprise AI is model access or model quality. **It isn't.** Models are abundant and improving weekly. The real barrier is the **80–90% of enterprise information that is unstructured, ungoverned, and invisible to AI**.

> *A powerful model is like a brilliant mind: without experience, it knows nothing. Data provides that experience.*

This unstructured content (PDFs, contracts, invoices, emails, call recordings) represents the operating knowledge of the enterprise — where decisions are documented, obligations recorded, exceptions captured, and risk embedded. **Less than 1% of it is used in generative AI today** (IDC).

Without trusted, AI-ready data, the consequences are predictable:

- **AI hallucinates** — models generate plausible but wrong answers because they lack reliable source material. In regulated industries, a single hallucination can trigger compliance violations, financial loss, or reputational damage.
- **Governance fails** — no lineage, no provenance, no audit trail connecting AI outputs to verified inputs. When a regulator asks where an AI-driven decision came from, there is no answer.
- **Agents can't act** — agentic workflows require structured, validated, contextual data. Raw documents don't provide that. An agent without trusted data is automation without accountability.

> AI exposes the data quality problem that has always existed but never mattered this much. **In the AI era, the organisations with the most trusted data win, not the ones with the best models.**

### 3.3 The AI Execution Gap

The gap between AI ambition and AI execution is widening — and the root cause is the same: organisations invest in **model capability** while neglecting the **data foundation** underneath.

- **45%** of enterprises say their largest barrier to AI success is unstructured, fragmented data.
- **8.6%** of organisations are actually AI-ready, despite **57%** of leaders claiming they are.
- **69%** of companies say poor data quality limits their ability to make informed decisions.
- **181 zettabytes** of data created in 2025 — the vast majority unstructured and growing.

The result: pilots that succeed in controlled environments but **collapse in production** under real-world variability, compliance requirements, and scale.

The gap widens further when organisations try to build document processing internally. Prototyping is easy: a handful of sample documents, a code-generation tool, a cloud AI service, and the demo looks impressive. **Production-grade document understanding at enterprise scale is a fundamentally different discipline.** It requires deep domain expertise, continuous model learning, governance infrastructure, and years of accumulated know-how that prototypes simply don't have.

The real cost isn't the initial build — it's what comes after: who maintains the system when AI-generated code is shipping faster than any team can review it? Who refactors brittle integrations when the underlying model is deprecated? Who owns the security reviews, compliance certifications, regression testing, and documentation that was never written? These are everyday realities of enterprise software, and they don't get easier just because AI wrote the first draft.

> **AI pilots are easy. AI at scale is brutal.**

### 3.4 What's actually at stake

Every enterprise leader faces a set of questions they can't afford to get wrong:

- Can we trust the data feeding our AI? Is it structured, validated, and governed?
- Does it carry lineage and context?
- Can our agents act on it with confidence?
- Can we prove to a regulator where an AI-driven decision came from?

Organisations that can't answer these confidently are stuck in **pilot purgatory** — impressive demos, no production value. The cost isn't just wasted investment; it's eroded trust in AI itself, making the next initiative harder to fund, harder to staff, and harder to believe in.

### 3.5 From unstructured documents to trusted intelligence

The enterprises getting real value from AI have recognised a foundational truth: the critical capability is not the model. It's the **disciplined transformation of unstructured documents into trusted, AI-ready data**. Everything else — agentic workflows, intelligent automation, AI-driven decisions — depends on this.

Three requirements:

**(a) Systems, not just models.** The model is one component. Turning raw documents into trusted data requires a **system**: ingestion, classification, contextual extraction, validation, governance, confidence scoring, human-in-the-loop review, continuous learning. Each must work together at scale, across document types and jurisdictions. This is the distinction between software *development* (writing code; faster than ever) and software *engineering* (designing for maintainability, security, compliance, observability; more important than ever). And it includes hardening against adversarial threats prototypes never consider: prompt injection, data poisoning, content manipulation.

**(b) Deterministic governance around probabilistic intelligence.** AI agents that reason over documents are inherently probabilistic — they interpret, classify, extract, and generate. Their responses are somewhat unpredictable. Enterprise processes that act on the results are deterministic — they demand rules, validation, compliance, and auditability. **The winners don't choose between these.** They architect systems where probabilistic agents operate inside deterministic constraints.

> *An AI Paradox: Probabilistic intelligence belongs inside deterministic systems.*

**(c) Domain expertise that can't be prototyped.** Trusted document understanding at scale — across hundreds of document types, dozens of jurisdictions, millions of exceptions — is the product of decades of accumulated know-how. **Not a capability that can be prototyped in a sprint.**

This is where **"Boring AI"** comes in. It means two things:
1. Focus on what works rather than what's new — the highest-value AI solves real, repeatable business problems reliably.
2. **Point your best people at differentiation.** Every organisation has finite AI talent, time, and budget. Why deploy your top engineers to build an AP system, a document classification pipeline, or a compliance validation engine? Let a trusted platform handle the boring, mandatory, high-stakes data foundation; focus your best people on the AI that makes your business unique.

### 3.6 Tungsten's position: the AI Understanding Layer

This is the problem Tungsten Automation was built to solve: **turning unstructured documents into trusted, AI-ready data for enterprise workflows** — long before the current AI era made it the most urgent capability in the enterprise.

#### From IDP to Document Intelligence

| | IDP 1.0 | IDP 2.0 |
|---|---|---|
| **What** | Capture, classification, extraction — *digitising* documents | **Transformation, understanding, knowledge, and orchestration** — making documents AI-ready |
| **Document definition** | A digitised piece of paper or an electronic file | **Any unstructured content** — email, call transcripts, social posts, news, case notes, system data streams |
| **Goal** | Get the data off the page | Make the data *trustworthy* and *actionable* by any agent, model, or workflow |

This expanded scope unlocks **knowledge discovery** — identifying entities, relationships, and patterns **across** documents, not just within them. A compliance team doesn't just need clauses extracted; they need to understand which obligations relate to which counterparties across which jurisdictions over time. A claims organisation doesn't just need to read individual case files; they need to detect patterns across thousands of cases that reveal systemic risk. **This is the evolution from document processing to document intelligence.**

Tungsten is the **2025 Gartner Magic Quadrant Leader for IDP** and is redefining the category for the AI era.

#### The Tungsten DocAI™ Platform

The platform operates across **three stages**, producing trusted, AI-ready data for any downstream workflow, any agent, any system:

1. **Document Ingestion** — any source, any format.
2. **Document Understanding** — pre-processing, OCR/ICR, classification, extraction, validation.
3. **Agentic Orchestration** — workflow, case management, RPA, and agent invocation.

#### Five core design principles

1. **Governed by design** — confidence scoring, audit trails, human-in-the-loop review, and self-learning feedback loops are built into the platform, not bolted on. Tungsten invests significant engineering resources into ensuring repeatable, consistent results from inherently probabilistic technology.
2. **LLM-agnostic** — use Tungsten's models or bring your own. The platform separates AI understanding from model dependency.
3. **Agent-addressable** — third-party agents invoke Tungsten capabilities on demand via open protocols (**MCP, A2A**). Tungsten shifts from "a platform you integrate with" to "**AI-native capabilities any agent can hire**".
4. **Deterministic + probabilistic AI together** — probabilistic agents reason; deterministic workflows enforce rules, validation, and compliance.
5. **Right AI for the right problem** — a spectrum, not a single approach. Traditional ML (template matching, feature-based classifiers, rule-driven extraction, table recognition, regex parsing) for structured formats at minimal compute cost; pre-trained deep-learning models for high-volume document types; **Tungsten Copilot™** (zero-shot classification and extraction) for documents never seen before. Customers combine these inside a single workflow.

#### Defensible IP — why this cannot be prototyped

Conventional approaches **serialise document content into flat text** before sending it to a language model — discarding the structural context (tables, columns, hierarchies, graphical relationships) that a human reader naturally understands. Tungsten's **patented hierarchical document representation** (**US Patent 12,197,412 B2**) transforms document content into structured, hierarchical representations that preserve this context **before the model ever sees it**:

- **Dramatically more accurate and repeatable extraction** — the model reasons against structure, not raw text.
- **Significantly reduced attack surface for adversarial inputs** like prompt injection.

#### Proven at scale

| Metric | Value |
|---|---|
| Domain expertise in document intelligence | 40+ years |
| Pre-trained models | 3,000+ |
| Global customers | 25,000+ |
| Partner ecosystem | 850+ |
| Patents | 230+ |
| Increase in in-product agentic process usage (last 6 months) | **+550%** |
| Increase in in-product agentic extraction (last 6 months) | **+180%** |
| Documents processed per year | 10B+ |
| Compliance certifications | FedRAMP High, SOC 2 (Type 1 & 2), SOC 3, ISO 27001:2022, HIPAA, PCI, GDPR, CCPA, EU AI Act, Peppol, Responsible AI Governance |

### 3.7 Where this is going — the agent-addressable inversion

The integration model is inverting. **AI agents don't log into platforms; they call capabilities.** Tungsten is evolving from a destination platform to an **agent-addressable AI understanding layer** that any enterprise system, any orchestrator, any agent can invoke on demand via open protocols.

> *The enterprises that win in the AI era won't be the ones with the best models. They'll be the ones that turned their unstructured documents into trusted intelligence: governed, validated, and ready for whatever comes next. That's the boring work. That's where value lives.*

---

## 4. IDP 2.0 Complete Enterprise Capability Map — Artifact 2

> Source: *"Tungsten DocAI™ Platform | IDP 2.0 Complete Enterprise Capability Map"*.
> The same taxonomy is encoded in `lib/docai-capability-map.ts` as typed data so the assistant can surface relevant clusters in conversations as build-vs-buy evidence.

### Layer 1 — Document Ingestion (15 channels)

Structured / Semi-Structured / Unstructured · First- & Third-Party Agents · High-Speed Scanners · Email · REST API · Mobile Capture SDK (iOS / Android) · Web Portal Upload · Watch Folder Monitoring · Cloud Storage (S3 / Azure Blob / GCS) · SharePoint Connector · Box / Dropbox Connector · SFTP / FTP Import · Barcode / QR Routing · Batch Import & Queuing · Real-Time Event Streaming.

### Layer 2 — Intelligent Document Processing

**Pre-Processing**: Deskew & Rotation · Noise Removal · Binarization · Page Segmentation · Image Enhancement · PDF/A Conversion.

**OCR / ICR Engines**: Tungsten OmniPage OCR · Azure Doc Intelligence · Google Vision OCR · ICR Handwriting.

**Classification**: Supervised ML Models · Layout-Based · Rules-Augmented · Content-Based · LLM-Powered · Zero-Shot Clustering.

**Extraction**: 3,000+ Pre-Trained Models · Custom Model Training · LLM-Powered Extraction · Table / Line Item Extract · Fraud Detection & Document Forensics · Key-Value Pairs · Regex & Rules Engine · Signature Detection & Verification · ID Verification · Barcodes / QR Codes.

**Validation & Post-Processing**: Confidence Scoring · Human-in-the-Loop Review · Business Rule Validation · Data Normalization · Duplicate Detection · Audit Trail & Logging · Auto-Learning / Feedback Loop · Output Formatting.

### Layer 3 — Workflow, Orchestration & RPA

**Workflow Orchestration**: Process Designer · Conditional Routing · SLA & Escalations · Parallel Processing · Synchronous & Asynchronous Microservices · Timers & Signals · Human Tasks & Forms · Event-Driven Triggers.

**Case Management**: Dynamic Case Management · Ad-Hoc Task Creation · Case Templates · Case Analytics.

**Robotic Process Automation**: Desktop Automation · Attended / Unattended Bots · Bot Orchestrator · Screen Scraping · MCP / Tool Integration · Citrix Automation · SAP GUI Automation · Terminal Emulation · Web Automation · Excel Automation.

### Layer 4 — AI, ML & Agentic *(the IDP 2.0 differentiator)*

**LLM & Generative AI**: All Major Foundation & Open Models · Custom LLM Integration · Prompt Management & Guardrails · **Tungsten Copilot™** · Prompt Injection Prevention · **US Patent 12,197,412 B2 — Hierarchical Document Representation**.

**Agentic Foundation**: MCP / Tool Integration · 3rd-Party Agents · Agentic Orchestration · Knowledge Graphs · Vector Search & RAG · LLM Choice Framework.

### Layer 5 — Integration & Security

**100+ Enterprise Connectors**: SAP / Oracle / Microsoft · Salesforce · ServiceNow · REST / SOAP APIs · Database Connectors · ERP / CRM Adapters · ECM Connectors.

**Security & Governance**: SSO / SAML / OAuth 2.0 · LDAP / Active Directory · RBAC & Permissions · Full Audit Trail · Encryption (Rest / Transit).

**Developer Tools**: .NET SDK & REST API · Low-Code Designer · CI/CD Pipelines · Testing Framework · GitHub Integration.

### Layer 6 — Deployment & Analytics

**Deployment Options**: On-Premises · Azure Cloud (Managed) · AWS / GCP · Kubernetes & Containers · Hybrid Architecture · Air-Gapped Environments.

**Analytics & Observability**: Real-Time Dashboards · Agent Auditing / Monitoring · SLA Monitoring · Bottleneck Detection · Regulatory Compliance Reporting.

**Infrastructure & Scalability**: Multi-Tenant Architecture · High Availability · Disaster Recovery · Load Balancing · Auto Scaling.

### Layer 7 — Enterprise Services & Support

24x7 Global Support · Expert Resources · Performance Testing · Automated QA Testing · Language Translation for Global Rollout · Training & Enablement Courses.

### Layer 8 — Certifications & Compliance

ISO 27001:2022 · SOC 2 Type 1 & 2 · SOC 3 · FedRAMP High · PCI DSS · HIPAA · GDPR · CCPA · Peppol · Hellios Certified Accredited Supplier · Annual Penetration Testing · Responsible AI Governance.

### Footer — Enterprise Scale

**40+ Years of R&D · 3,000+ Pre-Trained Models · 100+ Enterprise Connectors · 10B+ Documents Processed/Year · Deterministic + Probabilistic AI · 25,000 Customers · 850+ Partners · Highly-Regulated Industries.**

---

## 5. Pillar positioning summaries

### 5.1 DWA — Document & Workflow Automation

- **Product**: Tungsten DocAI™ Platform delivered commercially via **TotalAgility** (Standard $25K / Advanced $75K / Enterprise $200K).
- **Primary audience**: CIO, CDO, Head of AI / AI CoE, IT Director, Line of Business, Procurement.
- **Core wedge**: *"It's a data problem, not a model problem. 95% of GenAI investments see zero ROI. Tungsten is the AI Understanding Layer — we turn the 80–90% of unstructured content into trusted, AI-ready data so your AI investment finally delivers."*
- **Narrative arc** (six-step operating model, preserved verbatim from the pre-refresh prompt):
  1. Gather two critical inputs (account + scenario).
  2. Research the account externally.
  3. Review industry solutions and value engineering.
  4. Apply the AI Understanding Layer wedge (Scenario A: has AI platform → DocAI is the missing layer; Scenario B: no AI platform → start with DocAI).
  5. Build differentiation around the five DocAI design principles.
  6. Produce output (executive-quality positioning brief; close with the verbatim Content Generator CTA).
- **Competitive set**: Hyperscalers (Azure / AWS / Google), niche IDP (Hyperscience, ABBYY, Rossum, Hyland IDP), legacy BPM (OpenText, Hyland, IBM), RPA-first (UiPath, Automation Anywhere).
- **Headline proof points**: FedEx ($40M+ annual ROI; 350M→1B pages in 3 years), Citi (trade-finance vendor consolidation), Siemens (>90% automation), Tetrosyl (90 hr/month saved, 99% error reduction), Aviva ($116M fraud uncovered), University Hospitals ($9.6M / 68 processes), Marginalen Bank (8 hours/day).
- **Distinctive objection responses** introduced in this refresh:
  - *"Our AI CoE will build this internally"* → Boring AI — point your best people at differentiation; vendor-sourced AI succeeds at 2× the DIY rate.
  - *"Our agents will just call the LLM directly"* → Then your agent inherits the data problem. DocAI is agent-addressable via MCP / A2A; probabilistic intelligence belongs inside deterministic systems.
  - *"We have unlimited hyperscaler credits in our ELA"* → ELAs give capacity, not business value. Don't pay for shelfware while a regulator asks where your AI's answer came from.

### 5.2 AP/AR — Accounts Payable & Receivable

- **Product**: Tungsten **InvoiceAgility** on the DocAI Platform.
- **Primary audience**: CFO, VP Finance, AP Director, Shared Services Lead, IT Director.
- **Core wedge**: The Boring AI angle. *"AP is mandatory, repeatable, high-stakes — but not what differentiates your business. Let InvoiceAgility (and the DocAI Platform underneath) handle ingestion, OCR, line-item extraction, PO matching, duplicate detection, and 100+ countries of e-invoicing compliance. Free your AP analysts to focus on supplier strategy and cash-flow optimisation."*
- **Five-stage InvoiceAgility workflow**: Transform → Orchestrate → Ensure Compliance → Unlock → Advance.
- **ERP integrations**: D365 Business Central, D365 Finance & Operations, Oracle Financial Cloud, Oracle NetSuite, Coupa.
- **Competitive set**: SAP Concur, Coupa, Basware, Tipalti, AvidXchange, BILL.
- **Headline proof points**: 95%+ first-time capture accuracy · up to 80% manual-processing reduction · 50%+ early-payment-discount uplift · duplicate detection prevents 1–3% of AP spend being wasted · cycle 45 days → under 10 days · 100+ countries e-invoicing · $15–40 manual vs $2–5 automated per invoice.
- **Distinctive objections** introduced in this refresh:
  - *"Our AI CoE is building invoice automation internally on Azure OpenAI"* → Boring AI; let them differentiate, let InvoiceAgility handle the regulated boring bit.
  - *"We'll just point a GenAI agent at our AP inbox"* → Your agent inherits the data problem. InvoiceAgility makes the agent's output reliable via MCP/A2A, confidence scoring, business-rule validation, full audit trail, and patented anti-prompt-injection structure.

### 5.3 Print — Print Management & Output

- **Products**: **Tungsten Printix** (primary cloud SaaS), **Tungsten ControlSuite** (advanced / enterprise; content-aware processing, cognitive capture), **Tungsten Output Manager** (legacy on-prem; migration path to Printix).
- **Primary audience**: CIO, IT Director, Line of Business.
- **Core wedge**: The **infrastructure-elimination** argument — print servers are the last on-premises holdout. Printix is serverless SaaS; eliminate the servers, eliminate the VPN, secure release at every device, full audit trail.
- **Four pillars**: cloud-first simplicity · security & compliance · cost reduction · mobility.
- **Competitive set**: PaperCut, Y Soft, Pharos, Xerox Print Management, Microsoft Universal Print.
- **Headline proof points**: serverless cloud-native architecture · no VPN required · Zero Trust + end-to-end encrypted print jobs · SSO with Entra ID / Google Workspace / Okta / OneLogin · full audit trail for GDPR / HIPAA / SOX · cross-platform (Windows, Windows ARM, Mac, iOS, Android, Chromebook).
- **Distinctive objection introduced in this refresh**: *"Why are we buying print management from an AI document company?"* → Tungsten is the AI Understanding Layer; Printix and ControlSuite are the print-management expressions of the DocAI Platform. One trusted vendor governing content end-to-end from device to AI agent.

### 5.4 PDF — PDF Productivity

- **Product**: **Tungsten Power PDF** (Standard $129 / Advanced $179 / Mac $129 / Business volume-licensed; all perpetual).
- **Primary audience**: CIO, IT Director, Procurement, Line of Business.
- **Core wedge**: **TCO** — perpetual licensing vs Adobe's subscription tax. *"Adobe Acrobat Pro = $276/user/year = $828 per user over 3 years. Power PDF Advanced = $179 one-time. 78% savings; break-even in under 8 months."*
- **Differentiators**: perpetual licensing · desktop-first (data stays local; no mandatory cloud) · Office-style ribbon (zero retraining) · enterprise deployment (MSI / GPO / Citrix / App-V / Windows Server) · 15M+ users · awards (TrustRadius Buyer's Choice 2026, Top Rated 2025, Most Loved 2024; Capterra Best Ease of Use 2024; GetApp Category Leaders 2024; G2 High Performer 2024).
- **Enterprise-grade features** (all editions): create / edit / convert / e-sign / OCR / **redaction** / **Bates numbering** / **batch processing** / 256-bit AES encryption / mobile apps.
- **Advanced/Business exclusives**: SharePoint + iManage integration · Citrix + Windows Server · AI Copilots · Teams app · Cloud Editor · API/SDK · advanced batch workflows.
- **Competitive set**: Adobe Acrobat Pro, Nitro PDF, Foxit, free PDF tools.
- **Distinctive objection introduced in this refresh**: *"Why does my PDF tool come from an AI document company?"* → Power PDF is the desktop expression of the Tungsten DocAI™ Platform — same governance posture, same compliance certifications, same vendor your CIO already trusts for enterprise document intelligence.

---

## 6. Brand and product mapping (post-2026 refresh)

### Corporate umbrella and product lines

| Brand | Role | Status |
|---|---|---|
| **Tungsten Automation** | Company (formerly Kofax) | Active |
| **Tungsten DocAI™ Platform** | **Corporate umbrella — the AI Understanding Layer** | **Active (new umbrella, May 2026)** |
| **TotalAgility** | Commercial / delivery vehicle for DWA on the DocAI Platform | Active (under the DocAI umbrella) |
| **InvoiceAgility** | AP/AR-specific delivery on the DocAI Platform | Active |
| **Printix** | Cloud-native print management on the DocAI Platform | Active |
| **ControlSuite** | Advanced / enterprise print + content-aware processing | Active |
| **Output Manager** | Legacy on-prem print | Active (positioned as migration path to Printix) |
| **Power PDF** | Desktop and enterprise PDF | Active |

### Copilot / GenAI brand mapping

| Brand | Role | Prominence | Status |
|---|---|---|---|
| **Tungsten Copilot™** | Parent brand for generative AI on the platform — most prominently zero-shot classification & extraction | Use as the brand answer when prospects ask about generative AI | **Active (parent brand, May 2026)** |
| **Copilot for Extraction** | In-product module; patent-pending; reduces model creation time by 80% | **Prominent** — lead with this when the conversation is about document AI | Active component under Tungsten Copilot™ |
| **Knowledge Discovery** | Conversational query interface over unstructured content; full source annotation and lineage; powers cross-document entity extraction, relationship mapping, semantic search, AI Knowledge Bases | **Prominent** — lead with this when the conversation is about cross-document understanding, syndicated lending, claims patterns, enterprise search over content | Active component under Tungsten Copilot™ |
| **Copilot for Insights** | (Formerly the conversational query brand) | — | **RETIRED.** Do not use. **Replaced by Knowledge Discovery.** |
| **Copilot for Development** | Transforms hand-drawn designs into executable workflows / forms / data models | Important but **secondary** differentiator | Active |

**Brand hygiene rule:** No new content (system prompts, supplementary content, sample prompts, marketing copy, or this reference doc anywhere outside this row) should use the phrase *"Copilot for Insights"*. If it appears in legacy material, replace with *"Knowledge Discovery"*.

---

## 7. Proof points reference

All numbers below are centralised in **`lib/proof-points.ts`** and consumed by every pillar's system prompt. If a stat changes, change it here only.

### 7.1 Scale (`SCALE_PROOF_POINTS`)

| Metric | Value |
|---|---|
| R&D years | 40+ |
| Pre-trained extraction models | 3,000+ |
| Global customers | 25,000+ |
| Partner ecosystem | 850+ |
| Patents | 230+ (incl. US Patent 12,197,412 B2) |
| Documents processed per year | 10B+ |
| Enterprise connectors | 100+ |
| Employees | 2,200 across 32 countries |
| Marquee logos | 8 of the top 10 global banks · 7 of the top 10 global insurers · 3 of the 5 largest logistics companies |

### 7.2 Momentum (`MOMENTUM_PROOF_POINTS`) — last 6 months

- **+550%** in-product agentic process usage.
- **+180%** in-product agentic extraction.

### 7.3 Recognition (`RECOGNITION_PROOF_POINTS`)

- **2025 Gartner Magic Quadrant Leader for IDP** — recognised for both Completeness of Vision and Ability to Execute.
- Hellios Certified Accredited Supplier.
- Power PDF awards: TrustRadius Buyer's Choice 2026 · TrustRadius Top Rated 2025 · TrustRadius Most Loved 2024 · Capterra Best Ease of Use 2024 · GetApp Category Leaders 2024 · G2 High Performer 2024.

### 7.4 Compliance and certifications (`COMPLIANCE_PROOF_POINTS`)

FedRAMP High · SOC 2 Type 1 & 2 · SOC 3 · ISO 27001:2022 · HIPAA · PCI DSS · GDPR · CCPA · Peppol · EU AI Act · Responsible AI Governance · annual third-party penetration testing.

### 7.5 Market reality (`MARKET_PROOF_POINTS`)

| Stat | Source |
|---|---|
| 80–90% of enterprise data is unstructured | Gartner |
| Less than 1% of enterprise unstructured data is currently used in generative AI | IDC |
| 95% of generative AI investments see zero measurable ROI ($30–40B invested) | MIT NANDA, 2025 |
| 80%+ of enterprises will deploy GenAI-enabled agents in production by end of 2026 | Gartner |
| Only 8.6% of organisations are actually AI-ready (vs 57% who think they are) | Huble, 2025 |
| 45% of enterprises: unstructured fragmented data is the #1 AI barrier | Huble |
| 69% say poor data quality limits informed decisions | Huble |
| 181 zettabytes of data created in 2025 | IDC |
| 42% of companies abandoned most AI initiatives in 2025 | S&P Global |
| 26% of AI projects succeed beyond proof of concept | BCG |
| Vendor-sourced AI solutions succeed at 2× the rate of DIY (67% vs 33%) | — |
| Top obstacles: data quality 43% · technical maturity 43% · skills 35% | — |
| Winning AI programmes earmark 50–70% of timeline and budget for data readiness | — |

### 7.6 DWA outcomes (`DWA_OUTCOME_PROOF_POINTS`)

- **FedEx** — $40M+ annual ROI; scaled 350M → 1B pages over 3 years.
- **Citi** — trade-finance vendor consolidation; eliminated technical debt.
- **Siemens** — over 90% automation on delivery-note processing.
- **Tetrosyl Group** — 90 hours/month saved; 99% error reduction.
- **U.S. manufacturing benchmark** — 41% efficiency gain; 42% turnaround reduction; 38% cost savings.
- **Aviva** — $116M of insurance fraud uncovered through intelligent document analysis.
- **University Hospitals** — $9.6M of value across 68 processes.
- **Safe-Guard Products International** — 75% reduction in adjudication time.
- **Marginalen Bank** — 8 hours/day saved in document processing.
- Up to **90% processing-time reduction** across document-intensive workflows.

### 7.7 AP/AR outcomes (`APAR_OUTCOME_PROOF_POINTS`)

- **95%+** first-time invoice capture accuracy.
- Up to **80%** reduction in manual invoice processing time.
- **50%+** improvement in early-payment discount capture.
- Duplicate payment detection prevents **1–3% of AP spend** being wasted.
- Average invoice-to-payment cycle reduced from **45 days to under 10 days**.
- **100+ countries** e-invoicing compliance with continuous mandate tracking.
- Industry average **$15–$40** per invoice manual vs **$2–$5** with InvoiceAgility.

---

## 8. Build-vs-Buy and Boring AI framework

### 8.1 Boring AI — two meanings

1. **Focus on what works rather than what's new.** The highest-value AI solves real, repeatable, mission-critical business problems reliably. Demos win headlines; reliability wins production.
2. **Point your best people at differentiation.** Every organisation has finite AI talent, time, and budget. Why deploy your top engineers to build an AP system, a document classification pipeline, or a compliance validation engine? Let the platform handle the boring, mandatory, high-stakes data foundation; focus your best people on the AI that makes your business unique.

### 8.2 The Accuracy Fallacy

Foundation models are commoditised. Almost every vendor draws on the same LLMs. What differentiates real-world accuracy is **how models are operationalised** — feedback loops, human-in-the-loop, continuous learning, governance, and **structural document representation that doesn't throw away context the model needs to reason**. Lab accuracy ≠ production accuracy.

### 8.3 The Hidden Costs of Building

| Hidden Cost | What DIY Teams Discover Too Late |
|---|---|
| Engineering time | 6–12 months to reach MVP. To match TotalAgility using Microsoft tools alone, teams need 5–6 separate products. |
| Technical debt | Compounds year after year; internal teams always catching up to vendor improvements and model deprecations. |
| Compliance & governance | Audit trails, data residency, PII redaction, GDPR / HIPAA / PCI / FedRAMP / EU AI Act must all be custom-built and re-certified. |
| AI talent scarcity | Expensive, in short supply. Boring AI work is exactly where talent burns out. |
| ELA shelfware risk | Enterprise Licence Agreements give *capacity*, not business value. Operationalising is the hard part. |
| Adversarial robustness | Prompt injection, data poisoning, content manipulation — risks that emerge only at scale. |

### 8.4 The LEGO Problem

Building from hyperscaler tools means stitching together OCR engines, classification models, extraction pipelines, validation rules, workflow orchestration, human review interfaces, audit logging, monitoring, agent orchestration, vector stores, RAG plumbing, and adversarial defences. **Every join is a point of slippage** where data falls out, accuracy degrades, traceability is lost, or an attacker walks in.

> *"LEGOs — where they don't fit together, is a place of slippage, where things start falling out. Can you see from start to finish? Can you track your documents and data? Who maintains it? What audit trail exists? What stops a prompt-injection attack?"*

### 8.5 Canonical objection responses

| Objection | Response |
|---|---|
| "We can build this ourselves" | 95% of internal AI pilots fail; vendor-sourced solutions succeed at 2× the rate (67% vs 33%). While you're building, competitors are already live. Boring AI: let the platform handle the data foundation; point your best people at differentiation. |
| "Our AI CoE is mandated to build it internally" | Have them build the AI that *differentiates* you (customer-facing models, proprietary domain reasoning, agent strategy). Let DocAI handle ingestion, OCR, classification, extraction, validation, governance, compliance — capabilities that took 40 years and 230+ patents. |
| "We have unlimited hyperscaler credits in our ELA" | ELAs give capacity, not business value. Don't pay for shelfware while a regulator asks where your AI's answer came from. |
| "We need full control" | DocAI's no-code/low-code, APIs, MCP-addressable capabilities, and BYOLLM give full control without the maintenance burden. |
| "We're standardised on Microsoft" | DocAI runs on Azure, integrates seamlessly, is transactable on Microsoft Marketplace (counts toward MACC), and operationalises Microsoft AI investments rather than competing with them. |
| "We want to use our own LLMs" | Full BYOLLM: OpenAI, Microsoft, Anthropic, Google, Meta, Mistral, or custom. The platform separates AI understanding from model dependency. |
| "Our requirements are too unique" | 3,000+ pre-built models, 1,000+ use cases, 100+ enterprise connectors. Most "unique" requirements are already covered or quickly configured. |
| "Concerned about technical debt" | Vendor-managed platform eliminates technical debt: upgrades, security, compliance recertifications, AI model improvements — all managed. |
| "We're worried about prompt injection / AI security" | DocAI's patented hierarchical document representation reduces the prompt-injection attack surface by design — the model never sees raw, untrusted text. Plus prompt management & guardrails, encryption, RBAC, full audit, SOC 2 / ISO 27001 / FedRAMP High. |
| "Our agents will just call the LLM directly" | Then your agent inherits the data problem: ungoverned, unstructured, unverifiable. Tungsten makes the agent's calls *reliable* by giving it trusted, AI-ready data; agent-addressable via MCP / A2A. Probabilistic intelligence belongs inside deterministic systems. |

### 8.6 The four enduring truths

1. **Speed to Value** — deploy in weeks, not years. Competitors using DocAI are LIVE while peers are still building.
2. **Proven at Scale** — 25,000+ customers · 40 years · 230+ patents · 10B+ documents/year · $40M+ annual ROI at a single customer (FedEx). Not a science project.
3. **No Technical Debt** — vendor-managed upgrades, quarterly innovation, deep AI R&D, compliance recertifications. Always current.
4. **Trusted AI Output** — feedback loops, HITL, benchmarking, audit trails, governance, continuous learning, hierarchical-representation defences against prompt injection. The difference between an AI pilot and an AI programme.

---

## 9. Session-level decisions

This is the audit trail of why the codebase looks the way it does after the May 2026 refresh.

| # | Decision | Rationale |
|---|---|---|
| 1 | DWA = deep rewrite; AP/AR = medium update; Print + PDF = light updates | DWA is the document intelligence pillar — the artifacts are essentially its corporate narrative. The other three inherit the umbrella but keep pillar-specific positioning. |
| 2 | Lead with **DocAI / AI Understanding Layer / IDP 2.0**; keep TotalAgility / build-vs-buy / L3 as proven sub-frames | The artifacts re-anchor the umbrella; TotalAgility remains the proven commercial vehicle underneath. |
| 3 | Dissect the IDP 2.0 Capability Map into **structured data** (`lib/docai-capability-map.ts`), not a displayed image | The prompts surface relevant clusters contextually as build-vs-buy evidence — *"here's what's already shipped, certified, at scale"*. Future visual rendering can read the same data. |
| 4 | Centralise proof points in `lib/proof-points.ts` | Single source of truth for all four pillar prompts; no inline numbers anywhere else. |
| 5 | **Tungsten Copilot™** is the **parent brand** sitting over existing in-product modules (Extraction prominent, Knowledge Discovery prominent, Development secondary). It does **not** replace them. | Confirmed with user. Avoids invalidating sales material that names Extraction or Knowledge Discovery directly. |
| 6 | **"Copilot for Insights"** brand is **retired**. Replaced by **Knowledge Discovery** | Confirmed with user. Knowledge Discovery is the modern name for what Insights described. |
| 7 | Preserve the verbatim Content Generator CTA closing line across all four pillars | Required for the right-hand-panel UX; assistant must never claim files have been generated. |
| 8 | No route, component, or image-asset changes in this pass | Pure positioning content refresh; UI changes deferred. |

---

## 10. New shared modules — exports reference

### 10.1 `lib/proof-points.ts`

| Export | Type | Purpose |
|---|---|---|
| `SCALE_PROOF_POINTS` | object literal | Years, models, customers, partners, patents, documents/year, connectors, marquee logos. |
| `MOMENTUM_PROOF_POINTS` | object literal | +550% agentic process / +180% agentic extraction. |
| `RECOGNITION_PROOF_POINTS` | object literal | Gartner MQ, Hellios, PDF awards. |
| `COMPLIANCE_PROOF_POINTS` | object literal | Certifications array + annual pen testing. |
| `MARKET_PROOF_POINTS` | object literal | Market-reality citations (Gartner, MIT NANDA, IDC, Huble, BCG, S&P Global). |
| `DWA_OUTCOME_PROOF_POINTS` | object literal | FedEx, Citi, Siemens, Tetrosyl, Aviva, University Hospitals, Safe-Guard, Marginalen, US benchmark, 90% processing reduction. |
| `APAR_OUTCOME_PROOF_POINTS` | object literal | Accuracy, manual-processing reduction, discount uplift, duplicate recovery, cycle reduction, e-invoicing coverage, manual-vs-automated unit cost. |
| `buildCorporateProofPointsBlock()` | `() => string` | Composed markdown block of corporate proof points. Dropped into every pillar system prompt. |
| `buildMarketRealityBlock()` | `() => string` | Composed markdown block of market-reality stats for the build-vs-buy framing. |

### 10.2 `lib/docai-platform.ts`

| Export | Type | Purpose |
|---|---|---|
| `AI_UNDERSTANDING_LAYER` | `const string` | Section: Tungsten's category position. |
| `DATA_PROBLEM_NOT_MODEL_PROBLEM` | `const string` | Section: the wedge. |
| `AI_EXECUTION_GAP` | `const string` | Section: the AI execution gap. |
| `IDP_1_VS_2` | `const string` | Section: IDP 1 → IDP 2 transition. |
| `DOCAI_STAGES` | `const string` | Section: three platform stages. |
| `DOCAI_DESIGN_PRINCIPLES` | `const string` | Section: the five design principles. |
| `DEFENSIBLE_IP` | `const string` | Section: US Patent 12,197,412 B2. |
| `TUNGSTEN_COPILOT_BRAND` | `const string` | Section: parent-brand + component mapping. |
| `BORING_AI` | `const string` | Section: Boring AI build-vs-buy reinforcement. |
| `AGENT_ADDRESSABLE_INVERSION` | `const string` | Section: agents-don't-log-in. |
| `KNOWLEDGE_DISCOVERY_VALUE` | `const string` | Section: cross-document intelligence. |
| `buildDocAIUmbrellaBlock()` | `() => string` | Full umbrella composed for DWA. |
| `buildDocAICondensedBlock()` | `() => string` | Condensed umbrella for Print, PDF, AP/AR. |

### 10.3 `lib/docai-capability-map.ts`

| Export | Type | Purpose |
|---|---|---|
| `CapabilityLayer` | type union | The 8 layers (`'ingestion' \| 'idp' \| ...`). |
| `Capability` | interface | `{ id, label, layer, group?, summary?, buildCost? }`. |
| `LAYER_LABELS` | `Record<CapabilityLayer, string>` | Human-readable layer labels. |
| `CAPABILITIES` | `Capability[]` | The full taxonomy (~110 capabilities). |
| `getCapabilitiesByLayer(layer)` | function | Filter by layer. |
| `getCapabilitiesByGroup(group)` | function | Filter by sub-group ("Extraction", "OCR / ICR Engines", etc.). |
| `summariseLayer(layer)` | function | Markdown summary of a single layer (with sub-groups). |
| `buildFullCapabilityMapBlock()` | function | Render the full map as a markdown block (used in DWA system prompt). |
| `buildCapabilityMapInstruction()` | function | "How to use the capability map in a conversation" instruction block — tells the model when and how to surface clusters. |

### 10.4 Pillar prompts — what they import

| Pillar prompt | Imports from `docai-platform` | Imports from `proof-points` | Imports from `docai-capability-map` |
|---|---|---|---|
| `dwa-system-prompt.ts` | `buildDocAIUmbrellaBlock` | `buildCorporateProofPointsBlock`, `buildMarketRealityBlock`, `DWA_OUTCOME_PROOF_POINTS`, `MARKET_PROOF_POINTS`, `MOMENTUM_PROOF_POINTS`, `RECOGNITION_PROOF_POINTS`, `SCALE_PROOF_POINTS` | `buildCapabilityMapInstruction`, `buildFullCapabilityMapBlock` |
| `apar-system-prompt.ts` | `buildDocAICondensedBlock` | `APAR_OUTCOME_PROOF_POINTS`, `buildCorporateProofPointsBlock`, `COMPLIANCE_PROOF_POINTS`, `SCALE_PROOF_POINTS` | — |
| `print-system-prompt.ts` | `buildDocAICondensedBlock` | `COMPLIANCE_PROOF_POINTS`, `RECOGNITION_PROOF_POINTS`, `SCALE_PROOF_POINTS` | — |
| `pdf-system-prompt.ts` | `buildDocAICondensedBlock` | `COMPLIANCE_PROOF_POINTS`, `RECOGNITION_PROOF_POINTS`, `SCALE_PROOF_POINTS` | — |

---

## 11. Open items and future work

### 11.1 Chat history with persistent past chats

**Today**: `lib/chat-storage.ts` saves up to 50 messages per pillar to localStorage under a single key (`tungsten-{pillarId}-chat`). "New chat" wipes that key — old chats are gone. No conversation IDs, no titles, no list, no sidebar.

**Proposed**:
- Migrate from `Message[]` per pillar to `Conversation[]` per pillar, where `Conversation = { id, title, pillar, createdAt, updatedAt, messages }`.
- Auto-title each conversation from the first ~60 chars of the first user message.
- "New chat" creates a fresh conversation row instead of wiping; old ones stay accessible.
- Detect the legacy format on load and convert it to a single legacy conversation entry — nothing lost.
- Add a "Past chats" panel inside the chat header — collapsible list (per pillar) with title + relative timestamp, click to load, hover to delete/rename.
- Stay localStorage-only for this pass; layer a backend later if cross-device sync is needed.

### 11.2 Response truncation fix

**Today**: `app/api/chat/route.ts` sets `maxOutputTokens: 4096` and `maxDuration: 120` seconds. The new dense positioning briefs can hit the 4096-token ceiling; a long stream can hit the 120-second wall and be silently killed by Vercel. There is no `try/catch` around `streamText()`, so stream aborts surface as if the partial message were the complete response.

**Proposed**:
- Bump `maxOutputTokens` 4096 → 16384 (Opus 4.6 handles much larger outputs).
- Bump `maxDuration` 120 → 300 (Vercel Pro plan ceiling).
- Wrap `streamText()` in a `try/catch` that pipes errors into the UI stream so an interrupted stream surfaces as an explicit "stream interrupted, retry?" instead of a silent partial.

### 11.3 Optional follow-up — capability map as a model tool

The current DWA system prompt embeds the full Capability Map (~4,000 words via `buildFullCapabilityMapBlock()`). A leaner approach: expose the capability map as an **AI SDK tool** the model can query, e.g. `lookupCapabilities({ layer?, keywords[] })` returning the relevant `Capability[]`. The model pulls only the cluster it needs in any given turn, keeping the system prompt smaller and the model's output budget freer for the response.

### 11.4 UI capability explorer (future)

Because the capability map is structured data, a future UI could render a browsable explorer (filter by layer, search by keyword, click for details) on the home page or as a side panel. The same `lib/docai-capability-map.ts` powers both the assistant and the UI.

---

## 12. Source attributions

- Tungsten Automation, *"Tungsten Automation's AI Strategy: Advance Document Intelligence"*, March 2026.
- Tungsten Automation, *"Tungsten DocAI™ Platform | IDP 2.0 Complete Enterprise Capability Map"*.
- Gartner, *"More Than 80% of Enterprises Will Have Used Generative AI APIs or Deployed Generative AI-Enabled Applications by 2026"*, Press Release, October 2023.
- Challapally, A., Pease, C., Raskar, R., & Chari, P., *"The GenAI Divide: State of AI in Business 2025"*, MIT NANDA, July 2025.
- IDC, *Global DataSphere Forecast, 2021–2025*; *"Less than 1% of enterprise unstructured data is currently used in generative AI"*.
- Gartner, *Magic Quadrant for Intelligent Document Processing Solutions*, September 2025 — Tungsten Automation positioned as a Leader.
- Huble, *"The AI Data Readiness Report"*, 2025 — survey of 150 senior business leaders.
- BCG and S&P Global AI adoption/abandonment commentary, 2025.
