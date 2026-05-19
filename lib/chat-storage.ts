import type { UIMessage } from "ai";

const MAX_MESSAGES_PER_CHAT = 50;
const MAX_CHATS_PER_PILLAR = 20;

export interface ChatSummary {
  id: string;
  title: string;
  updatedAt: number;
}

interface StoredChat extends ChatSummary {
  messages: UIMessage[];
}

function chatsKey(pillarId: string): string {
  return `tungsten-${pillarId}-chats`;
}

function activeKey(pillarId: string): string {
  return `tungsten-${pillarId}-active`;
}

function legacyKey(pillarId: string): string {
  return `tungsten-${pillarId}-chat`;
}

function deriveTitle(messages: UIMessage[]): string {
  const firstUser = messages.find((m) => m.role === "user");
  if (!firstUser) return "New chat";
  const text = (firstUser.parts as Array<{ type: string; text?: string }>)
    .filter((p) => p.type === "text" && p.text)
    .map((p) => p.text!)
    .join(" ")
    .trim();
  if (!text) return "New chat";
  return text.length > 60 ? `${text.slice(0, 57)}...` : text;
}

export function newChatId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function readChats(pillarId: string): StoredChat[] {
  try {
    const raw = localStorage.getItem(chatsKey(pillarId));
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed as StoredChat[];
    }
    // One-time migration from the old single-chat key.
    const legacyRaw = localStorage.getItem(legacyKey(pillarId));
    if (legacyRaw) {
      const legacyMessages = JSON.parse(legacyRaw);
      if (Array.isArray(legacyMessages) && legacyMessages.length > 0) {
        const migrated: StoredChat = {
          id: newChatId(),
          title: deriveTitle(legacyMessages as UIMessage[]),
          updatedAt: Date.now(),
          messages: legacyMessages as UIMessage[],
        };
        localStorage.setItem(chatsKey(pillarId), JSON.stringify([migrated]));
        localStorage.setItem(activeKey(pillarId), migrated.id);
        localStorage.removeItem(legacyKey(pillarId));
        return [migrated];
      }
    }
    return [];
  } catch {
    return [];
  }
}

function writeChats(pillarId: string, chats: StoredChat[]): void {
  try {
    const trimmed = chats
      .slice()
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(0, MAX_CHATS_PER_PILLAR);
    localStorage.setItem(chatsKey(pillarId), JSON.stringify(trimmed));
  } catch {
    // localStorage unavailable or quota exceeded — silently skip
  }
}

export function listChats(pillarId: string): ChatSummary[] {
  return readChats(pillarId)
    .map(({ id, title, updatedAt }) => ({ id, title, updatedAt }))
    .sort((a, b) => b.updatedAt - a.updatedAt);
}

export function loadChat(pillarId: string, chatId: string): UIMessage[] | null {
  const found = readChats(pillarId).find((c) => c.id === chatId);
  if (!found || found.messages.length === 0) return null;
  return found.messages;
}

export function saveChat(
  pillarId: string,
  chatId: string,
  messages: UIMessage[],
): void {
  if (messages.length === 0) return;
  const chats = readChats(pillarId);
  const trimmedMessages = messages.slice(-MAX_MESSAGES_PER_CHAT);
  const existing = chats.find((c) => c.id === chatId);
  const updated: StoredChat = {
    id: chatId,
    // Lock in the title from the first user message; don't re-derive it later.
    title: existing && existing.title !== "New chat"
      ? existing.title
      : deriveTitle(trimmedMessages),
    updatedAt: Date.now(),
    messages: trimmedMessages,
  };
  const next = chats.filter((c) => c.id !== chatId);
  next.push(updated);
  writeChats(pillarId, next);
}

export function deleteChat(pillarId: string, chatId: string): void {
  try {
    const remaining = readChats(pillarId).filter((c) => c.id !== chatId);
    writeChats(pillarId, remaining);
    if (getActiveChatId(pillarId) === chatId) {
      localStorage.removeItem(activeKey(pillarId));
    }
  } catch {
    // ignore
  }
}

export function getActiveChatId(pillarId: string): string | null {
  try {
    return localStorage.getItem(activeKey(pillarId));
  } catch {
    return null;
  }
}

export function setActiveChatId(pillarId: string, chatId: string): void {
  try {
    localStorage.setItem(activeKey(pillarId), chatId);
  } catch {
    // ignore
  }
}
