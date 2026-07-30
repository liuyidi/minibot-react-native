import { useAppearance } from "@/context/AppearanceContext";
import type { ThemePalette } from "@/lib/theme/types";

/** Active UI pack palette for the resolved light/dark scheme. */
export function useAppTheme(): ThemePalette {
  return useAppearance().palette;
}
