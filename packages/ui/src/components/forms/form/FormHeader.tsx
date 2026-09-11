import type { ReactNode } from "react";
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";

import { useResolvedTheme } from "../../../theme/ThemeProvider";
import type { UiTheme } from "../../../theme/types";

export type FormHeaderProps = {
  children?: ReactNode;
  theme?: Partial<UiTheme>;
  style?: StyleProp<ViewStyle>;
};

/** Section title above a group of form items. */
export function FormHeader({
  children,
  theme: themeOverride,
  style,
}: FormHeaderProps) {
  const palette = useResolvedTheme(themeOverride);
  return (
    <View style={[styles.wrap, style]}>
      {typeof children === "string" || typeof children === "number" ? (
        <Text style={[styles.text, { color: palette.muted }]}>{children}</Text>
      ) : (
        children
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingTop: 16,
    paddingBottom: 8,
    paddingHorizontal: 4,
  },
  text: {
    fontSize: 13,
    lineHeight: 18,
  },
});
