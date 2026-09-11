import {
  createContext,
  useContext,
  type ReactNode,
} from "react";
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

type RadioGroupContextValue = {
  value: string;
  onChange: (value: string) => void;
  theme?: Partial<UiTheme>;
};

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export type RadioGroupProps = {
  /** Controlled selected value. */
  value?: string;
  /** Uncontrolled initial value. */
  defaultValue?: string;
  onChange?: (value: string) => void;
  children: ReactNode;
  theme?: Partial<UiTheme>;
  style?: StyleProp<ViewStyle>;
};

export function RadioGroup({
  value: valueProp,
  defaultValue = "",
  onChange,
  children,
  theme,
  style,
}: RadioGroupProps) {
  const [value, setValue] = useControllableState(
    valueProp,
    defaultValue,
    onChange,
  );

  return (
    <RadioGroupContext.Provider value={{ value, onChange: setValue, theme }}>
      <View style={[styles.group, style]}>{children}</View>
    </RadioGroupContext.Provider>
  );
}

export type RadioProps = {
  value: string;
  label?: string;
  disabled?: boolean;
  theme?: Partial<UiTheme>;
  style?: StyleProp<ViewStyle>;
};

export function Radio({
  value,
  label,
  disabled,
  theme: themeOverride,
  style,
}: RadioProps) {
  const group = useContext(RadioGroupContext);
  const palette = useResolvedTheme(themeOverride ?? group?.theme);
  const selected = group?.value === value;

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected, disabled }}
      disabled={disabled}
      onPress={() => group?.onChange(value)}
      style={({ pressed }) => [
        styles.row,
        { opacity: disabled ? 0.4 : pressed ? 0.8 : 1 },
        style,
      ]}
    >
      <View
        style={[
          styles.outer,
          {
            borderColor: selected ? palette.primary : palette.border,
          },
        ]}
      >
        {selected ? (
          <View style={[styles.inner, { backgroundColor: palette.primary }]} />
        ) : null}
      </View>
      {label ? (
        <Text style={[styles.label, { color: palette.text }]}>{label}</Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  group: {
    gap: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  outer: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  inner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  label: {
    fontSize: 16,
  },
});
