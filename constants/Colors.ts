/**
 * Legacy static Colors — defaults to Codex.
 * Prefer `useAppTheme()` so UI packs (Codex / Claude) apply correctly.
 */

import { codexTheme } from "@/lib/theme/presets/codex";
import type { AppColorScheme, ThemePalette } from "@/lib/theme/types";

export type { AppColorScheme, ThemePalette as ThemeColors };

/** @deprecated Prefer useAppTheme(); kept for non-hook call sites. */
export const Colors = {
  light: codexTheme.light,
  dark: codexTheme.dark,
  primary: codexTheme.light.primary,
  muted: codexTheme.light.muted,
  gray: codexTheme.light.gray,
  lightGray: codexTheme.light.lightGray,
  green: codexTheme.light.green,
  lightGreen: codexTheme.light.lightGreen,
  red: codexTheme.light.red,
  yellow: codexTheme.light.yellow,
} as const;
