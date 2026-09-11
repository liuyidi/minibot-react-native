import {
  View,
  Text,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
  type TextStyle,
} from "react-native";

import { useResolvedTheme } from "../../../theme/ThemeProvider";
import type { UiTheme } from "../../../theme/types";

export type TagVariant = "default" | "primary" | "success" | "warning" | "danger";

export type TagProps = {
  label: string;
  /** @default default */
  variant?: TagVariant;
  /** Filled soft background vs outline. @default soft */
  fill?: "soft" | "solid" | "outline";
  theme?: Partial<UiTheme>;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

/**
 * Status / category mark (distinct from selectable Chip and count Badge).
 */
export function Tag({
  label,
  variant = "default",
  fill = "soft",
  theme: themeOverride,
  style,
  textStyle,
}: TagProps) {
  const palette = useResolvedTheme(themeOverride);

  const accent =
    variant === "primary"
      ? palette.primary
      : variant === "success"
        ? palette.green
        : variant === "warning"
          ? palette.yellow
          : variant === "danger"
            ? palette.red
            : palette.textSecondary;

  let bg = "transparent";
  let fg = accent;
  let border = "transparent";

  if (fill === "solid") {
    bg = accent;
    fg = variant === "default" ? palette.text : "#ffffff";
    if (variant === "default") {
      bg = palette.surface;
      fg = palette.text;
    }
  } else if (fill === "outline") {
    border = accent;
    fg = accent;
  } else {
    // soft
    bg =
      variant === "danger"
        ? "rgba(180,35,24,0.12)"
        : variant === "success"
          ? "rgba(2,122,72,0.12)"
          : variant === "warning"
            ? "rgba(181,71,8,0.12)"
            : variant === "primary"
              ? "rgba(8,8,8,0.08)"
              : palette.surface;
    fg = accent;
  }

  return (
    <View
      style={[
        styles.tag,
        { backgroundColor: bg, borderColor: border },
        fill === "outline" ? styles.outlined : null,
        style,
      ]}
    >
      <Text style={[styles.label, { color: fg }, textStyle]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    alignSelf: "flex-start",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  outlined: {
    borderWidth: StyleSheet.hairlineWidth,
  },
  label: {
    fontSize: 11,
    fontWeight: "500",
    lineHeight: 16,
  },
});
