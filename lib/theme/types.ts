/** Shared theme palette shape for Minibot UI packs (Codex / Claude / …). */

export type AppColorScheme = "light" | "dark";

export type ThemePalette = {
  text: string;
  heading: string;
  textSecondary: string;
  background: string;
  card: string;
  border: string;
  tint: string;
  icon: string;
  tabIconDefault: string;
  tabIconSelected: string;
  link: string;
  userBubble: string;
  userBubbleText: string;
  assistantBubble: string;
  composerBorder: string;
  /** Brand accent (buttons, tabs, links). */
  primary: string;
  /** Text / icon on primary filled controls. */
  onPrimary: string;
  muted: string;
  gray: string;
  lightGray: string;
  green: string;
  lightGreen: string;
  red: string;
  yellow: string;
};

export type ThemeId = "codex" | "claude";

export type ThemeDefinition = {
  id: ThemeId;
  name: string;
  description: string;
  /** Preview swatches: [accent, surface, ink] */
  swatches: readonly [string, string, string];
  light: ThemePalette;
  dark: ThemePalette;
};
