export type { AppColorScheme, ThemeDefinition, ThemeId, ThemePalette } from "@/lib/theme/types";
export {
  DEFAULT_THEME_ID,
  THEME_DEFINITIONS,
  THEME_IDS,
  getThemeDefinition,
  isThemeId,
  resolveThemePalette,
} from "@/lib/theme/registry";
export { getThemeId, setThemeId } from "@/lib/theme/config";
export { claudeTheme } from "@/lib/theme/presets/claude";
export { codexTheme } from "@/lib/theme/presets/codex";
