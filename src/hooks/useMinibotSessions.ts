import type { MinibotClient } from "@minibot/client";
import { useCallback, useEffect, useRef, useState } from "react";

import type { ChatSession } from "@/lib/chat/session/types";
import { defaultChatTitle, titleFromUserText } from "@/lib/chat/session/types";
import { useLanguage } from "@/context/LanguageContext";
import {
  EMPTY_SIDEBAR_STATE,
  fetchSidebarState,
  sessionKeyOf,
  updateSidebarState,
  type SidebarStatePayload,
} from "@/lib/minibot/sidebarState";
import {
  sessionSummaryToChatSession,
  threadMessagesToApp,
} from "@/lib/minibot/threadMessages";
import type { AppChatMessage } from "@/types/chat";

type UseMinibotSessionsOptions = {
  client: MinibotClient | null;
  isConnected: boolean;
  enabled: boolean;
};

function applySidebarTitles(
  sessions: ChatSession[],
  overrides: Record<string, string>
): ChatSession[] {
  return sessions.map((session) => {
    const key = session.key || sessionKeyOf(session.id);
    const override = overrides[key]?.trim();
    if (!override) return session;
    return { ...session, title: override };
  });
}

/**
 * Remote session list + thread load when minibot WS is open.
 * Pin / rename metadata via webui sidebar-state (same as desktop WebUI).
 */
export function useMinibotSessions({
  client,
  isConnected,
  enabled,
}: UseMinibotSessionsOptions) {
  const { language, t } = useLanguage();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [pinnedKeys, setPinnedKeys] = useState<string[]>([]);
  const [sidebarState, setSidebarState] =
    useState<SidebarStatePayload>(EMPTY_SIDEBAR_STATE);
  const [isReady, setIsReady] = useState(false);
  const clientRef = useRef(client);
  clientRef.current = client;
  const sidebarRef = useRef(sidebarState);
  sidebarRef.current = sidebarState;

  const refresh = useCallback(async () => {
    const c = clientRef.current;
    if (!c) {
      setSessions([]);
      setActiveSessionId(null);
      setPinnedKeys([]);
      return [];
    }

    let nextSidebar = sidebarRef.current;
    try {
      if (c.token) {
        nextSidebar = await fetchSidebarState(c.baseUrl, c.token);
        setSidebarState(nextSidebar);
        setPinnedKeys(nextSidebar.pinned_keys);
      }
    } catch {
      // Keep last known sidebar metadata if fetch fails.
    }

    const list = await c.sessions.list();
    const next = applySidebarTitles(
      list.map(sessionSummaryToChatSession),
      nextSidebar.title_overrides
    );
    setSessions(next);
    setActiveSessionId((prev) => {
      if (prev && next.some((s) => s.id === prev)) {
        return prev;
      }
      return next[0]?.id ?? null;
    });
    return next;
  }, []);

  useEffect(() => {
    if (!enabled || !isConnected || !client) {
      setIsReady(false);
      return;
    }
    let cancelled = false;
    setIsReady(false);
    void refresh()
      .catch(() => {
        if (!cancelled) {
          setSessions([]);
          setActiveSessionId(null);
        }
      })
      .finally(() => {
        if (!cancelled) setIsReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, [enabled, isConnected, client, refresh]);

  const activeSession =
    sessions.find((session) => session.id === activeSessionId) ?? null;

  const selectSession = useCallback(async (sessionId: string) => {
    setActiveSessionId(sessionId);
  }, []);

  const createSession = useCallback(async () => {
    const c = clientRef.current;
    if (!c) {
      throw new Error(t("chat.minibotOffline"));
    }
    const chatId = await c.ws.newChat();
    const now = Date.now();
    const session: ChatSession = {
      id: chatId,
      title: defaultChatTitle(language),
      createdAt: now,
      updatedAt: now,
      source: "minibot",
      key: `websocket:${chatId}`,
    };
    setSessions((prev) => [session, ...prev.filter((s) => s.id !== chatId)]);
    setActiveSessionId(chatId);
    return session;
  }, [language, t]);

  const persistSidebar = useCallback(async (next: SidebarStatePayload) => {
    const c = clientRef.current;
    if (!c?.token) {
      setSidebarState(next);
      setPinnedKeys(next.pinned_keys);
      return next;
    }
    const saved = await updateSidebarState(c.baseUrl, c.token, next);
    setSidebarState(saved);
    setPinnedKeys(saved.pinned_keys);
    return saved;
  }, []);

  const togglePin = useCallback(
    async (session: ChatSession) => {
      const key = session.key || sessionKeyOf(session.id);
      const current = sidebarRef.current;
      const pinned = new Set(current.pinned_keys);
      if (pinned.has(key)) {
        pinned.delete(key);
      } else {
        pinned.add(key);
      }
      await persistSidebar({
        ...current,
        pinned_keys: Array.from(pinned),
      });
    },
    [persistSidebar]
  );

  const renameSession = useCallback(
    async (session: ChatSession, title: string) => {
      const key = session.key || sessionKeyOf(session.id);
      const cleaned = title.trim();
      const current = sidebarRef.current;
      const titleOverrides = { ...current.title_overrides };
      if (cleaned) {
        titleOverrides[key] = cleaned;
      } else {
        delete titleOverrides[key];
      }
      await persistSidebar({
        ...current,
        title_overrides: titleOverrides,
      });
      setSessions((prev) =>
        prev.map((item) =>
          item.id === session.id
            ? { ...item, title: cleaned || item.title, updatedAt: Date.now() }
            : item
        )
      );
    },
    [persistSidebar]
  );

  const removeSession = useCallback(async (session: ChatSession) => {
    const c = clientRef.current;
    if (!c) return;
    const key = session.key || sessionKeyOf(session.id);
    await c.sessions.delete(key);
    const current = sidebarRef.current;
    const pinned_keys = current.pinned_keys.filter((item) => item !== key);
    const title_overrides = { ...current.title_overrides };
    delete title_overrides[key];
    try {
      await persistSidebar({
        ...current,
        pinned_keys,
        title_overrides,
      });
    } catch {
      setPinnedKeys(pinned_keys);
    }
    setSessions((prev) => {
      const next = prev.filter((item) => item.id !== session.id);
      setActiveSessionId((active) => {
        if (active !== session.id) return active;
        return next[0]?.id ?? null;
      });
      return next;
    });
  }, [persistSidebar]);

  const touchSession = useCallback(
    (sessionId: string, patch?: Partial<Pick<ChatSession, "title">>) => {
      setSessions((prev) =>
        prev
          .map((session) =>
            session.id === sessionId
              ? {
                  ...session,
                  ...patch,
                  title:
                    patch?.title?.trim() ||
                    session.title ||
                    defaultChatTitle(language),
                  updatedAt: Date.now(),
                }
              : session
          )
          .sort((a, b) => b.updatedAt - a.updatedAt)
      );
    },
    [language]
  );

  const loadThread = useCallback(async (sessionId: string): Promise<AppChatMessage[]> => {
    const c = clientRef.current;
    if (!c) return [];
    const thread = await c.sessions.getThread(sessionId);
    if (!thread?.messages?.length) {
      return [];
    }
    return threadMessagesToApp(thread.messages);
  }, []);

  const ensureChatId = useCallback(async (): Promise<string> => {
    if (activeSessionId) {
      return activeSessionId;
    }
    const session = await createSession();
    return session.id;
  }, [activeSessionId, createSession]);

  return {
    sessions,
    activeSession,
    activeSessionId,
    pinnedKeys,
    isReady,
    refresh,
    selectSession,
    createSession,
    touchSession,
    togglePin,
    renameSession,
    removeSession,
    loadThread,
    ensureChatId,
    titleFromUserText,
  };
}
