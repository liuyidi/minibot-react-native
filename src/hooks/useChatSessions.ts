import { useCallback, useEffect, useState } from "react";

import {
  createChatSession,
  deleteChatSession,
  ensureChatSessions,
  listChatSessions,
  setActiveSessionId,
  updateChatSession,
} from "@/lib/chat/session/storage";
import type { ChatSession } from "@/lib/chat/session/types";
import { defaultChatTitle } from "@/lib/chat/session/types";
import type { DeepSeekModelId } from "@/lib/chat/preferencesConfig";
import { useLanguage } from "@/context/LanguageContext";

export function useChatSessions() {
  const { language } = useLanguage();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionIdState] = useState<string | null>(
    null
  );
  const [isReady, setIsReady] = useState(false);

  const refresh = useCallback(async () => {
    const { sessions: nextSessions, activeSession } = await ensureChatSessions();
    setSessions(nextSessions);
    setActiveSessionIdState(activeSession.id);
    return activeSession;
  }, []);

  useEffect(() => {
    void refresh().finally(() => setIsReady(true));
  }, [refresh]);

  const activeSession =
    sessions.find((session) => session.id === activeSessionId) ?? null;

  const selectSession = useCallback(async (sessionId: string) => {
    await setActiveSessionId(sessionId);
    setActiveSessionIdState(sessionId);
    setSessions(await listChatSessions());
  }, []);

  const createSession = useCallback(
    async (model?: DeepSeekModelId) => {
      const session = await createChatSession({
        model,
        title: defaultChatTitle(language),
      });
      setSessions(await listChatSessions());
      setActiveSessionIdState(session.id);
      return session;
    },
    [language]
  );

  const renameSession = useCallback(
    async (sessionId: string, title: string) => {
      await updateChatSession(sessionId, { title });
      setSessions(await listChatSessions());
    },
    []
  );

  const removeSession = useCallback(async (sessionId: string) => {
    await deleteChatSession(sessionId);
    const next = await ensureChatSessions();
    setSessions(next.sessions);
    setActiveSessionIdState(next.activeSession.id);
    return next.activeSession;
  }, []);

  const touchSession = useCallback(
    async (
      sessionId: string,
      patch?: Partial<Pick<ChatSession, "title" | "model">>
    ) => {
      await updateChatSession(sessionId, {
        ...patch,
        updatedAt: Date.now(),
      });
      setSessions(await listChatSessions());
    },
    []
  );

  return {
    sessions,
    activeSession,
    activeSessionId,
    isReady,
    refresh,
    selectSession,
    createSession,
    renameSession,
    removeSession,
    touchSession,
  };
}
