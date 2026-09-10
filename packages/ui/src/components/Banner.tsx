import type { ReactNode } from "react";
import {
  View,
  Text,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { useResolvedTheme } from "../theme/ThemeProvider";
import type { UiTheme } from "../theme/types";

export type BannerVariant = "info" | "error" | "success";

export type BannerProps = {
  variant?: BannerVariant;
  children: ReactNode;
  theme?: Partial<UiTheme>;
  style?: StyleProp<ViewStyle>;
};

export function Banner({
  variant = "info",
  children,
  theme: themeOverride,
  style,
}: BannerProps) {
  const palette = useResolvedTheme(themeOverride);

  let bg = palette.surface;
  let border = palette.border;
  let fg = palette.text;

  switch (variant) {
    case "error":
      bg = palette.red + "18";
      border = palette.red;
      fg = palette.red;
      break;
    case "success":
      bg = palette.green + "18";
      border = palette.green;
      fg = palette.green;
      break;
    case "info":
    default:
      bg = palette.focus + "18";
      border = palette.focus;
      fg = palette.text;
      break;
  }

  return (
    <View
      style={[
        styles.banner,
        { backgroundColor: bg, borderColor: border },
        style,
      ]}
    >
      {typeof children === "string" ? (
        <Text style={[styles.text, { color: fg }]}>{children}</Text>
      ) : (
        children
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
  },
});
