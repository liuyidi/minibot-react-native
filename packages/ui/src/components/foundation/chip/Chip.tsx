import type { ReactNode } from "react";
import {
  Pressable,
  Text,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { useResolvedTheme } from "../../../theme/ThemeProvider";
import type { UiTheme } from "../../../theme/types";

export type ChipProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  leading?: ReactNode;
  theme?: Partial<UiTheme>;
  style?: StyleProp<ViewStyle>;
};

export function Chip({
  label,
  selected = false,
  onPress,
  leading,
  theme: themeOverride,
  style,
}: ChipProps) {
  const palette = useResolvedTheme(themeOverride);

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: selected ? palette.primary : palette.surface,
          borderColor: selected ? palette.primary : palette.border,
          opacity: pressed ? 0.85 : 1,
        },
        style,
      ]}
    >
      {leading}
      <Text
        style={[
          styles.label,
          { color: selected ? palette.onPrimary : palette.text },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
  },
});
