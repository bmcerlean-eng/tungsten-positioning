import type { UIMessage } from "ai";

const MAX_MESSAGES = 50;

function storageKey(pillarId: string): string {
  return `tungsten-${pillarId}-chat`;
}

/**
 * Persist the current chat messages to localStorage.
 * Keeps the most recent MAX_MESSAGES to stay within quota.
 */
export function saveChatMessages(pillarId: string, messages: UIMessage[]): void {
  try {
    const trimmed = messages.slice(-MAX_MESSAGES);
    localStorage.setItem(storageKey(pillarId), JSON.stringify(trimmed));
  } catch {
    // localStorage unavailable (private browsing, quota exceeded) — silently skip
  }
}

/**
 * Load previously saved chat messages from localStorage.
 * Returns null if nothing is stored or data is corrupt.
 */
export function loadChatMessages(pillarId: string): UIMessage[] | null {
  try {
    const raw = localStorage.getItem(storageKey(pillarId));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return null;
    return parsed as UIMessage[];
  } catch {
    return null;
  }
}

/**
 * Clear any stored chat session for a specific pillar.
 */
export function clearChatMessages(pillarId: string): void {
  try {
    localStorage.removeItem(storageKey(pillarId));
  } catch {
    // ignore
  }
}
