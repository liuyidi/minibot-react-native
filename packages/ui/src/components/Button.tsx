import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { useResolvedTheme } from "../theme/ThemeProvider";
import type { UiTheme } from "../theme/types";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive";

export type ButtonProps = Omit<PressableProps, "children" | "style"> & {
  label: string;
  variant?: ButtonVariant;
  /** Partial theme override (escape hatch). */
  theme?: Partial<UiTheme>;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Button({
  label,
  variant = "primary",
  theme: themeOverride,
  loading = false,
  disabled,
  style,
  ...rest
}: ButtonProps) {
  const palette = useResolvedTheme(themeOverride);

  let bg: string = "transparent";
  let fg: string = palette.text;
  let borderColor: string = "transparent";

  switch (variant) {
    case "primary":
      bg = palette.primary;
      fg = palette.onPrimary;
      borderColor = palette.primary;
      break;
    case "secondary":
      bg = palette.surface;
      fg = palette.text;
      borderColor = palette.border;
      break;
    case "ghost":
      bg = "transparent";
      fg = palette.text;
      borderColor = "transparent";
      break;
    case "destructive":
      bg = palette.red;
      fg = "#ffffff";
      borderColor = palette.red;
      break;
  }

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: bg,
          borderColor,
          opacity: disabled || loading ? 0.5 : pressed ? 0.88 : 1,
        },
        style,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <Text style={[styles.label, { color: fg }]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
  },
});
