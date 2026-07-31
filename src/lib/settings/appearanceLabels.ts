import { Smartphone, Sun, Moon, type LucideIcon } from "lucide-react-native";

import type { AppearanceMode } from "@/lib/settings/appearanceConfig";

export const APPEARANCE_LABELS: Record<AppearanceMode, string> = {
  system: "系统",
  light: "浅色",
  dark: "深色",
};

export const APPEARANCE_OPTIONS: {
  value: AppearanceMode;
  label: string;
  description: string;
  icon: LucideIcon;
}[] = [
  {
    value: "system",
    label: "系统",
    description: "跟随系统深浅色设置",
    icon: Smartphone,
  },
  {
    value: "light",
    label: "浅色",
    description: "始终使用浅色界面",
    icon: Sun,
  },
  {
    value: "dark",
    label: "深色",
    description: "始终使用深色界面",
    icon: Moon,
  },
];
