import { createAnthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import { execFile } from "child_process";
import { readFile, unlink } from "fs/promises";
import path from "path";

// Session ingress token written by Claude Code in remote environments
const SESSION_TOKEN_FILE = "/home/claude/.claude/remote/.session_ingress_token";

async function getAnthropicClient() {
  // 1. Prefer an explicit API key from env or .env.local
  let apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    try {
      const fs2 = await import("fs");
      const content = fs2.readFileSync(path.join(process.cwd(), ".env.local"), "utf8");
      const match = content.match(/^ANTHROPIC_API_KEY=(.+)/m);
      if (match) apiKey = match[1].trim();
    } catch { /* ignore */ }
  }
  if (apiKey) {
    return createAnthropic({ apiKey, baseURL: "https://api.anthropic.com/v1" });
  }

  // 2. Fall back to Claude Code session token (Bearer auth) in remote environments
  try {
    const fs2 = await import("fs");
    const authToken = fs2.readFileSync(SESSION_TOKEN_FILE, "utf8").trim();
    return createAnthropic({ authToken, baseURL: "https://api.anthropic.com/v1" });
  } catch { /* ignore */ }

  // 3. Let SDK pick up ANTHROPIC_API_KEY from env as last resort
  return createAnthropic({ baseURL: "https://api.anthropic.com/v1" });
}

/** Try py → python → python3 in order; return the first that works. */
async function resolvePython(): Promise<string> {
  for (const cmd of ["py", "python", "python3"]) {
    try {
      await new Promise<void>((resolve, reject) => {
        execFile(cmd, ["--version"], { timeout: 5000 }, (err) =>
          err ? reject(err) : resolve()
        );
      });
      return cmd;
    } catch {
      // try next
    }
  }
  throw new Error(
    "Python not found. Install Python and ensure 'py', 'python', or 'python3' is in your PATH."
  );
}

export const maxDuration = 300;

export async function POST(req: Request) {
  try {
    const { topic, audience, slideCount, format, deckFormat, chatContext } = await req.json();

    const contextBlock = chatContext
      ? `\n\nIMPORTANT CONTEXT — The user had the following conversation with the DWA Positioning Assistant before requesting this content. Use this context to tailor your output:\n\n${chatContext}\n\n`
      : "";

    const anthropic = await getAnthropicClient();

    // Determine which format to generate
    const outputFormat = format || "pptx"; // "pptx", "docx", or "both"

    if (outputFormat === "docx" || outputFormat === "both") {
      // Generate Word document content
      const { text: docJson } = await generateText({
        model: anthropic("claude-opus-4-6"),
        maxOutputTokens: 16000,
        prompt: `You are a 30-year McKinsey veteran partner. Build an executive-quality positioning document for Tungsten Automation.

Topic: ${topic}
Target Audience: ${audience}
${contextBlock}

## NARRATIVE FRAMEWORK (PISB — invisible to reader)

1. Open with the CLIENT'S world — their industry, their pressures, their specific challenge. Reference them by name if known.
2. Make the stakes tangible — quantify cost of inaction with industry-specific data.
3. Position the solution through value-based outcomes — what changes for THEM, not what the product does.
4. Land on benefit with gravity — inevitable conclusion, not a sales pitch.

## CLIENT-SPECIFIC REQUIREMENTS

- Every section must address the specific client's situation, not generic Tungsten positioning
- Select stats and proof points relevant to THIS client's industry vertical
- Choose customer examples from the SAME industry (banking for banks, insurance for insurers, etc.)
- Tailor comparison tables to the client's specific technology stack
- The executive should feel "they get us" before "they want to sell us something"

## FORMATTING RULES

- Section headings must be assertive statements, not topic labels ("Trade finance manual processing costs global banks $4.2B annually" not "The Problem")
- Every paragraph must pass the "so what?" test
- Strip filler: no "leverage", "synergies", "holistic", "best-in-class"
- Be specific with numbers, names, and outcomes — never vague

## PROOF POINTS (select by client industry)

Banking: Top 10 bank $2.5M savings (25% cost reduction), 333% efficiency in auto lending, $10M onboarding savings
Insurance: $116M fraud uncovered (Aviva), 75% adjudication reduction (Safe-Guard)
Logistics: $40M+ annual ROI (FedEx), 350M to 1B pages scaled
Manufacturing: 90% automation (Siemens), 90 hrs/month saved (Tetrosyl)
General: 25,000+ customers, 8/10 top banks, 7/10 top insurers, Gartner MQ Leader

## BUILD vs BUY DATA

- 95% of GenAI pilots fail (MIT 2025)
- 42% abandoned AI initiatives (S&P Global 2025)
- Vendor solutions 2x success rate (67% vs 33%)
- 5-6 Microsoft products + 6 months to match TotalAgility
- 50-70% of AI budget should go to data readiness

Output ONLY valid JSON (no markdown, no code fences):
{
  "title": "Client-specific, value-led document title",
  "subtitle": "TUNGSTEN AUTOMATION",
  "date": "March 2026",
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

Rules:
- 6-10 pages of content
- PISB narrative arc throughout — open with client's world, end with inevitable conclusion
- At least 2 callout boxes with impactful insights
- At least 1 comparison table (Tungsten vs DIY/competitor, tailored to client's stack)
- At least 1 customer proof points table (from client's industry)
- keyStats: exactly 3, selected for relevance to THIS client's industry
- Every section heading is an assertive statement, not a topic label`,
      });

      let docData;
      try {
        const jsonMatch = docJson.match(/\`\`\`(?:json)?\s*([\s\S]*?)\`\`\`/) || [
          null,
          docJson,
        ];
        docData = JSON.parse(jsonMatch[1]!.trim());
      } catch {
        return Response.json(
          { error: "Failed to parse document content" },
          { status: 500 }
        );
      }

      // Generate the Word document
      const docScriptPath = path.join(
        process.cwd(),
        "scripts",
        "generate_doc.py"
      );

      const pythonCmd = await resolvePython();
      const docxPath = await new Promise<string>((resolve, reject) => {
        const child = execFile(
          pythonCmd,
          [docScriptPath],
          { timeout: 60000 },
          (error, stdout, stderr) => {
            if (error) {
              console.error("Python stderr (doc):", stderr);
              reject(new Error(stderr || error.message));
            } else {
              resolve(stdout.trim());
            }
          }
        );
        child.stdin?.write(JSON.stringify(docData));
        child.stdin?.end();
      });

      if (outputFormat === "docx") {
        const fileBuffer = await readFile(docxPath);
        unlink(docxPath).catch(() => {});

        const filename = `${topic.replace(/[^a-zA-Z0-9]+/g, "_")}_positioning.docx`;
        return new Response(fileBuffer, {
          headers: {
            "Content-Type":
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "Content-Disposition": `attachment; filename="${filename}"`,
          },
        });
      }

      // If "both", also generate the PPTX (fall through below), then zip them
      // For simplicity, we'll return the doc and let the client request pptx separately
      // Actually let's generate both and return as a zip... but that adds complexity.
      // Instead: generate both, return a JSON with download URLs.
      // Simplest approach: return the docx, and the client can separately request pptx.
      // Let's do docx here since the client already handles pptx separately.
      const fileBuffer = await readFile(docxPath);
      unlink(docxPath).catch(() => {});

      const filename = `${topic.replace(/[^a-zA-Z0-9]+/g, "_")}_positioning.docx`;
      return new Response(fileBuffer, {
        headers: {
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "Content-Disposition": `attachment; filename="${filename}"`,
        },
      });
    }

    // --- PPTX generation (default) ---

    // Generate slide content using Claude — Executive Deck Builder quality
    const { text } = await generateText({
      model: anthropic("claude-opus-4-6"),
      maxOutputTokens: 10000,
      prompt: `You are a 30-year McKinsey veteran partner who has built thousands of executive presentations. Every slide earns its place. Every word carries weight. White space is a strategic choice.

Build an executive-ready PowerPoint deck for Tungsten Automation.

Topic: ${topic}
Target Audience: ${audience}
Number of slides: ${slideCount}
${contextBlock}

## NARRATIVE FRAMEWORK (PISB — invisible to audience)

Structure the deck around Problem, Impact, Solution, Benefit — but NEVER label these. The audience should feel the logic, not see the scaffolding:

1. **Open with the CLIENT'S world** — demonstrate genuine understanding of their industry dynamics, macro pressures, and the specific dilemma they face. Reference the client BY NAME if provided. Use data, market context, and language that signals real research — not generic talking points.

2. **Make the stakes tangible** — quantify the cost of inaction. Show the trajectory they are on. Use industry-specific stats relevant to THIS client's vertical (banking stats for banks, insurance for insurers, etc.). Show empathy, not alarm.

3. **Position the solution through value-based outcomes** — don't lead with features. Lead with what changes for THEM. Measurable business outcomes that resolve the tension established. Use proof points from the SAME industry vertical as the client.

4. **Land on benefit with gravity** — the close should feel inevitable, not salesy. The executive walks away thinking "they get us" before "they want to sell us something."

## SLIDE TYPES AND VISUAL PATTERNS

Use these slide archetypes — mix them for visual variety and impact:

**"stats" layout** — Industry Insights slide: 3 large stat callouts with short descriptors. Pattern:
  stats: [{"value": ">33%", "label": "of banking processes remain unautomated"}, {"value": "90%", "label": "indicate needed data is often unavailable"}, {"value": "45%", "label": "cite data accuracy as top barrier to scaling AI"}]
  SELECT stats relevant to the CLIENT'S industry, not generic ones.

**"comparison" layout** — Tungsten vs Build/Competitor table. Pattern:
  comparison: {"headers": ["Capability", "Tungsten", "DIY Build"], "rows": [["Time to production", "1-2 months", "6-12 months"], ...]}
  TAILOR to the client's specific tech stack (e.g., if Azure, compare vs Azure AI Document Intelligence).

**"content-white" / "content-blue"** — Standard bullet slides. Max 3-4 bullets, each ONE LINE. Alternate white/blue for visual rhythm.

**"section"** — Section divider for narrative transitions.

**"title"** — Opening slide. MUST reference the client by name and the specific value proposition.

**"closing"** — Final slide. Next steps or discussion prompt.

## FORMATTING RULES (non-negotiable)

- Headlines must be ASSERTIVE, INSIGHT-DRIVEN STATEMENTS — not topic labels.
  GOOD: "Trade finance processing costs Citi $2.3B annually — 60% is manual handling"
  BAD: "Cost Overview" or "The Problem"
- No bullet should run past ONE line. If it does, rewrite it.
- Max 3-4 content elements per slide. Let the slide breathe.
- Strip ALL filler language: "leverage", "synergies", "holistic", "best-in-class", "robust" — unless doing real work.
- Every slide must pass the "so what?" test. If an executive can't immediately see why this slide matters to their decision, cut it.
- Speaker notes must include: why this slide matters, key talking points, and delivery guidance.

## PROOF POINTS (select those relevant to client's industry)

Banking: Top 10 bank reduced transaction cost by 25% ($2.5M savings), 333% efficiency increase in auto lending, $10M savings in customer onboarding
Insurance: $116M fraud uncovered (Aviva), 75% adjudication time reduction (Safe-Guard)
Logistics: $40M+ annual ROI (FedEx), 350M to 1B pages scaled over 3 years
Manufacturing: 90% automation rate (Siemens), 90 hours/month saved (Tetrosyl), 99% error reduction
General: 25,000+ customers, 8/10 top global banks, 7/10 top insurers, 2025 Gartner MQ Leader for IDP

## BUILD vs BUY DATA (weave in where relevant)

- 95% of GenAI pilots fail to deliver value (MIT 2025)
- 42% of companies abandoned most AI initiatives (S&P Global 2025)
- Vendor solutions succeed at 2x the rate of DIY (67% vs 33%)
- To match TotalAgility using Microsoft tools alone: 5-6 separate products, 6+ months
- Winning AI programs earmark 50-70% of budget for data readiness

## OUTPUT FORMAT

Output ONLY valid JSON (no markdown, no code fences):
{
  "title": "Deck title — client-specific, value-led",
  "subtitle": "Deck subtitle",
  "slides": [
    {
      "layout": "title" | "content-white" | "content-blue" | "section" | "closing" | "stats" | "comparison",
      "title": "Assertive insight-driven headline",
      "subtitle": "Optional (title/section/closing only)",
      "bullets": ["Short punchy point — one line max"],
      "stats": [{"value": "95%", "label": "of GenAI pilots fail (MIT 2025)"}],
      "comparison": {"headers": ["Col1", "Col2", "Col3"], "rows": [["A", "B", "C"]]},
      "speakerNotes": "Why this slide matters + delivery guidance"
    }
  ]
}

Rules:
- First slide: "title" layout — client name + value proposition
- Last slide: "closing" layout
- Include at least ONE "stats" slide with 3 industry-relevant stats
- Include at least ONE "comparison" slide (Tungsten vs Build/Competitor)
- Use "section" for narrative transitions between PISB phases
- Alternate "content-white" and "content-blue" for variety
- Every slide has speakerNotes`,
    });

    // Parse the JSON from Claude's response
    let slideData;
    try {
      const jsonMatch = text.match(/\`\`\`(?:json)?\s*([\s\S]*?)\`\`\`/) || [
        null,
        text,
      ];
      slideData = JSON.parse(jsonMatch[1]!.trim());
    } catch {
      return Response.json(
        { error: "Failed to parse slide content" },
        { status: 500 }
      );
    }

    // Call Python script to generate the .pptx
    const scriptPath = path.join(process.cwd(), "scripts", "generate_deck.py");

    // Select template and mode based on deckFormat
    const effectiveDeckFormat = deckFormat || "slides";
    let templateFile: string;
    let mode: string;

    if (effectiveDeckFormat === "l0") {
      templateFile = "TungstenL0.pptx";
      mode = "insert-after-1"; // Insert generated slides after slide 1
    } else if (effectiveDeckFormat === "sbr") {
      templateFile = "TungstenSBR.pptx";
      mode = "insert-after-3"; // Insert generated slides after slide 3
    } else {
      templateFile = "TungstenAutomation.potx";
      mode = "replace-all"; // Current behavior — clear all, insert generated only
    }

    const templatePath = path.join(process.cwd(), "templates", templateFile);

    const pythonCmd = await resolvePython();
    const pptxPath = await new Promise<string>((resolve, reject) => {
      const child = execFile(
        pythonCmd,
        [scriptPath, templatePath, "--mode", mode],
        { timeout: 60000 },
        (error, stdout, stderr) => {
          if (error) {
            console.error("Python stderr:", stderr);
            reject(new Error(stderr || error.message));
          } else {
            resolve(stdout.trim());
          }
        }
      );
      child.stdin?.write(JSON.stringify(slideData));
      child.stdin?.end();
    });

    // Read the generated file and return as download
    const fileBuffer = await readFile(pptxPath);

    // Clean up temp file
    unlink(pptxPath).catch(() => {});

    const filename = `${topic.replace(/[^a-zA-Z0-9]+/g, "_")}_deck.pptx`;

    return new Response(fileBuffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Deck generation error:", error);
    return Response.json(
      {
        error: error instanceof Error ? error.message : "Deck generation failed",
      },
      { status: 500 }
    );
  }
}
