import type { ChatSession } from "@/lib/chat/session/types";

export type SessionDateGroup = {
  id: string;
  label: string;
  sessions: ChatSession[];
};

function startOfDay(ts: number): number {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function formatDateLabel(dayStart: number, language: "zh" | "en", now = Date.now()): string {
  const today = startOfDay(now);
  const yesterday = today - 24 * 60 * 60 * 1000;
  if (dayStart === today) {
    return language === "en" ? "Today" : "今天";
  }
  if (dayStart === yesterday) {
    return language === "en" ? "Yesterday" : "昨天";
  }
  const d = new Date(dayStart);
  if (language === "en") {
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}年${m}月${day}日`;
}

/**
 * Group sessions by local calendar day of `updatedAt`.
 * Caller should pass already-sorted sessions (pinned first, then updated desc).
 */
export function groupSessionsByDate(
  sessions: ChatSession[],
  language: "zh" | "en" = "zh",
  now = Date.now()
): SessionDateGroup[] {
  const buckets = new Map<number, ChatSession[]>();
  for (const session of sessions) {
    const day = startOfDay(session.updatedAt || session.createdAt || now);
    const list = buckets.get(day);
    if (list) {
      list.push(session);
    } else {
      buckets.set(day, [session]);
    }
  }
  return [...buckets.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([day, items]) => ({
      id: `day:${day}`,
      label: formatDateLabel(day, language, now),
      sessions: items,
    }));
}

export function sortSessionsForDrawer(
  sessions: ChatSession[],
  pinnedKeys: Set<string>
): { pinned: ChatSession[]; unpinned: ChatSession[] } {
  const keyOf = (s: ChatSession) => s.key || `websocket:${s.id}`;
  const pinned: ChatSession[] = [];
  const unpinned: ChatSession[] = [];
  for (const session of sessions) {
    if (pinnedKeys.has(keyOf(session))) {
      pinned.push(session);
    } else {
      unpinned.push(session);
    }
  }
  const byUpdated = (a: ChatSession, b: ChatSession) => b.updatedAt - a.updatedAt;
  pinned.sort(byUpdated);
  unpinned.sort(byUpdated);
  return { pinned, unpinned };
}
