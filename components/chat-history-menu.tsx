"use client";

import { useEffect, useRef, useState } from "react";
import { History, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  listChats,
  deleteChat as deleteStoredChat,
  type ChatSummary,
} from "@/lib/chat-storage";

interface ChatHistoryMenuProps {
  pillarId: string;
  activeChatId: string;
  onSelect: (chatId: string) => void;
  onActiveDeleted: () => void;
}

export default function ChatHistoryMenu({
  pillarId,
  activeChatId,
  onSelect,
  onActiveDeleted,
}: ChatHistoryMenuProps) {
  const [open, setOpen] = useState(false);
  const [chats, setChats] = useState<ChatSummary[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  function handleToggle() {
    if (!open) setChats(listChats(pillarId));
    setOpen((o) => !o);
  }

  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function handleSelect(id: string) {
    onSelect(id);
    setOpen(false);
  }

  function handleDelete(e: React.MouseEvent, id: string) {
    e.stopPropagation();
    deleteStoredChat(pillarId, id);
    const next = listChats(pillarId);
    setChats(next);
    if (id === activeChatId) onActiveDeleted();
  }

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        type="button"
        onClick={handleToggle}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium text-[#555] hover:text-tungsten-navy hover:bg-[#F0F0F0] transition-colors cursor-pointer"
        title="View chat history"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <History className="w-3.5 h-3.5" />
        History
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-1 w-72 max-h-80 overflow-y-auto rounded-lg border border-[#E4E4E4] bg-white shadow-lg z-20"
        >
          {chats.length === 0 ? (
            <div className="px-3 py-4 text-[12px] text-[#999] text-center">
              No previous chats
            </div>
          ) : (
            <ul className="py-1">
              {chats.map((chat) => {
                const isActive = chat.id === activeChatId;
                return (
                  <li key={chat.id}>
                    <div
                      role="menuitem"
                      tabIndex={0}
                      onClick={() => handleSelect(chat.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleSelect(chat.id);
                        }
                      }}
                      className={cn(
                        "w-full text-left px-3 py-2 flex items-start gap-2 group cursor-pointer",
                        isActive ? "bg-[#F0F0F0]" : "hover:bg-[#F7F7F7]",
                      )}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-[12.5px] text-[#1a1a1a] truncate font-medium">
                          {chat.title}
                        </p>
                        <p className="text-[11px] text-[#888]">
                          {formatRelative(chat.updatedAt)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleDelete(e, chat.id)}
                        className="opacity-0 group-hover:opacity-100 flex-shrink-0 w-6 h-6 rounded flex items-center justify-center text-[#999] hover:text-red-600 hover:bg-white transition-all cursor-pointer"
                        aria-label="Delete chat"
                        title="Delete chat"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function formatRelative(ts: number): string {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60_000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(ts).toLocaleDateString();
}
