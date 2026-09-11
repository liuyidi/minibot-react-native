import { createContext, useContext } from "react";

import {
  localeMessages,
  type UiLocale,
  type UiLocaleMessages,
  type UiMode,
} from "./locale";

export type ConfigContextValue = {
  locale: UiLocale;
  mode: UiMode;
  messages: UiLocaleMessages;
};

export const ConfigContext = createContext<ConfigContextValue | null>(null);

const fallbackConfig: ConfigContextValue = {
  locale: "zh",
  mode: "light",
  messages: localeMessages.zh,
};

/** Prefer ConfigProvider; falls back to zh/light when only ThemeProvider is used. */
export function useConfig(): ConfigContextValue {
  return useContext(ConfigContext) ?? fallbackConfig;
}

export function useUiLocale(): UiLocale {
  return useConfig().locale;
}

export function useUiMessages(): UiLocaleMessages {
  return useConfig().messages;
}
