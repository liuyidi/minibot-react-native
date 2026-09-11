import type { ReactNode } from "react";
import { View, Text, StyleSheet, type StyleProp, type ViewStyle } from "react-native";

import { useResolvedTheme } from "../../../theme/ThemeProvider";
import type { UiTheme } from "../../../theme/types";

export type ListGroupProps = {
  title?: string;
  children: ReactNode;
  /**
   * Rounded card section (Vant CellGroup `inset`).
   * When false, children render without the card chrome.
   * @default true
   */
  inset?: boolean;
  theme?: Partial<UiTheme>;
  style?: StyleProp<ViewStyle>;
};

export function ListGroup({
  title,
  children,
  inset = true,
  theme: themeOverride,
  style,
}: ListGroupProps) {
  const palette = useResolvedTheme(themeOverride);

  return (
    <View style={[styles.wrap, style]}>
      {title ? (
        <Text style={[styles.title, { color: palette.textSecondary }]}>
          {title}
        </Text>
      ) : null}
      {inset ? (
        <View
          style={[
            styles.card,
            {
              backgroundColor: palette.card,
              borderColor: palette.border,
            },
          ]}
        >
          {children}
        </View>
      ) : (
        children
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 8,
  },
  title: {
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.4,
    paddingHorizontal: 4,
  },
  card: {
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
});
