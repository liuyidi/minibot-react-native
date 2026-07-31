import { claudeTheme } from "@/lib/theme/presets/claude";
import { codexTheme } from "@/lib/theme/presets/codex";
import type { ThemeDefinition, ThemeId, ThemePalette } from "@/lib/theme/types";
import type { AppColorScheme } from "@/lib/theme/types";

export const THEME_DEFINITIONS: Record<ThemeId, ThemeDefinition> = {
  codex: codexTheme,
  claude: claudeTheme,
};

export const THEME_IDS: ThemeId[] = ["codex", "claude"];

export const DEFAULT_THEME_ID: ThemeId = "codex";

export function getThemeDefinition(id: ThemeId): ThemeDefinition {
  return THEME_DEFINITIONS[id] ?? THEME_DEFINITIONS[DEFAULT_THEME_ID];
}

export function resolveThemePalette(
  id: ThemeId,
  scheme: AppColorScheme
): ThemePalette {
  const def = getThemeDefinition(id);
  return scheme === "dark" ? def.dark : def.light;
}

export function isThemeId(value: string | null | undefined): value is ThemeId {
  return value === "codex" || value === "claude";
}
