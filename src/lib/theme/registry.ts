import { brandTheme } from "@/lib/theme/presets/brand";
import { claudeTheme } from "@/lib/theme/presets/claude";
import { codexTheme } from "@/lib/theme/presets/codex";
import type { ThemeDefinition, ThemeId, ThemePalette } from "@/lib/theme/types";
import type { AppColorScheme } from "@/lib/theme/types";

export const THEME_DEFINITIONS: Record<ThemeId, ThemeDefinition> = {
  brand: brandTheme,
  codex: codexTheme,
  claude: claudeTheme,
};

export const THEME_IDS: ThemeId[] = ["brand", "codex", "claude"];

export const DEFAULT_THEME_ID: ThemeId = "brand";

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
  return value === "brand" || value === "codex" || value === "claude";
}
