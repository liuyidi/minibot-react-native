import AsyncStorage from "@react-native-async-storage/async-storage";
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
import { useLanguage } from "@/context/LanguageContext";
import { sessionKeyOf } from "@/lib/minibot/sidebarState";

const LOCAL_PINNED_KEY = "local_session_pinned_keys";

async function loadLocalPinnedKeys(): Promise<string[]> {
  const raw = await AsyncStorage.getItem(LOCAL_PINNED_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

async function saveLocalPinnedKeys(keys: string[]): Promise<void> {
  await AsyncStorage.setItem(LOCAL_PINNED_KEY, JSON.stringify(keys));
}

export function useChatSessions() {
  const { language } = useLanguage();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionIdState] = useState<string | null>(
    null
  );
  const [pinnedKeys, setPinnedKeys] = useState<string[]>([]);
  const [isReady, setIsReady] = useState(false);

  const refresh = useCallback(async () => {
    const [{ sessions: nextSessions, activeSession }, pins] = await Promise.all([
      ensureChatSessions(),
      loadLocalPinnedKeys(),
    ]);
    setSessions(nextSessions);
    setActiveSessionIdState(activeSession.id);
    setPinnedKeys(pins);
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

  const createSession = useCallback(async () => {
    const session = await createChatSession({
      title: defaultChatTitle(language),
    });
    setSessions(await listChatSessions());
    setActiveSessionIdState(session.id);
    return session;
  }, [language]);

  const renameSession = useCallback(
    async (sessionId: string, title: string) => {
      await updateChatSession(sessionId, { title });
      setSessions(await listChatSessions());
    },
    []
  );

  const removeSession = useCallback(async (sessionId: string) => {
    await deleteChatSession(sessionId);
    const key = sessionKeyOf(sessionId);
    const pins = (await loadLocalPinnedKeys()).filter((item) => item !== key);
    await saveLocalPinnedKeys(pins);
    setPinnedKeys(pins);
    const next = await ensureChatSessions();
    setSessions(next.sessions);
    setActiveSessionIdState(next.activeSession.id);
    return next.activeSession;
  }, []);

  const togglePin = useCallback(async (session: ChatSession) => {
    const key = session.key || sessionKeyOf(session.id);
    const pins = new Set(await loadLocalPinnedKeys());
    if (pins.has(key)) {
      pins.delete(key);
    } else {
      pins.add(key);
    }
    const next = Array.from(pins);
    await saveLocalPinnedKeys(next);
    setPinnedKeys(next);
  }, []);

  const touchSession = useCallback(
    async (sessionId: string, patch?: Partial<Pick<ChatSession, "title">>) => {
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
    pinnedKeys,
    isReady,
    refresh,
    selectSession,
    createSession,
    renameSession,
    removeSession,
    togglePin,
    touchSession,
  };
}
