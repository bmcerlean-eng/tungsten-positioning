import { createAnthropic } from "@ai-sdk/anthropic";
import { convertToModelMessages, streamText, UIMessage } from "ai";
import { getPillarPrompt } from "@/lib/pillar-prompts";

export const maxDuration = 120;

export async function POST(req: Request) {
  const { messages, pillar }: { messages: UIMessage[]; pillar?: string } = await req.json();

  // Fallback: read key from .env.local if process.env didn't load it
  let apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    try {
      const fs = await import("fs");
      const path = await import("path");
      const envPath = path.join(process.cwd(), ".env.local");
      const content = fs.readFileSync(envPath, "utf8");
      const match = content.match(/ANTHROPIC_API_KEY=(.*)/);
      if (match) apiKey = match[1].trim();
    } catch { /* ignore */ }
  }

  const anthropic = createAnthropic({
    apiKey: apiKey!,
    baseURL: "https://api.anthropic.com/v1",
  });

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
