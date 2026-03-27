"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { SquarePen } from "lucide-react";
import ChatInterface from "@/components/chat-interface";
import ContentGenerator from "@/components/content-generator";
import { clearChatMessages } from "@/lib/chat-storage";
import { APAR_PRIMARY_PROMPT, APAR_QUICK_STARTS } from "@/lib/apar-sample-prompts";

export default function APARPage() {
  const [chatContext, setChatContext] = useState<string>("");
  const [chatKey, setChatKey] = useState(0);

  const handleContextChange = useCallback((ctx: string) => setChatContext(ctx), []);

  function handleNewChat() {
    clearChatMessages("ap-ar");
    setChatContext("");
    setChatKey((k) => k + 1);
  }

  return (
    <div className="flex h-full bg-white">
      <div className="flex-1 min-w-0 flex flex-col">
        <div className="flex items-center gap-3 px-5 py-2.5 border-b border-[#E8E8E8] bg-white">
          <Image src="/icon-apar.svg" alt="AP & AR" width={26} height={26} />
          <div className="flex-1">
            <h1 className="text-[13px] font-semibold text-tungsten-navy leading-tight">
              Accounts Payable &amp; Accounts Receivable Automation
            </h1>
            <p className="text-[11px] text-[#8B8B8B]">AI Positioning Assistant</p>
          </div>
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
          <ChatInterface
            key={chatKey}
            pillarId="ap-ar"
            primaryPrompt={APAR_PRIMARY_PROMPT}
            quickStarts={APAR_QUICK_STARTS as unknown as string[]}
            onContextChange={handleContextChange}
          />
        </div>
      </div>
      <div className="w-[380px] flex-shrink-0 border-l border-[#E8E8E8] bg-[#FAFAF9] overflow-y-auto">
        <ContentGenerator chatContext={chatContext} />
      </div>
    </div>
  );
}
