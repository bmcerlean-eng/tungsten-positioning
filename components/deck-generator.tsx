"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Presentation,
  FileText,
  Loader2,
  Download,
  FileDown,
} from "lucide-react";

const AUDIENCES = [
  "CIO",
  "VP Operations",
  "IT Director",
  "Line of Business",
  "Partner",
] as const;

const SLIDE_COUNTS = [4, 6, 8, 10] as const;

type GeneratingState = null | "pptx" | "docx";

export default function DeckGenerator() {
  const [topic, setTopic] = useState("");
  const [audience, setAudience] = useState<string>(AUDIENCES[0]);
  const [slideCount, setSlideCount] = useState<number>(SLIDE_COUNTS[1]);
  const [generating, setGenerating] = useState<GeneratingState>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate(format: "pptx" | "docx") {
    if (!topic.trim()) return;

    setGenerating(format);
    setError(null);

    try {
      const res = await fetch("/api/generate-deck", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          audience,
          slideCount,
          format,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || `Generation failed (${res.status})`);
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;

      const safeTopic = topic.replace(/[^a-zA-Z0-9]+/g, "_");
      a.download =
        format === "pptx"
          ? `${safeTopic}_deck.pptx`
          : `${safeTopic}_positioning.docx`;

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setGenerating(null);
    }
  }

  async function handleGenerateBoth() {
    // Generate PPTX first, then DOCX
    await handleGenerate("pptx");
    if (!error) {
      await handleGenerate("docx");
    }
  }

  const isGenerating = generating !== null;

  return (
    <div className="space-y-6">
      {/* Deck Generator Card */}
      <div className="bg-white border border-tungsten-border rounded-xl p-6 shadow-sm">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-tungsten-navy/5 flex items-center justify-center">
            <Presentation className="w-5 h-5 text-tungsten-navy" />
          </div>
          <div>
            <h2 className="text-tungsten-navy font-semibold text-lg">
              Content Generator
            </h2>
            <p className="text-xs text-gray-400">
              PowerPoint deck + positioning document
            </p>
          </div>
        </div>

        <div className="space-y-5">
          {/* Topic */}
          <div>
            <label
              htmlFor="deck-topic"
              className="block text-sm font-medium text-tungsten-dark mb-1.5"
            >
              Topic
            </label>
            <input
              id="deck-topic"
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. AI-Ready Data Strategy for Citibank"
              className={cn(
                "w-full rounded-lg border border-tungsten-border px-4 py-2.5 text-sm",
                "placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-tungsten-navy/20 focus:border-tungsten-navy",
                "transition-colors"
              )}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Audience */}
            <div>
              <label
                htmlFor="deck-audience"
                className="block text-sm font-medium text-tungsten-dark mb-1.5"
              >
                Audience
              </label>
              <select
                id="deck-audience"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className={cn(
                  "w-full rounded-lg border border-tungsten-border px-4 py-2.5 text-sm bg-white",
                  "focus:outline-none focus:ring-2 focus:ring-tungsten-navy/20 focus:border-tungsten-navy",
                  "transition-colors"
                )}
              >
                {AUDIENCES.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>

            {/* Slide Count */}
            <div>
              <label
                htmlFor="deck-slides"
                className="block text-sm font-medium text-tungsten-dark mb-1.5"
              >
                Slides
              </label>
              <select
                id="deck-slides"
                value={slideCount}
                onChange={(e) => setSlideCount(Number(e.target.value))}
                className={cn(
                  "w-full rounded-lg border border-tungsten-border px-4 py-2.5 text-sm bg-white",
                  "focus:outline-none focus:ring-2 focus:ring-tungsten-navy/20 focus:border-tungsten-navy",
                  "transition-colors"
                )}
              >
                {SLIDE_COUNTS.map((c) => (
                  <option key={c} value={c}>
                    {c} slides
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2">
              {error}
            </p>
          )}

          {/* Generate Both Button (primary) */}
          <button
            onClick={handleGenerateBoth}
            disabled={isGenerating || !topic.trim()}
            className={cn(
              "w-full flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition-all",
              "bg-tungsten-navy text-white hover:bg-tungsten-blue",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating {generating === "pptx" ? "deck" : "document"}...
              </>
            ) : (
              <>
                <FileDown className="w-4 h-4" />
                Generate Deck + Document
              </>
            )}
          </button>

          {/* Individual format buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleGenerate("pptx")}
              disabled={isGenerating || !topic.trim()}
              className={cn(
                "flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-all",
                "border border-tungsten-border text-tungsten-bluegray hover:border-tungsten-navy hover:text-tungsten-navy",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              <Download className="w-3.5 h-3.5" />
              .pptx only
            </button>
            <button
              onClick={() => handleGenerate("docx")}
              disabled={isGenerating || !topic.trim()}
              className={cn(
                "flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-all",
                "border border-tungsten-border text-tungsten-bluegray hover:border-tungsten-navy hover:text-tungsten-navy",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              <FileText className="w-3.5 h-3.5" />
              .docx only
            </button>
          </div>
        </div>
      </div>

      {/* Info note */}
      <div className="bg-tungsten-navy/5 rounded-xl p-4">
        <p className="text-xs text-tungsten-bluegray leading-relaxed">
          <span className="font-semibold text-tungsten-navy">
            PowerPoint deck
          </span>{" "}
          uses your Tungsten corporate template with full branding.{" "}
          <span className="font-semibold text-tungsten-navy">
            Positioning document
          </span>{" "}
          generates a comprehensive Word doc in the style of the Build vs Buy
          white paper — tailored to your specific account and scenario.
        </p>
      </div>
    </div>
  );
}
