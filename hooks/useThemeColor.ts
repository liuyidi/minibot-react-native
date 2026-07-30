/**
 * Resolve a themed color by name, with optional light/dark overrides.
 */

import { useAppearance } from "@/context/AppearanceContext";
import type { ThemePalette } from "@/lib/theme/types";

type ThemeColorName = keyof ThemePalette;

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: ThemeColorName
) {
  const { colorScheme, palette } = useAppearance();
  const colorFromProps = props[colorScheme];

  if (colorFromProps) {
    return colorFromProps;
  }

  return palette[colorName];
}
