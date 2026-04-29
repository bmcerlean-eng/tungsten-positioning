import { createAnthropic } from "@ai-sdk/anthropic";
import { convertToModelMessages, streamText, UIMessage } from "ai";
import { getPillarPrompt } from "@/lib/pillar-prompts";

export const maxDuration = 120;

// Session ingress token written by Claude Code in remote environments
const SESSION_TOKEN_FILE = "/home/claude/.claude/remote/.session_ingress_token";

async function getAnthropicClient() {
  // 1. Prefer an explicit API key from env or .env.local
  let apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    try {
      const fs = await import("fs");
      const path = await import("path");
      const envPath = path.join(process.cwd(), ".env.local");
      const content = fs.readFileSync(envPath, "utf8");
      const match = content.match(/^ANTHROPIC_API_KEY=(.+)/m);
      if (match) apiKey = match[1].trim();
    } catch { /* ignore */ }
  }
  if (apiKey) {
    return createAnthropic({ apiKey, baseURL: "https://api.anthropic.com/v1" });
  }

  // 2. Fall back to Claude Code session token (Bearer auth) in remote environments
  try {
    const fs = await import("fs");
    const authToken = fs.readFileSync(SESSION_TOKEN_FILE, "utf8").trim();
    return createAnthropic({ authToken, baseURL: "https://api.anthropic.com/v1" });
  } catch { /* ignore */ }

  // 3. Let SDK pick up ANTHROPIC_API_KEY from env as last resort
  return createAnthropic({ baseURL: "https://api.anthropic.com/v1" });
}

export async function POST(req: Request) {
  const { messages, pillar }: { messages: UIMessage[]; pillar?: string } = await req.json();

  const anthropic = await getAnthropicClient();
  const { systemPrompt, content } = getPillarPrompt(pillar ?? "dwa");
  const fullSystemPrompt = systemPrompt + "\n\n" + content;

  const result = streamText({
    model: anthropic("claude-opus-4-6"),
    system: fullSystemPrompt,
    messages: await convertToModelMessages(messages),
    maxOutputTokens: 4096,
  });

  return result.toUIMessageStreamResponse();
}
