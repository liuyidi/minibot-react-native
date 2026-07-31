import type { DeepSeekModelId } from "@/lib/chat/preferencesConfig";
import { en, zh } from "@/lib/i18n/messages";
import type { AppChatMessage } from "@/types/chat";

export type ChatSession = {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  model?: DeepSeekModelId;
  /** When set, session is backed by minibot (`id` === WS chat_id). */
  source?: "local" | "minibot";
  /** Full session key, e.g. `websocket:<id>`. */
  key?: string;
};

/** Persistence shape — avoids GiftedChat coupling. */
export type StoredChatMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  reasoningContent?: string;
  createdAt: number;
  status: "complete" | "streaming" | "error";
};

/** Default titles across locales — treat any as “untitled new chat”. */
export const DEFAULT_CHAT_TITLES = [zh.chat.newChat, en.chat.newChat] as const;

export function defaultChatTitle(language: "zh" | "en" = "zh"): string {
  return language === "en" ? en.chat.newChat : zh.chat.newChat;
}

export function isDefaultChatTitle(title: string | null | undefined): boolean {
  const trimmed = title?.trim();
  if (!trimmed) {
    return true;
  }
  return (DEFAULT_CHAT_TITLES as readonly string[]).includes(trimmed);
}

export function displayChatTitle(
  title: string | null | undefined,
  localizedNewChat: string
): string {
  return isDefaultChatTitle(title) ? localizedNewChat : (title?.trim() || localizedNewChat);
}

export function createSessionId(): string {
  return `s_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function titleFromUserText(
  text: string,
  fallbackTitle: string = zh.chat.newChat
): string {
  const trimmed = text.replace(/\s+/g, " ").trim();
  if (!trimmed) {
    return fallbackTitle;
  }
  return trimmed.length > 20 ? `${trimmed.slice(0, 20)}…` : trimmed;
}

export function toStoredMessages(messages: AppChatMessage[]): StoredChatMessage[] {
  return messages
    .filter((message) => !message.system)
    .map((message) => {
      const isUser = message.user?._id === 1;
      const createdAt =
        message.createdAt instanceof Date
          ? message.createdAt.getTime()
          : Number(message.createdAt) || Date.now();
      return {
        id: String(message._id),
        role: isUser ? "user" : "assistant",
        content: message.text ?? "",
        reasoningContent: message.reasoningContent,
        createdAt,
        status: message.isPending ? "streaming" : "complete",
      } satisfies StoredChatMessage;
    });
}

export function toAppMessages(
  stored: StoredChatMessage[],
  botUser: { _id: number | string; name: string; avatar?: string }
): AppChatMessage[] {
  // GiftedChat expects newest-first when inverted (default).
  const sorted = [...stored].sort((a, b) => b.createdAt - a.createdAt);
  return sorted.map((message) => ({
    _id: message.id,
    text: message.content,
    reasoningContent: message.reasoningContent,
    isPending: message.status === "streaming",
    createdAt: new Date(message.createdAt),
    user:
      message.role === "user"
        ? { _id: 1 }
        : { _id: botUser._id, name: botUser.name, avatar: botUser.avatar },
  }));
}
