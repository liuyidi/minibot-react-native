import {
  Text as RNText,
  StyleSheet,
  type StyleProp,
  type TextProps as RNTextProps,
  type TextStyle,
} from "react-native";

import { useResolvedTheme } from "../theme/ThemeProvider";
import type { UiTheme } from "../theme/types";

export type TextVariant = "body" | "title" | "subtitle" | "caption" | "label";

export type TextProps = RNTextProps & {
  variant?: TextVariant;
  theme?: Partial<UiTheme>;
  style?: StyleProp<TextStyle>;
};

export function Text({
  variant = "body",
  theme: themeOverride,
  style,
  children,
  ...rest
}: TextProps) {
  const palette = useResolvedTheme(themeOverride);
  const color =
    variant === "caption" || variant === "label"
      ? palette.textSecondary
      : variant === "title" || variant === "subtitle"
        ? palette.heading
        : palette.text;

  return (
    <RNText style={[styles[variant], { color }, style]} {...rest}>
      {children}
    </RNText>
  );
}

const styles = StyleSheet.create({
  body: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "400",
  },
  title: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "600",
  },
  caption: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "400",
  },
  label: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "500",
  },
});
