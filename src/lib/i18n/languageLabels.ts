import { Languages, Globe, type LucideIcon } from "lucide-react-native";

import type { AppLanguage } from "@/lib/i18n/languageConfig";

export const LANGUAGE_LABELS: Record<AppLanguage, string> = {
  zh: "简体中文",
  en: "English",
};

export const LANGUAGE_OPTIONS: {
  value: AppLanguage;
  label: string;
  icon: LucideIcon;
}[] = [
  {
    value: "zh",
    label: "简体中文",
    icon: Languages,
  },
  {
    value: "en",
    label: "English",
    icon: Globe,
  },
];
