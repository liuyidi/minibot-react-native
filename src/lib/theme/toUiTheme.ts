import type { ThemePalette } from "@/lib/theme/types";
import type { UiTheme } from "@minibot/ui";

/** Map app ThemePalette → kit UiTheme. */
export function toUiTheme(p: ThemePalette): UiTheme {
  return {
    text: p.text,
    textSecondary: p.textSecondary,
    heading: p.heading,
    background: p.background,
    card: p.card,
    border: p.border,
    primary: p.primary,
    onPrimary: p.onPrimary,
    muted: p.muted,
    red: p.red,
    focus: "#4f46e5",
    green: p.green,
    yellow: p.yellow,
    surface: p.lightGray,
  };
}
