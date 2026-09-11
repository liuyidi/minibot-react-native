import {
  View,
  Text,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { useResolvedTheme } from "../../../theme/ThemeProvider";
import type { UiTheme } from "../../../theme/types";

export type BadgeProps = {
  children?: React.ReactNode;
  count?: number;
  theme?: Partial<UiTheme>;
  style?: StyleProp<ViewStyle>;
};

export function Badge({ children, count, theme: themeOverride, style }: BadgeProps) {
  const palette = useResolvedTheme(themeOverride);
  const label =
    count !== undefined ? (count > 99 ? "99+" : String(count)) : children;

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: palette.surface,
          borderColor: palette.border,
        },
        style,
      ]}
    >
      {typeof label === "string" || typeof label === "number" ? (
        <Text style={[styles.text, { color: palette.text }]}>{label}</Text>
      ) : (
        label
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    minWidth: 22,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 12,
    fontWeight: "600",
    lineHeight: 16,
  },
});
