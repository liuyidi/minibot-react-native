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
import { useControllableState } from "../../../utils/useControllableState";

export type CheckboxProps = {
  /** Controlled checked state. */
  checked?: boolean;
  /** Uncontrolled initial checked. @default false */
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  theme?: Partial<UiTheme>;
  style?: StyleProp<ViewStyle>;
};

export function Checkbox({
  checked: checkedProp,
  defaultChecked = false,
  onChange,
  label,
  disabled,
  theme: themeOverride,
  style,
}: CheckboxProps) {
  const palette = useResolvedTheme(themeOverride);
  const [checked, setChecked] = useControllableState(
    checkedProp,
    defaultChecked,
    onChange,
  );

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
      disabled={disabled}
      onPress={() => setChecked(!checked)}
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
