import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  createSessionId,
  defaultChatTitle,
  type ChatSession,
  type StoredChatMessage,
} from "@/lib/chat/session/types";

const SESSIONS_KEY = "@chat/sessions";
const ACTIVE_SESSION_KEY = "@chat/activeSessionId";

function messagesKey(sessionId: string): string {
  return `@chat/messages:${sessionId}`;
}

function sortByUpdatedAtDesc(sessions: ChatSession[]): ChatSession[] {
  return [...sessions].sort((a, b) => b.updatedAt - a.updatedAt);
}

export async function listChatSessions(): Promise<ChatSession[]> {
  const raw = await AsyncStorage.getItem(SESSIONS_KEY);
  if (!raw) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw) as ChatSession[];
    if (!Array.isArray(parsed)) {
      return [];
    }
    return sortByUpdatedAtDesc(parsed);
  } catch {
    return [];
  }
}

async function writeSessions(sessions: ChatSession[]): Promise<void> {
  await AsyncStorage.setItem(
    SESSIONS_KEY,
    JSON.stringify(sortByUpdatedAtDesc(sessions))
  );
}

export async function getActiveSessionId(): Promise<string | null> {
  return AsyncStorage.getItem(ACTIVE_SESSION_KEY);
}

export async function setActiveSessionId(sessionId: string): Promise<void> {
  await AsyncStorage.setItem(ACTIVE_SESSION_KEY, sessionId);
}

export async function createChatSession(
  partial?: Partial<Pick<ChatSession, "title" | "model">>
): Promise<ChatSession> {
  const now = Date.now();
  const session: ChatSession = {
    id: createSessionId(),
    title: partial?.title?.trim() || defaultChatTitle("zh"),
    createdAt: now,
    updatedAt: now,
    model: partial?.model,
  };
  const sessions = await listChatSessions();
  await writeSessions([session, ...sessions]);
  await setActiveSessionId(session.id);
  await AsyncStorage.setItem(messagesKey(session.id), JSON.stringify([]));
  return session;
}

export async function updateChatSession(
  sessionId: string,
  patch: Partial<Pick<ChatSession, "title" | "updatedAt" | "model">>
): Promise<ChatSession | null> {
  const sessions = await listChatSessions();
  const index = sessions.findIndex((session) => session.id === sessionId);
  if (index < 0) {
    return null;
  }
  const next: ChatSession = {
    ...sessions[index],
    ...patch,
    updatedAt: patch.updatedAt ?? Date.now(),
  };
  sessions[index] = next;
  await writeSessions(sessions);
  return next;
}

export async function deleteChatSession(sessionId: string): Promise<void> {
  const sessions = (await listChatSessions()).filter(
    (session) => session.id !== sessionId
  );
  await writeSessions(sessions);
  await AsyncStorage.removeItem(messagesKey(sessionId));
  const activeId = await getActiveSessionId();
  if (activeId === sessionId) {
    if (sessions[0]) {
      await setActiveSessionId(sessions[0].id);
    } else {
      await AsyncStorage.removeItem(ACTIVE_SESSION_KEY);
    }
  }
}

export async function loadSessionMessages(
  sessionId: string
): Promise<StoredChatMessage[]> {
  const raw = await AsyncStorage.getItem(messagesKey(sessionId));
  if (!raw) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw) as StoredChatMessage[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function saveSessionMessages(
  sessionId: string,
  messages: StoredChatMessage[]
): Promise<void> {
  await AsyncStorage.setItem(messagesKey(sessionId), JSON.stringify(messages));
  await updateChatSession(sessionId, { updatedAt: Date.now() });
}

/** Ensure at least one session exists; return active session + full list. */
export async function ensureChatSessions(): Promise<{
  sessions: ChatSession[];
  activeSession: ChatSession;
}> {
  let sessions = await listChatSessions();
  let activeId = await getActiveSessionId();
  let activeSession = sessions.find((session) => session.id === activeId);

  if (!activeSession) {
    if (sessions[0]) {
      activeSession = sessions[0];
      await setActiveSessionId(activeSession.id);
    } else {
      activeSession = await createChatSession();
      sessions = [activeSession];
    }
  }

  sessions = await listChatSessions();
  return { sessions, activeSession };
}
