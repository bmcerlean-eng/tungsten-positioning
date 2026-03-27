"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState, useRef, useEffect, useMemo, memo } from "react";
import ReactMarkdown from "react-markdown";
import {
  Copy,
  Check,
  Sparkles,
  ArrowUp,
  Plus,
  Paperclip,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  saveChatMessages,
  loadChatMessages,
} from "@/lib/chat-storage";

interface ChatInterfaceProps {
  onContextChange?: (context: string) => void;
  pillarId: string;
  primaryPrompt: string;
  quickStarts: string[];
}

export default function ChatInterface({ onContextChange, pillarId, primaryPrompt, quickStarts }: ChatInterfaceProps) {
  // Restore any previously saved messages (runs once on mount)
  const initialMessages = useMemo(() => loadChatMessages(pillarId) ?? undefined, [pillarId]);

  const transport = useMemo(
    () => new DefaultChatTransport({
      api: "/api/chat",
      body: { pillar: pillarId },
    }),
    [pillarId]
  );

  const { messages, sendMessage, status } = useChat({
    transport,
    messages: initialMessages,
  });

  const [input, setInput] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [attachedFile, setAttachedFile] = useState<{ name: string; content: string } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isLoading = status === "submitted" || status === "streaming";

  /** Extract text content from a UIMessage's parts array */
  function getMessageText(
    parts: Array<{ type: string; text?: string }>
  ): string {
    return parts
      .filter((p) => p.type === "text" && p.text)
      .map((p) => p.text!)
      .join("");
  }

  // Notify parent when message count or last message content changes.
  // Depend on primitives (count + last id) not the array reference, which
  // changes every render and would cause an infinite loop.
  const messageCount = messages.length;
  const lastMessageId = messages[messageCount - 1]?.id ?? "";
  useEffect(() => {
    if (messageCount === 0) return;

    // Persist to localStorage so the user can resume later
    saveChatMessages(pillarId, messages);

    if (!onContextChange) return;
    const context = messages
      .map((m) => {
        const text = getMessageText(m.parts as Array<{ type: string; text?: string }>);
        return `${m.role === "user" ? "User" : "Assistant"}: ${text}`;
      })
      .join("\n\n");
    onContextChange(context);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messageCount, lastMessageId]);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 140)}px`;
  }, [input]);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Read file as text — works for .txt, .csv, .json, .md, .xml, etc.
      const text = await file.text();
      if (text.trim()) {
        setAttachedFile({ name: file.name, content: text.trim() });
      }
    } catch {
      // Binary file — just note the filename
      setAttachedFile({ name: file.name, content: `[Attached file: ${file.name}]` });
    }

    // Reset the input so the same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removeAttachment() {
    setAttachedFile(null);
  }

  function doSend(text: string) {
    if ((!text.trim() && !attachedFile) || isLoading) return;

    // If a file is attached, prepend its content to the message
    let fullText = text.trim();
    if (attachedFile) {
      const fileBlock = `--- Attached File: ${attachedFile.name} ---\n${attachedFile.content}\n--- End of File ---`;
      fullText = fullText
        ? `${fileBlock}\n\n${fullText}`
        : fileBlock;
      setAttachedFile(null);
    }

    sendMessage({ text: fullText });
    setInput("");
  }

  async function handleCopy(content: string, messageId: string) {
    await navigator.clipboard.writeText(content);
    setCopiedId(messageId);
    setTimeout(() => setCopiedId(null), 2000);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      doSend(input);
    }
  }

  const hasMessages = messages.length > 0;

  const canSend = (input.trim() || attachedFile) && !isLoading;

  const inputBar = (
    <div className={cn(hasMessages ? "px-4 pb-4 pt-2" : "px-4 pb-2")}>
      <div className={cn(hasMessages ? "max-w-[720px]" : "max-w-[640px]", "mx-auto")}>
        {/* Attachment badge */}
        {attachedFile && (
          <div className="flex items-center gap-2 mb-2 px-3 py-1.5 rounded-lg bg-tungsten-navy/5 border border-tungsten-navy/15 max-w-fit">
            <Paperclip className="w-3.5 h-3.5 text-tungsten-navy flex-shrink-0" />
            <span className="text-[12px] font-medium text-tungsten-navy truncate max-w-[280px]">
              {attachedFile.name}
            </span>
            <button
              onClick={removeAttachment}
              className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center hover:bg-tungsten-navy/10 transition-colors"
              aria-label="Remove attachment"
            >
              <X className="w-3 h-3 text-tungsten-navy" />
            </button>
          </div>
        )}

        <div className="relative flex items-end border border-[#D4D4D4] rounded-2xl bg-white shadow-sm focus-within:border-tungsten-navy/40 focus-within:shadow-md transition-all">
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            accept=".txt,.csv,.json,.md,.xml,.html,.doc,.docx,.rtf,.pdf,.pptx,.xlsx,.log,.yml,.yaml,.toml,.ini,.cfg"
            className="hidden"
          />

          {/* Plus button for file upload */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className={cn(
              "flex-shrink-0 ml-1.5 mb-1.5 w-8 h-8 rounded-lg flex items-center justify-center transition-all",
              !isLoading
                ? "text-[#888] hover:text-tungsten-navy hover:bg-[#F0F0F0] cursor-pointer"
                : "text-[#CCC] cursor-not-allowed"
            )}
            aria-label="Attach file"
            title="Attach a file (requirements, RFP, meeting notes, etc.)"
          >
            <Plus className="w-5 h-5" strokeWidth={2} />
          </button>

          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe the account, scenario, or question..."
            rows={1}
            className={cn(
              "flex-1 resize-none bg-transparent px-2 py-3 text-[14px] text-[#1a1a1a]",
              "placeholder:text-[#A0A0A0] focus:outline-none"
            )}
          />
          <button
            type="button"
            onClick={() => doSend(input)}
            disabled={!canSend}
            className={cn(
              "flex-shrink-0 m-1.5 w-8 h-8 rounded-lg flex items-center justify-center transition-all",
              canSend
                ? "bg-tungsten-navy text-white hover:bg-[#003A75] cursor-pointer"
                : "bg-[#E8E8E8] text-[#A0A0A0] cursor-not-allowed"
            )}
            aria-label="Send"
          >
            <ArrowUp className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>
        <p className="text-center text-[10px] text-[#B0B0B0] mt-2">
          Powered by Claude &middot; Content is AI-generated and should be reviewed
        </p>
      </div>
    </div>
  );

  if (!hasMessages) {
    return (
      <div className="flex flex-col h-full overflow-y-auto">
        <EmptyState primaryPrompt={primaryPrompt} quickStarts={quickStarts} onQuickStart={doSend} />
        {inputBar}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[720px] mx-auto px-4 py-6 space-y-6">
          {messages.map((message) => {
            const text = getMessageText(
              message.parts as Array<{ type: string; text?: string }>
            );
            // Only the last assistant message can be actively streaming
            const isStreaming = isLoading && message.id === lastMessageId && message.role === "assistant";

            if (message.role === "user") {
              return (
                <UserMessage key={message.id} text={text} />
              );
            }

            return (
              <AssistantMessage
                key={message.id}
                id={message.id}
                text={text}
                isStreaming={isStreaming}
                copiedId={copiedId}
                onCopy={handleCopy}
              />
            );
          })}

          {/* Typing indicator — only before first assistant token arrives */}
          {isLoading && messages[messages.length - 1]?.role === "user" && (
            <div className="flex items-center gap-2 py-1">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#999] animate-bounce [animation-delay:0ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#999] animate-bounce [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#999] animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input pinned to bottom when in chat mode */}
      {inputBar}
    </div>
  );
}

/* ---------- Memoized Message Components ---------- */

// User bubble — only re-renders if text changes
const UserMessage = memo(function UserMessage({ text }: { text: string }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[85%] bg-[#F0F0F0] text-[#1a1a1a] rounded-2xl rounded-br-sm px-4 py-3 text-[14px] leading-relaxed">
        <p className="whitespace-pre-wrap">{text}</p>
      </div>
    </div>
  );
});

// Assistant bubble — plain text while streaming, markdown when complete
const AssistantMessage = memo(function AssistantMessage({
  id,
  text,
  isStreaming,
  copiedId,
  onCopy,
}: {
  id: string;
  text: string;
  isStreaming: boolean;
  copiedId: string | null;
  onCopy: (text: string, id: string) => void;
}) {
  return (
    <div className="group">
      <div className="text-[14px] leading-[1.75] text-[#1a1a1a]">
        {isStreaming ? (
          // Plain text during streaming — avoids expensive markdown re-parsing on every token
          <p className="whitespace-pre-wrap">{text}</p>
        ) : (
          <div className="prose-chat">
            <ReactMarkdown>{text}</ReactMarkdown>
          </div>
        )}
      </div>
      {text && !isStreaming && (
        <div className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onCopy(text, id)}
            className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] text-[#999] hover:text-[#333] hover:bg-[#F0F0F0] transition-colors"
          >
            {copiedId === id ? (
              <><Check className="w-3 h-3 text-green-600" />Copied</>
            ) : (
              <><Copy className="w-3 h-3" />Copy</>
            )}
          </button>
        </div>
      )}
    </div>
  );
});

/* ---------- Empty State ---------- */

function EmptyState({ primaryPrompt, quickStarts, onQuickStart }: { primaryPrompt: string; quickStarts: string[]; onQuickStart: (prompt: string) => void }) {
  return (
    <div className="max-w-[640px] mx-auto flex flex-col items-center px-4 pt-4 pb-4">
      <div className="w-full space-y-6">
        {/* Heading */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F0F0F0] text-[11px] font-medium text-[#666]">
            <Sparkles className="w-3 h-3 text-tungsten-gold" />
            AI Positioning
          </div>
          <h1 className="text-[20px] font-semibold text-[#1a1a1a] leading-snug">
            {primaryPrompt}
          </h1>
        </div>

        {/* Quick start cards */}
        <div className="grid grid-cols-2 gap-2.5">
          {quickStarts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => onQuickStart(prompt)}
              className={cn(
                "text-left p-3.5 rounded-xl border border-[#E4E4E4] bg-white",
                "hover:border-[#C0C0C0] hover:shadow-sm",
                "transition-all text-[13px] text-[#555] leading-relaxed",
                "cursor-pointer"
              )}
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
