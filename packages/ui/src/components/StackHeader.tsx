import type { ReactNode } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { useResolvedTheme } from "../theme/ThemeProvider";
import type { UiTheme } from "../theme/types";

export type StackHeaderProps = {
  title: string;
  onBack?: () => void;
  /** Defaults to a simple "‹" chevron when onBack is set. */
  backLabel?: string;
  trailing?: ReactNode;
  theme?: Partial<UiTheme>;
  style?: StyleProp<ViewStyle>;
};

export function StackHeader({
  title,
  onBack,
  backLabel = "‹",
  trailing,
  theme: themeOverride,
  style,
}: StackHeaderProps) {
  const palette = useResolvedTheme(themeOverride);

  return (
    <View
      style={[
        styles.row,
        { borderBottomColor: palette.border, backgroundColor: palette.card },
        style,
      ]}
    >
      <View style={styles.side}>
        {onBack ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Back"
            onPress={onBack}
            hitSlop={8}
            style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}
          >
            <Text style={[styles.backLabel, { color: palette.primary }]}>
              {backLabel}
            </Text>
          </Pressable>
        ) : null}
      </View>
      <Text
        numberOfLines={1}
        style={[styles.title, { color: palette.heading }]}
      >
        {title}
      </Text>
      <View style={[styles.side, styles.trailing]}>{trailing}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  side: {
    width: 64,
    justifyContent: "center",
  },
  trailing: {
    alignItems: "flex-end",
  },
  backBtn: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  backLabel: {
    fontSize: 28,
    lineHeight: 32,
    fontWeight: "300",
  },
  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 17,
    fontWeight: "600",
  },
  pressed: {
    opacity: 0.7,
  },
});
