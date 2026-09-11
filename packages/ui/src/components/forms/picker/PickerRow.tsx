import {
  Pressable,
  View,
  Text,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { useResolvedTheme } from "../../../theme/ThemeProvider";
import type { UiTheme } from "../../../theme/types";

export type PickerRowProps = {
  label: string;
  value?: string;
  placeholder?: string;
  onPress?: () => void;
  theme?: Partial<UiTheme>;
  style?: StyleProp<ViewStyle>;
};

export function PickerRow({
  label,
  value,
  placeholder = "Select…",
  onPress,
  theme: themeOverride,
  style,
}: PickerRowProps) {
  const palette = useResolvedTheme(themeOverride);
  const display = value?.trim() ? value : placeholder;
  const isPlaceholder = !value?.trim();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        {
          backgroundColor: palette.card,
          borderColor: palette.border,
          opacity: pressed ? 0.85 : 1,
        },
        style,
      ]}
    >
      <Text style={[styles.label, { color: palette.heading }]}>{label}</Text>
      <View style={styles.trailing}>
        <Text
          style={[
            styles.value,
            {
              color: isPlaceholder ? palette.muted : palette.text,
            },
          ]}
          numberOfLines={1}
        >
          {display}
        </Text>
        <Text style={[styles.chevron, { color: palette.textSecondary }]}>›</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 52,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
  },
  trailing: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexShrink: 1,
  },
  value: {
    fontSize: 15,
    maxWidth: 180,
  },
  chevron: {
    fontSize: 22,
    lineHeight: 24,
  },
});
