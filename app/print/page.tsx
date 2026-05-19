"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { SquarePen } from "lucide-react";
import ChatInterface from "@/components/chat-interface";
import ContentGenerator from "@/components/content-generator";
import ChatHistoryMenu from "@/components/chat-history-menu";
import {
  getActiveChatId,
  setActiveChatId,
  newChatId,
} from "@/lib/chat-storage";
import { PRINT_PRIMARY_PROMPT, PRINT_QUICK_STARTS } from "@/lib/print-sample-prompts";

const PILLAR_ID = "print";

export default function PrintPage() {
  const [chatContext, setChatContext] = useState<string>("");
  const [chatId, setChatId] = useState<string | null>(null);

  useEffect(() => {
    // Bridge localStorage (external state) into React state on mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setChatId(getActiveChatId(PILLAR_ID) ?? (() => {
      const id = newChatId();
      setActiveChatId(PILLAR_ID, id);
      return id;
    })());
  }, []);

  const handleContextChange = useCallback((ctx: string) => setChatContext(ctx), []);

  function handleNewChat() {
    const id = newChatId();
    setActiveChatId(PILLAR_ID, id);
    setChatContext("");
    setChatId(id);
  }

  function handleSelectChat(id: string) {
    setActiveChatId(PILLAR_ID, id);
    setChatContext("");
    setChatId(id);
  }

  return (
    <div className="flex h-full bg-white">
      <div className="flex-1 min-w-0 flex flex-col">
        <div className="flex items-center gap-3 px-5 py-2.5 border-b border-[#E8E8E8] bg-white">
          <Image src="/icon-print.svg" alt="Print" width={26} height={26} />
          <div className="flex-1">
            <h1 className="text-[13px] font-semibold text-tungsten-navy leading-tight">
              Print Management &amp; Output
            </h1>
            <p className="text-[11px] text-[#8B8B8B]">AI Positioning Assistant</p>
          </div>
          {chatId && (
            <ChatHistoryMenu
              pillarId={PILLAR_ID}
              activeChatId={chatId}
              onSelect={handleSelectChat}
              onActiveDeleted={handleNewChat}
            />
          )}
          <button
            onClick={handleNewChat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium text-[#555] hover:text-tungsten-navy hover:bg-[#F0F0F0] transition-colors"
            title="Start a new chat"
          >
            <SquarePen className="w-3.5 h-3.5" />
            New Chat
          </button>
        </div>
        <div className="flex-1 min-h-0">
          {chatId && (
            <ChatInterface
              key={chatId}
              pillarId={PILLAR_ID}
              chatId={chatId}
              primaryPrompt={PRINT_PRIMARY_PROMPT}
              quickStarts={PRINT_QUICK_STARTS as unknown as string[]}
              onContextChange={handleContextChange}
            />
          )}
        </div>
      </div>
      <div className="w-[380px] flex-shrink-0 border-l border-[#E8E8E8] bg-[#FAFAF9] overflow-y-auto">
        <ContentGenerator chatContext={chatContext} />
      </div>
    </div>
  );
}
