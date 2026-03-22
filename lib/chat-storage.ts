import type { UIMessage } from "ai";

const STORAGE_KEY = "tungsten-dwa-chat";
const MAX_MESSAGES = 50;

/**
 * Persist the current chat messages to localStorage.
 * Keeps the most recent MAX_MESSAGES to stay within quota.
 */
export function saveChatMessages(messages: UIMessage[]): void {
  try {
    const trimmed = messages.slice(-MAX_MESSAGES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    // localStorage unavailable (private browsing, quota exceeded) — silently skip
  }
}

/**
 * Load previously saved chat messages from localStorage.
 * Returns null if nothing is stored or data is corrupt.
 */
export function loadChatMessages(): UIMessage[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return null;
    return parsed as UIMessage[];
  } catch {
    return null;
  }
}

/**
 * Clear any stored chat session.
 */
export function clearChatMessages(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
