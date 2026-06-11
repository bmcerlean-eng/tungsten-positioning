---
name: tungsten-positioning
description: >-
  Generate executive-quality Tungsten Automation sales positioning content for a
  specific account and scenario, then export it as a branded Word (.docx)
  document, a standalone HTML page, and/or a self-contained HTML slide deck. Use
  whenever the user wants to produce Tungsten positioning collateral, a positioning
  brief, a Build-vs-Buy document, or an account-specific deck/presentation outside
  the web app — for any pillar (DWA, AP & AR, Print, PDF).
---

# Tungsten AI Positioning — Document + HTML

This skill reproduces the deliverables of the Tungsten AI Positioning app, tailored to a
named account and scenario:

- A **positioning document** — branded **Word (.docx)** + matching **HTML** page.
- An optional **slide deck** — a self-contained, navigable **HTML** presentation.

You (Claude) author the content; bundled scripts render the files from JSON. Ask the user
which they want (document, deck, or both) if it isn't clear; default to the document.

## Inputs to gather

1. **Account** — the company being pitched (e.g. Citibank, Zurich, Maersk). REQUIRED.
2. **Scenario** — the context/opportunity (e.g. "evaluating Hyperscience for claims",
   "CIO AI-ready data strategy", "displace OpenText"). REQUIRED.
3. **Pillar** — `dwa` (default), `ap-ar`, `print`, or `pdf`.
4. **Audience** — CIO (default), VP Operations, IT Director, Line of Business, Partner.

If the account or scenario is missing, ask before proceeding. Accept pasted notes,
emails, or RFP text as scenario input.

## Procedure

1. **Load the product knowledge** for the chosen pillar so the content is grounded and
   accurate. Read the matching system prompt and supplementary content:
   - `dwa`    → `lib/dwa-system-prompt.ts`   + `lib/dwa-content.ts`
   - `ap-ar`  → `lib/apar-system-prompt.ts`  + `lib/apar-content.ts`
   - `print`  → `lib/print-system-prompt.ts` + `lib/print-content.ts`
   - `pdf`    → `lib/pdf-system-prompt.ts`    + `lib/pdf-content.ts`

   Use ONLY facts, proof points, stats, and competitive claims found there (plus the
   guidance below). Do not fabricate customer stories or numbers.

2. **Author the positioning content** as the JSON object specified under "Output schema",
   following the narrative and formatting rules below. Lead with the client's world, make
   the stakes tangible, position via value-based outcomes, and land on an inevitable
   conclusion (PISB — never label these phases).

3. **Write the JSON** to a temp file, e.g. `/tmp/tungsten_brief.json`.

4. **Render both files.** Pick an output basename (no extension) in a `generated-positioning/`
   folder using the account + date, then run:

   ```bash
   cat /tmp/tungsten_brief.json | python3 .claude/skills/tungsten-positioning/scripts/render_outputs.py generated-positioning/<Account>_<pillar>_positioning
   ```

   The script prints the `.docx` path then the `.html` path. The `.docx` reuses the app's
   exact branding via `scripts/generate_doc.py` (needs `python-docx`, in `requirements.txt`;
   `pip install python-docx` if missing). The `.html` is self-contained and print-ready.

5. **Deliver both files** to the user with `SendUserFile`, and give a 2–3 line summary of the
   positioning angle you took.

## Narrative & formatting rules

- **PISB arc, invisible to reader:** open with the client's industry/pressures → quantify the
  cost of inaction → position via value-based outcomes (not features) → close with gravity.
- **Account-specific throughout.** Reference the account by name. Choose stats, proof points,
  and customer examples from the SAME industry vertical as the account (banking for banks, etc.).
- **Assertive headings, not topic labels.** "Trade finance manual processing costs global banks
  $4.2B annually" — not "The Problem".
- Every paragraph passes the "so what?" test. Strip filler ("leverage", "synergies", "holistic",
  "best-in-class"). Be specific with numbers, names, and outcomes.
- Tailor comparison tables to the account's actual tech stack (e.g. Azure → vs Azure AI Document
  Intelligence). Weave in the Build-vs-Buy argument (95% of GenAI pilots fail, vendor solutions 2×
  success rate, etc.) where it fits — these facts live in the pillar files above.

## Content requirements

- 6–10 "pages" of content (use `page_break` sections to pace it).
- Exactly **3** `keyStats`, chosen for the account's industry.
- At least **2** `callout` boxes with high-impact insights.
- At least **1** comparison `table` (Tungsten vs DIY/competitor, tailored to the stack).
- At least **1** customer proof-points `table` from the account's industry.
- `subtitle` is normally `"TUNGSTEN AUTOMATION"`; `date` should be the current month and year.

## Output schema

Author exactly this shape (no markdown, no code fences in the file you write):

```json
{
  "title": "Client-specific, value-led document title",
  "subtitle": "TUNGSTEN AUTOMATION",
  "date": "June 2026",
  "keyStats": [
    { "value": "STAT", "label": "industry-relevant descriptor" },
    { "value": "STAT", "label": "industry-relevant descriptor" },
    { "value": "STAT", "label": "industry-relevant descriptor" }
  ],
  "sections": [
    { "type": "heading", "title": "Assertive statement headline" },
    { "type": "paragraph", "text": "Body text..." },
    { "type": "subheading", "title": "Sub-section title" },
    { "type": "bullets", "items": ["Point 1", "Point 2"] },
    { "type": "callout", "label": "KEY INSIGHT", "text": "Impactful quote...", "attribution": "Source" },
    { "type": "table", "headers": ["Col1", "Col2"], "rows": [["A", "B"]] },
    { "type": "page_break" }
  ]
}
```

Supported section `type`s: `heading`, `subheading`, `paragraph`, `bullets`, `callout`,
`table`, `page_break`. Both renderers understand all of them — keep to this schema so the
Word doc and HTML stay in sync.

---

## Slide deck (optional)

When the user wants a presentation/deck, author a separate **slide JSON** (same product
knowledge and PISB arc as above, but slide-shaped) and render it to a self-contained HTML
slideshow. The same step 1–3 grounding applies.

Render:

```bash
cat /tmp/tungsten_deck.json | python3 .claude/skills/tungsten-positioning/scripts/render_deck_html.py generated-positioning/<Account>_<pillar>_deck
```

The output `.html` is dependency-free: arrow keys / Space / click edges to navigate,
**N** toggles speaker notes, **F** fullscreen, and it prints cleanly to PDF (one slide per
page). Then deliver it with `SendUserFile`.

### Deck rules

- First slide `title`, last slide `closing`. Use `section` dividers for PISB transitions.
- Include at least one `stats` slide (3 industry-relevant stats) and one `comparison`
  slide (Tungsten vs DIY/competitor, tailored to the account's stack).
- Headlines are assertive, insight-driven statements. Max 3–4 bullets per slide, each one
  line. Alternate `content-white` / `content-blue` for rhythm. Every slide gets `speakerNotes`.

### Deck schema

```json
{
  "title": "Deck title — client-specific, value-led",
  "subtitle": "Deck subtitle",
  "slides": [
    {
      "layout": "title | content-white | content-blue | section | closing | stats | comparison",
      "title": "Assertive insight-driven headline",
      "subtitle": "Optional — title/section/closing only",
      "bullets": ["Short punchy point — one line max"],
      "stats": [{ "value": "95%", "label": "of GenAI pilots fail (MIT 2025)" }],
      "comparison": { "headers": ["Col1", "Col2", "Col3"], "rows": [["A", "B", "C"]] },
      "speakerNotes": "Why this slide matters + delivery guidance"
    }
  ]
}
```

Supported layouts: `title`, `section`, `closing`, `content-white`, `content-blue`,
`stats`, `comparison`. (For a native PowerPoint `.pptx` instead, the app's
`scripts/generate_deck.py` consumes this exact schema.)
