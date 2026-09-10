import {
  Pressable,
  View,
  Text,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { useResolvedTheme } from "../theme/ThemeProvider";
import type { UiTheme } from "../theme/types";

export type CheckboxProps = {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  theme?: Partial<UiTheme>;
  style?: StyleProp<ViewStyle>;
};

export function Checkbox({
  checked,
  onChange,
  label,
  disabled,
  theme: themeOverride,
  style,
}: CheckboxProps) {
  const palette = useResolvedTheme(themeOverride);

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
      disabled={disabled}
      onPress={() => onChange?.(!checked)}
      style={({ pressed }) => [
        styles.row,
        { opacity: disabled ? 0.4 : pressed ? 0.8 : 1 },
        style,
      ]}
    >
      <View
        style={[
          styles.box,
          {
            borderColor: checked ? palette.primary : palette.border,
            backgroundColor: checked ? palette.primary : "transparent",
          },
        ]}
      >
        {checked ? (
          <Text style={[styles.check, { color: palette.onPrimary }]}>✓</Text>
        ) : null}
      </View>
      {label ? (
        <Text style={[styles.label, { color: palette.text }]}>{label}</Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  box: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  check: {
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 16,
  },
  label: {
    fontSize: 16,
  },
});
