"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import {
  FileDown,
  FileText,
  Presentation,
  MessageSquare,
  CheckCircle2,
  Download,
  AlertCircle,
} from "lucide-react";

const AUDIENCES = [
  "CIO",
  "VP Operations",
  "IT Director",
  "Line of Business",
  "Partner",
] as const;

const SLIDE_COUNTS = [4, 6, 8, 10] as const;

const DECK_FORMATS = [
  { value: "l0", label: "L0 Corporate Deck", desc: "Inserts into the Tungsten L0 corporate narrative" },
  { value: "sbr", label: "Strategic Business Review", desc: "Inserts into the SBR template" },
  { value: "slides", label: "Slides Only", desc: "Standalone slides using corporate template" },
] as const;

type DeckFormat = typeof DECK_FORMATS[number]["value"];
type Format = "both" | "pptx" | "docx";

interface GeneratedFile {
  format: "pptx" | "docx";
  blob: Blob;
  filename: string;
}

interface ProgressState {
  pptx: number;   // 0–100
  docx: number;
}

interface ActiveState {
  pptx: boolean;
  docx: boolean;
}

function phaseLabel(p: number): string {
  if (p >= 100) return "Complete ✓";
  if (p >= 88)  return "Finalising…";
  if (p >= 65)  return "Building file…";
  return "Generating AI content…";
}

interface ContentGeneratorProps {
  chatContext: string;
}

export default function ContentGenerator({ chatContext }: ContentGeneratorProps) {
  const [topic, setTopic]       = useState("");
  const [audience, setAudience] = useState<string>(AUDIENCES[0]);
  const [slideCount, setSlideCount] = useState<number>(SLIDE_COUNTS[1]);
  const [deckFormat, setDeckFormat] = useState<DeckFormat>("l0");
  const [error, setError]       = useState<string | null>(null);
  const [generatedFiles, setGeneratedFiles] = useState<GeneratedFile[]>([]);

  const [progress, setProgress] = useState<ProgressState>({ pptx: 0, docx: 0 });
  const [active, setActive]     = useState<ActiveState>({ pptx: false, docx: false });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const hasContext   = chatContext.length > 0;
  const isGenerating = active.pptx || active.docx;

  // Linear time-based progress — steady pace matched to realistic generation times.
  // PPTX ~45s, DOCX ~60s.  Bar fills to 92% over that time, then crawls to 96%.
  const expectedDuration = useRef<{ pptx: number; docx: number }>({ pptx: 45000, docx: 60000 });
  const startTime = useRef<{ pptx: number; docx: number }>({ pptx: 0, docx: 0 });

  useEffect(() => {
    if (!isGenerating) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }
    intervalRef.current = setInterval(() => {
      const now = Date.now();
      setProgress((prev) => {
        const next = { ...prev };
        for (const fmt of ["pptx", "docx"] as const) {
          if (!active[fmt] || prev[fmt] >= 100) continue;
          const elapsed = now - startTime.current[fmt];
          const dur = expectedDuration.current[fmt];
          // 0-92% over the expected duration (linear), then crawl 92-96% slowly
          if (elapsed < dur) {
            next[fmt] = (elapsed / dur) * 92;
          } else {
            // Slow crawl beyond expected time: +0.5% per second, capped at 96%
            const overtime = elapsed - dur;
            next[fmt] = Math.min(96, 92 + (overtime / 1000) * 0.5);
          }
        }
        return next;
      });
    }, 500);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isGenerating, active.pptx, active.docx]);

  function triggerDownload(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a   = document.createElement("a");
    a.href     = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  }

  const generateFile = useCallback(
    async (format: "pptx" | "docx", effectiveTopic: string) => {
      startTime.current = { ...startTime.current, [format]: Date.now() };
      setActive((prev) => ({ ...prev, [format]: true }));
      setProgress((prev) => ({ ...prev, [format]: 0 }));

      try {
        const res = await fetch("/api/generate-deck", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            topic: effectiveTopic,
            audience,
            slideCount,
            format,
            deckFormat,
            chatContext: hasContext ? chatContext : undefined,
          }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => null);
          throw new Error(data?.error || `Generation failed (${res.status})`);
        }

        const blob = await res.blob();
        const safeTopic = effectiveTopic.replace(/[^a-zA-Z0-9]+/g, "_").slice(0, 40);
        const filename  = format === "pptx"
          ? `${safeTopic}_deck.pptx`
          : `${safeTopic}_positioning.docx`;

        triggerDownload(blob, filename);

        // Snap to 100% and store for re-download
        setProgress((prev) => ({ ...prev, [format]: 100 }));
        setGeneratedFiles((prev) => [
          ...prev.filter((f) => f.format !== format),
          { format, blob, filename },
        ]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setProgress((prev) => ({ ...prev, [format]: 0 }));
      } finally {
        setActive((prev) => ({ ...prev, [format]: false }));
      }
    },
    [audience, slideCount, deckFormat, hasContext, chatContext]
  );

  async function handleGenerate(format: Format) {
    const effectiveTopic = topic.trim() || (hasContext ? "Based on chat discussion" : "");
    if (!effectiveTopic && !hasContext) return;

    setError(null);
    setGeneratedFiles([]);

    if (format === "both") {
      // Fire both concurrently — they race independently
      await Promise.all([
        generateFile("pptx", effectiveTopic),
        generateFile("docx", effectiveTopic),
      ]);
    } else {
      await generateFile(format, effectiveTopic);
    }
  }

  const canGenerate = (topic.trim() || hasContext) && !isGenerating;
  const showReadyPulse = hasContext && !isGenerating && generatedFiles.length === 0;

  const pptxFile = generatedFiles.find((f) => f.format === "pptx");
  const docxFile = generatedFiles.find((f) => f.format === "docx");

  return (
    <div className="p-5 space-y-3">
      {/* Header */}
      <div>
        <h2 className="text-[15px] font-semibold text-[#1a1a1a]">Content Generator</h2>
        <p className="text-[12px] text-[#888] mt-0.5">
          {hasContext
            ? "Uses your chat conversation as context"
            : "Chat first, or go straight to generation"}
        </p>
      </div>

      {/* Chat context indicator */}
      {hasContext && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-tungsten-navy/5 border border-tungsten-navy/10">
          <MessageSquare className="w-3.5 h-3.5 text-tungsten-navy flex-shrink-0" />
          <p className="text-[11px] font-medium text-tungsten-navy">
            Chat context active — conversation will inform output
          </p>
        </div>
      )}

      {/* Form fields */}
      <div className="space-y-3">
        <div>
          <label className="block text-[12px] font-medium text-[#555] mb-1">
            Topic {hasContext && <span className="text-[#aaa] font-normal">(optional with chat)</span>}
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder={hasContext ? "Auto-derived from chat..." : "e.g. AI-Ready Data for Citibank"}
            className={cn(
              "w-full rounded-lg border border-[#DDD] px-3 py-2 text-[13px]",
              "placeholder:text-[#BBB] focus:outline-none focus:border-tungsten-navy/40 transition-colors"
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[12px] font-medium text-[#555] mb-1">Audience</label>
            <select
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className="w-full rounded-lg border border-[#DDD] px-3 py-2 text-[13px] bg-white focus:outline-none focus:border-tungsten-navy/40 transition-colors"
            >
              {AUDIENCES.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[12px] font-medium text-[#555] mb-1">Slides</label>
            <select
              value={slideCount}
              onChange={(e) => setSlideCount(Number(e.target.value))}
              className="w-full rounded-lg border border-[#DDD] px-3 py-2 text-[13px] bg-white focus:outline-none focus:border-tungsten-navy/40 transition-colors"
            >
              {SLIDE_COUNTS.map((c) => <option key={c} value={c}>{c} slides</option>)}
            </select>
          </div>
        </div>

        {/* Deck format selector */}
        <div>
          <label className="block text-[12px] font-medium text-[#555] mb-1.5">Deck Format</label>
          <div className="space-y-1.5">
            {DECK_FORMATS.map((df) => (
              <label
                key={df.value}
                className={cn(
                  "flex items-start gap-2.5 px-3 py-2 rounded-lg border cursor-pointer transition-all",
                  deckFormat === df.value
                    ? "border-tungsten-navy bg-tungsten-navy/5"
                    : "border-[#E0E0E0] hover:border-[#BBB]"
                )}
              >
                <input
                  type="radio"
                  name="deckFormat"
                  value={df.value}
                  checked={deckFormat === df.value}
                  onChange={() => setDeckFormat(df.value)}
                  className="mt-0.5 accent-tungsten-navy"
                />
                <div>
                  <p className={cn(
                    "text-[12px] font-semibold",
                    deckFormat === df.value ? "text-tungsten-navy" : "text-[#444]"
                  )}>{df.label}</p>
                  <p className="text-[10px] text-[#888] mt-0.5">{df.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-2 px-3 py-2 rounded-lg bg-red-50 border border-red-200">
            <AlertCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-[12px] text-red-700">{error}</p>
          </div>
        )}

        {/* ---- Progress bars (shown while generating) ---- */}
        {isGenerating ? (
          <div className="space-y-3 py-1">
            <ProgressBar
              label="PowerPoint Deck (.pptx)"
              icon={<Presentation className="w-3.5 h-3.5" />}
              value={progress.pptx}
              active={active.pptx}
            />
            <ProgressBar
              label="Word Document (.docx)"
              icon={<FileText className="w-3.5 h-3.5" />}
              value={progress.docx}
              active={active.docx}
            />
          </div>
        ) : (
          <>
            {/* Generate Both — primary button */}
            <div className={cn("relative rounded-xl", showReadyPulse && "animate-pulse-ring")}>
              <button
                onClick={() => handleGenerate("both")}
                disabled={!canGenerate}
                className={cn(
                  "w-full flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-semibold transition-all border",
                  canGenerate
                    ? "bg-tungsten-navy border-tungsten-navy text-white hover:bg-[#003A75]"
                    : "bg-white border-[#CCC] text-[#AAA] cursor-not-allowed"
                )}
              >
                <FileDown className="w-4 h-4" />
                Generate Both (.pptx + .docx)
              </button>
            </div>

            {/* Individual format buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleGenerate("pptx")}
                disabled={!canGenerate}
                className={cn(
                  "flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-[12px] font-medium transition-all",
                  "border border-[#DDD] hover:border-[#AAA]",
                  canGenerate ? "text-[#555] hover:text-tungsten-navy" : "text-[#BBB] cursor-not-allowed"
                )}
              >
                {pptxFile ? <CheckCircle2 className="w-3.5 h-3.5 text-green-600" /> : <Presentation className="w-3.5 h-3.5" />}
                .pptx only
              </button>
              <button
                onClick={() => handleGenerate("docx")}
                disabled={!canGenerate}
                className={cn(
                  "flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-[12px] font-medium transition-all",
                  "border border-[#DDD] hover:border-[#AAA]",
                  canGenerate ? "text-[#555] hover:text-tungsten-navy" : "text-[#BBB] cursor-not-allowed"
                )}
              >
                {docxFile ? <CheckCircle2 className="w-3.5 h-3.5 text-green-600" /> : <FileText className="w-3.5 h-3.5" />}
                .docx only
              </button>
            </div>
          </>
        )}
      </div>

      {/* Generated files status */}
      {(pptxFile || docxFile) && !isGenerating && (
        <div className="border-t border-[#E8E8E8] pt-3 space-y-2">
          <p className="text-[11px] font-semibold text-[#555] uppercase tracking-wide">
            Generated Files
          </p>
          {pptxFile && (
            <FileCard file={pptxFile} label="PowerPoint deck ready" onDownload={() => triggerDownload(pptxFile.blob, pptxFile.filename)} />
          )}
          {docxFile && (
            <FileCard file={docxFile} label="Word document ready" onDownload={() => triggerDownload(docxFile.blob, docxFile.filename)} />
          )}
        </div>
      )}
    </div>
  );
}

/* ---- Sub-components ---- */

function ProgressBar({
  label,
  icon,
  value,
  active,
}: {
  label: string;
  icon: React.ReactNode;
  value: number;
  active: boolean;
}) {
  const pct = Math.min(100, Math.round(value));
  const done = pct >= 100;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[12px] font-medium text-[#444]">
          {done
            ? <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
            : <span className={cn("text-tungsten-navy", active && "animate-pulse")}>{icon}</span>
          }
          {label}
        </div>
        <span className={cn("text-[11px] font-semibold tabular-nums", done ? "text-green-600" : "text-tungsten-navy")}>
          {pct}%
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-[#E8E8E8] overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            done ? "bg-green-500" : "bg-tungsten-navy"
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className={cn("text-[10px]", done ? "text-green-600 font-medium" : "text-[#999]")}>
        {active || done ? phaseLabel(value) : "Queued…"}
      </p>
    </div>
  );
}

function FileCard({
  file,
  label,
  onDownload,
}: {
  file: GeneratedFile;
  label: string;
  onDownload: () => void;
}) {
  return (
    <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-green-50 border border-green-200">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
        <div>
          <p className="text-[12px] font-medium text-green-800">{label}</p>
          <p className="text-[10px] text-green-600">{file.filename}</p>
        </div>
      </div>
      <button
        onClick={onDownload}
        className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium text-green-700 hover:bg-green-100 transition-colors"
      >
        <Download className="w-3 h-3" />
        Save
      </button>
    </div>
  );
}
