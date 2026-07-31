import type { MinibotClient } from "@minibot/client";
import { useCallback, useEffect, useRef, useState } from "react";

import type { ChatSession } from "@/lib/chat/session/types";
import { defaultChatTitle, titleFromUserText } from "@/lib/chat/session/types";
import { useLanguage } from "@/context/LanguageContext";
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

/**
 * Remote session list + thread load when minibot WS is open.
 * Local draft sessions are unused while this hook is active.
 */
export function useMinibotSessions({
  client,
  isConnected,
  enabled,
}: UseMinibotSessionsOptions) {
  const { language, t } = useLanguage();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const clientRef = useRef(client);
  clientRef.current = client;

  const refresh = useCallback(async () => {
    const c = clientRef.current;
    if (!c) {
      setSessions([]);
      setActiveSessionId(null);
      return [];
    }
    const list = await c.sessions.list();
    const next = list.map(sessionSummaryToChatSession);
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
    isReady,
    refresh,
    selectSession,
    createSession,
    touchSession,
    loadThread,
    ensureChatId,
    titleFromUserText,
  };
}
