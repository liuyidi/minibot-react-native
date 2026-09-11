import type { LucideIcon, LucideProps } from "lucide-react-native";
import type { StyleProp, ViewStyle } from "react-native";

import { useResolvedTheme } from "../../../theme/ThemeProvider";
import type { UiTheme } from "../../../theme/types";

/** Semantic colors resolved from UiTheme. */
export type IconColorToken =
  | "text"
  | "textSecondary"
  | "heading"
  | "primary"
  | "onPrimary"
  | "muted"
  | "red"
  | "green"
  | "yellow"
  | "focus"
  | "border"
  | "surface";

export type IconProps = {
  /** Lucide icon component, e.g. `Home` from `lucide-react-native`. */
  icon: LucideIcon;
  /** @default 24 */
  size?: number;
  /**
   * Theme token name or any CSS/RN color string.
   * @default text
   */
  color?: IconColorToken | (string & {});
  /** @default 2 */
  strokeWidth?: number;
  theme?: Partial<UiTheme>;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
};

function resolveColor(
  color: IconColorToken | (string & {}) | undefined,
  palette: UiTheme,
): string {
  const token = color ?? "text";
  if (token in palette) {
    const resolved = palette[token as keyof UiTheme];
    if (typeof resolved === "string" && resolved.length > 0) {
      return resolved;
    }
  }
  // Unknown / unresolved token — fall back to theme text (avoid Lucide "not a valid color").
  if (typeof token === "string" && token.startsWith("#")) return token;
  return palette.text ?? "#111827";
}

/**
 * Icon primitive — thin wrapper around lucide-react-native with theme colors.
 *
 * @example
 * import { Home } from "lucide-react-native";
 * <Icon icon={Home} size={20} color="primary" />
 */
export function Icon({
  icon: Glyph,
  size = 24,
  color,
  strokeWidth = 2,
  theme: themeOverride,
  style,
  accessibilityLabel,
}: IconProps) {
  const palette = useResolvedTheme(themeOverride);
  const resolved = resolveColor(color, palette);

  return (
    <Glyph
      size={size}
      color={resolved}
      strokeWidth={strokeWidth}
      style={style as LucideProps["style"]}
      accessibilityLabel={accessibilityLabel}
    />
  );
}

export type { LucideIcon, LucideProps };
