# Deck and Document Output Format (Markdown)

The Tungsten Positioning web app generates branded `.pptx` and `.docx` files via Python scripts. This skill cannot produce binary files — instead, produce **markdown** with the same narrative structure and content the app would generate, so the seller can review and refine before running the app for the actual file.

For real `.pptx` / `.docx` output, tell the seller:

> Run the Tungsten Positioning app (`npm run dev` at localhost:3002) and use the Content Generator panel. Paste this conversation's context in to tailor the output.

## The PISB Narrative Framework

Every executive deck and positioning document follows **PISB** — Problem, Impact, Solution, Benefit — but **never label these phases**. The audience should feel the logic, not see the scaffolding.

1. **Open with the CLIENT'S world** — demonstrate understanding of their industry, macro pressures, and the specific dilemma they face. Reference the client by name. Use data, market context, and language that signals real research — not generic talking points.
2. **Make the stakes tangible** — quantify cost of inaction with industry-specific data. Show the trajectory they're on. Use stats from the client's vertical (banking stats for banks, insurance for insurers, manufacturing for manufacturers).
3. **Position the solution through value-based outcomes** — don't lead with features. Lead with what changes for THEM. Measurable business outcomes. Use proof points from the SAME industry as the client.
4. **Land on benefit with gravity** — the close should feel inevitable, not salesy. The executive walks away thinking "they get us" before "they want to sell us something."

## Slide Markdown Template

For each slide, produce:

```markdown
### Slide N — [Layout type]

**Title:** [Assertive, insight-driven headline — not a topic label]

**Subtitle:** [Optional — title/section/closing slides only]

**Body:**
- Bullet 1 (one line max, no filler)
- Bullet 2
- Bullet 3

**Stats (for stats layout):**
- 95% | of in-house GenAI pilots fail to deliver business value (MIT 2025)
- 2× | success rate of vendor-sourced AI solutions vs DIY (67% vs 33%)
- 50–70% | of winning AI budgets allocated to data readiness

**Comparison (for comparison layout):**
| Capability | Tungsten | DIY Build / Competitor |
|---|---|---|
| Time to production | 1–2 months | 6–12 months |
| ... | ... | ... |

**Speaker notes:** [Why this slide matters + key talking points + delivery guidance — 2-4 sentences]
```

## Slide Layouts (Archetypes)

Mix these for visual variety and impact:

| Layout | When to use |
|---|---|
| `title` | Opening slide. Client name + value proposition. |
| `content-white` / `content-blue` | Standard bullet slides. Max 3–4 bullets, each one line. Alternate white/blue for rhythm. |
| `stats` | Industry insights — 3 large stat callouts with short descriptors. Select stats relevant to THIS client's industry. |
| `comparison` | Tungsten vs Build / Competitor table. Tailor to the client's specific tech stack. |
| `section` | Section divider for narrative transitions. |
| `closing` | Final slide. Next steps or discussion prompt. |

## Formatting Rules (Non-Negotiable)

- **Headlines must be assertive, insight-driven statements**, not topic labels.
  - GOOD: "Trade finance processing costs Citi $2.3B annually — 60% is manual handling"
  - BAD: "Cost Overview" or "The Problem"
- **No bullet runs past one line.** If it does, rewrite it.
- **Max 3–4 content elements per slide.** Let the slide breathe.
- **Strip filler**: "leverage", "synergies", "holistic", "best-in-class", "robust" — unless doing real work.
- **Every slide must pass the "so what?" test.** If an executive can't immediately see why this slide matters to their decision, cut it.
- **Speaker notes always required.** They cover why this slide matters, key talking points, and delivery guidance.

## Deck Structure Rules

- **First slide**: `title` layout — client name + value proposition
- **Last slide**: `closing` layout — discussion prompt or clear next step
- **At least one** `stats` slide with 3 industry-relevant stats
- **At least one** `comparison` slide (Tungsten vs Build / Competitor)
- Use `section` slides for narrative transitions between PISB phases
- Alternate `content-white` and `content-blue` for visual rhythm
- Typical length: 6–10 slides

## Document Structure Rules (DOCX-equivalent markdown)

For positioning documents (the `.docx` equivalent), use these section types:

- **heading** — Assertive statement headline (not a topic label)
- **paragraph** — Body text, every paragraph passes the "so what?" test
- **subheading** — Sub-section title
- **bullets** — List of short, punchy points
- **callout** — Impactful insight with attribution; format like a blockquote with a `KEY INSIGHT` label and source
- **table** — Comparison table or proof points table
- **page_break** — Section divider

Document structure:
- Length: 6–10 pages of content
- PISB narrative arc throughout
- At least 2 callout boxes with impactful insights
- At least 1 comparison table (Tungsten vs DIY/competitor, tailored to client's stack)
- At least 1 customer proof points table from the client's industry
- `keyStats`: exactly 3, selected for relevance to the client's industry
- Every section heading is an assertive statement, not a topic label

## Proof Points Library (select by client industry)

Use these — don't invent new ones:

**Banking**
- Top 10 bank reduced transaction cost by 25% ($2.5M savings)
- 333% efficiency increase in auto lending
- $10M savings in customer onboarding

**Insurance**
- $116M fraud uncovered (Aviva)
- 75% adjudication time reduction (Safe-Guard Products International)

**Logistics**
- $40M+ annual ROI (FedEx)
- 350M → 1B pages scaled over 3 years

**Manufacturing**
- 90% automation rate (Siemens)
- 90 hours/month saved, 99% error reduction (Tetrosyl)
- 41% efficiency gain, 42% turnaround reduction, 38% cost savings (US manufacturing benchmark)

**Healthcare**
- $9.6M value across 68 processes (University Hospitals)

**General**
- 25,000+ customers
- 8/10 top global banks, 7/10 top insurers, 3/5 largest logistics
- 2025 Gartner MQ Leader for IDP

## Build vs Buy Data (weave in for DWA / AP-AR)

- 95% of GenAI pilots fail to deliver value (MIT 2025)
- 42% of companies abandoned most AI initiatives (S&P Global 2025)
- Vendor solutions succeed at 2× the rate of DIY (67% vs 33%)
- To match TotalAgility using Microsoft tools alone: 5–6 separate products, 6+ months
- Winning AI programmes earmark 50–70% of budget for data readiness

## Audience-Specific Tone

| Audience | Lead with |
|---|---|
| **CIO** | Strategy, risk, competitive position, transformation arc |
| **IT Director** | Integration, operational simplicity, server/infra reduction, deployment |
| **CFO / VP Finance** | Cash flow, working capital, TCO, EA renewal economics |
| **AP/AR Director / Shared Services** | Efficiency, accuracy, exception rate, supplier relationships |
| **Procurement** | TCO, licensing terms, vendor consolidation, contract leverage |
| **Line of Business** | User experience, productivity, efficiency, ease of use |
| **Legal / Compliance** | Audit trails, redaction, Bates numbering, regulatory mandates |

## Format-Specific Deck Templates (informational — the live app handles these)

The Content Generator panel offers three template modes:

| Mode | Template | Use |
|---|---|---|
| **L0** | TungstenL0.pptx | Inserts generated slides after slide 1 of the template. For first-look executive briefings. |
| **SBR** | TungstenSBR.pptx | Strategic Business Review — inserts after slide 3. For account planning sessions. |
| **Slides Only** | TungstenAutomation.potx | Clears template, inserts generated slides only. Standalone use. |

When producing the markdown deck, you don't choose a template — that's the app's job. But if the seller asks "what should this go in?", L0 is the default for first conversations; SBR for ongoing account planning.
