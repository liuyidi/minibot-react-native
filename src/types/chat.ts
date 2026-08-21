import type { IMessage } from "react-native-gifted-chat";

import type { ToolProgressLine } from "@/lib/minibot/wsTurn";

export type AppChatMessage = IMessage & {
  reasoningContent?: string;
  toolLines?: ToolProgressLine[];
  isPending?: boolean;
};
