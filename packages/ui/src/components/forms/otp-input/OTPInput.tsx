import { useRef } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
  type TextInputKeyPressEvent,
} from "react-native";

import { useResolvedTheme } from "../../../theme/ThemeProvider";
import type { UiTheme } from "../../../theme/types";

export type OTPInputProps = {
  length?: number;
  value: string;
  onChangeText: (value: string) => void;
  theme?: Partial<UiTheme>;
  style?: StyleProp<ViewStyle>;
};

export function OTPInput({
  length = 6,
  value,
  onChangeText,
  theme: themeOverride,
  style,
}: OTPInputProps) {
  const palette = useResolvedTheme(themeOverride);
  const inputs = useRef<(TextInput | null)[]>([]);
  const digits = value.padEnd(length, " ").slice(0, length).split("");

  const setDigit = (index: number, char: string) => {
    const next = digits.map((d, i) => (i === index ? char : d === " " ? "" : d));
    const cleaned = next.join("").replace(/\s/g, "").slice(0, length);
    onChangeText(cleaned);
    if (char && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const onKeyPress = (index: number, e: TextInputKeyPressEvent) => {
    if (e.nativeEvent.key === "Backspace" && !digits[index]?.trim() && index > 0) {
      inputs.current[index - 1]?.focus();
      const next = value.slice(0, index - 1) + value.slice(index);
      onChangeText(next);
    }
  };

  return (
    <View style={[styles.row, style]}>
      {Array.from({ length }).map((_, i) => (
        <TextInput
          key={i}
          ref={(el) => {
            inputs.current[i] = el;
          }}
          value={digits[i]?.trim() ?? ""}
          onChangeText={(t) => {
            const char = t.replace(/\D/g, "").slice(-1);
            setDigit(i, char);
          }}
          onKeyPress={(e) => onKeyPress(i, e)}
          keyboardType="number-pad"
          maxLength={1}
          selectTextOnFocus
          style={[
            styles.cell,
            {
              color: palette.text,
              borderColor: palette.border,
              backgroundColor: palette.background,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
  },
  cell: {
    width: 44,
    height: 52,
    borderWidth: 1,
    borderRadius: 10,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "600",
  },
});
