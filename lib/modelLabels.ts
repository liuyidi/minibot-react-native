import { Zap, Gem, MessageCircle, Lightbulb, type LucideIcon } from "lucide-react-native";

import type { DeepSeekModelId } from "@/lib/chatPreferencesConfig";

export const MODEL_LABELS: Record<DeepSeekModelId, string> = {
  "deepseek-v4-flash": "V4 Flash",
  "deepseek-v4-pro": "V4 Pro",
  "deepseek-chat": "Chat",
  "deepseek-reasoner": "Reasoner",
};

export const MODEL_OPTIONS: {
  value: DeepSeekModelId;
  label: string;
  icon: LucideIcon;
}[] = [
  {
    value: "deepseek-v4-flash",
    label: "V4 Flash",
    icon: Zap,
  },
  {
    value: "deepseek-v4-pro",
    label: "V4 Pro",
    icon: Gem,
  },
  {
    value: "deepseek-chat",
    label: "Chat（兼容）",
    icon: MessageCircle,
  },
  {
    value: "deepseek-reasoner",
    label: "Reasoner（兼容）",
    icon: Lightbulb,
  },
];
