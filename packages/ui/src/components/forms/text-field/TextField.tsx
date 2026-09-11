import {
  TextInput,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from "react-native";

import { useResolvedTheme } from "../../../theme/ThemeProvider";
import type { UiTheme } from "../../../theme/types";

export type TextFieldProps = TextInputProps & {
  label?: string;
  hint?: string;
  error?: string;
  theme?: Partial<UiTheme>;
  containerStyle?: StyleProp<ViewStyle>;
};

export function TextField({
  label,
  hint,
  error,
  theme: themeOverride,
  containerStyle,
  style,
  ...rest
}: TextFieldProps) {
  const palette = useResolvedTheme(themeOverride);
  const borderColor = error ? palette.red : palette.border;

  return (
    <View style={[styles.field, containerStyle]}>
      {label ? (
        <Text style={[styles.label, { color: palette.heading }]}>{label}</Text>
      ) : null}
      {hint && !error ? (
        <Text style={[styles.hint, { color: palette.muted }]}>{hint}</Text>
      ) : null}
      <TextInput
        placeholderTextColor={palette.muted}
        style={[
          styles.input,
          {
            color: palette.text,
            backgroundColor: palette.background,
            borderColor,
          },
          style,
        ]}
        {...rest}
      />
      {error ? (
        <Text style={[styles.error, { color: palette.red }]}>{error}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 20,
    textAlign: "left",
  },
  hint: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 18,
    textAlign: "left",
  },
  error: {
    fontSize: 13,
    lineHeight: 18,
  },
  input: {
    minHeight: 48,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderRadius: 10,
    fontSize: 18,
    lineHeight: 22,
  },
});
