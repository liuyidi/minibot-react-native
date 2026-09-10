import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";

import type { UiTheme } from "./types";

const ThemeContext = createContext<UiTheme | null>(null);

export function ThemeProvider({
  theme,
  children,
}: {
  theme: UiTheme;
  children: ReactNode;
}) {
  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
}

export function useUiTheme(): UiTheme {
  const theme = useContext(ThemeContext);
  if (!theme) {
    throw new Error("useUiTheme must be used within ThemeProvider");
  }
  return theme;
}

export function useResolvedTheme(override?: Partial<UiTheme>): UiTheme {
  const base = useUiTheme();
  return useMemo(
    () => (override ? { ...base, ...override } : base),
    [base, override]
  );
}
