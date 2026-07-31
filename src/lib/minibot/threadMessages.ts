import type { SessionSummary, ThreadMessage } from "@minibot/client";

import type { ChatSession } from "@/lib/chat/session/types";
import { defaultChatTitle } from "@/lib/chat/session/types";
import type { AppChatMessage } from "@/types/chat";

const BOT_USER = {
  _id: 2,
  name: "Minibot",
};

export { BOT_USER };

export function sessionSummaryToChatSession(summary: SessionSummary): ChatSession {
  const createdAt = summary.created_at
    ? Date.parse(summary.created_at) || Date.now()
    : Date.now();
  const updatedAt = summary.updated_at
    ? Date.parse(summary.updated_at) || createdAt
    : createdAt;
  return {
    id: summary.id,
    title: summary.title?.trim() || defaultChatTitle("zh"),
    createdAt,
    updatedAt,
    source: "minibot",
    key: summary.key,
  };
}

/** Map webui-thread messages → GiftedChat (newest-first). */
export function threadMessagesToApp(
  messages: ThreadMessage[],
  botUser: { _id: number | string; name: string; avatar?: string } = BOT_USER
): AppChatMessage[] {
  const mapped: AppChatMessage[] = [];
  for (const message of messages) {
    const role = message.role;
    if (role === "tool") {
      continue;
    }
    const content =
      typeof message.content === "string" ? message.content : String(message.content ?? "");
    const createdAt =
      typeof message.createdAt === "number" && Number.isFinite(message.createdAt)
        ? new Date(message.createdAt)
        : new Date();
    if (role === "user") {
      mapped.push({
        _id: message.id || `u_${mapped.length}`,
        text: content,
        createdAt,
        user: { _id: 1 },
      });
      continue;
    }
    if (role === "system") {
      mapped.push({
        _id: message.id || `sys_${mapped.length}`,
        system: true,
        text: content,
        createdAt,
        user: { _id: 0, name: "System" },
      });
      continue;
    }
    // assistant (and unknown → treat as assistant)
    mapped.push({
      _id: message.id || `a_${mapped.length}`,
      text: content,
      reasoningContent:
        typeof message.reasoning === "string" && message.reasoning
          ? message.reasoning
          : undefined,
      createdAt,
      user: {
        _id: botUser._id,
        name: botUser.name,
        avatar: botUser.avatar,
      },
    });
  }
  return mapped.sort((a, b) => {
    const ta =
      a.createdAt instanceof Date ? a.createdAt.getTime() : Number(a.createdAt) || 0;
    const tb =
      b.createdAt instanceof Date ? b.createdAt.getTime() : Number(b.createdAt) || 0;
    return tb - ta;
  });
}
