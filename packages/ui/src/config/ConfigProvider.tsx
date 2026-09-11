import { useLayoutEffect, useMemo, type ReactNode } from "react";
import { RootSiblingParent } from "react-native-root-siblings";

import { setOverlayBridge } from "../overlay/bridge";
import { ThemeProvider } from "../theme/ThemeProvider";
import type { UiTheme } from "../theme/types";
import {
  ConfigContext,
  type ConfigContextValue,
} from "./context";
import {
  localeMessages,
  type UiLocale,
  type UiMode,
} from "./locale";

export type { ConfigContextValue } from "./context";
export {
  useConfig,
  useUiLocale,
  useUiMessages,
} from "./context";

export type ConfigProviderProps = {
  /** Final color palette (app owns theme registry / brand packs). */
  theme: UiTheme;
  /** Kit built-in copy. @default zh */
  locale?: UiLocale;
  /**
   * Light / dark mode hint for consumers (StatusBar, etc.).
   * Does not pick colors by itself — pass the matching `theme` palette.
   * @default light
   */
  mode?: UiMode;
  children?: ReactNode;
};

/**
 * Single root kit provider: theme + locale + RootSiblingParent for OverlayStack.
 * Toast / Dialog imperative APIs mount into the overlay host (no nested Toast/Dialog providers required).
 */
export function ConfigProvider({
  theme,
  locale = "zh",
  mode = "light",
  children,
}: ConfigProviderProps) {
  const value = useMemo<ConfigContextValue>(
    () => ({
      locale,
      mode,
      messages: localeMessages[locale],
    }),
    [locale, mode],
  );

  useLayoutEffect(() => {
    setOverlayBridge({
      theme,
      locale,
      mode,
      messages: localeMessages[locale],
    });
  }, [theme, locale, mode]);

  return (
    <RootSiblingParent>
      <ConfigContext.Provider value={value}>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </ConfigContext.Provider>
    </RootSiblingParent>
  );
}
