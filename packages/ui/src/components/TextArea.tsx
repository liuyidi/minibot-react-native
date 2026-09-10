import {
  TextInput,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from "react-native";

import { useResolvedTheme } from "../theme/ThemeProvider";
import type { UiTheme } from "../theme/types";

export type TextAreaProps = TextInputProps & {
  label?: string;
  hint?: string;
  error?: string;
  theme?: Partial<UiTheme>;
  containerStyle?: StyleProp<ViewStyle>;
  minHeight?: number;
};

export function TextArea({
  label,
  hint,
  error,
  theme: themeOverride,
  containerStyle,
  style,
  minHeight = 120,
  ...rest
}: TextAreaProps) {
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
        multiline
        textAlignVertical="top"
        placeholderTextColor={palette.muted}
        style={[
          styles.input,
          {
            color: palette.text,
            backgroundColor: palette.background,
            borderColor,
            minHeight,
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
  },
  hint: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 18,
  },
  error: {
    fontSize: 13,
    lineHeight: 18,
  },
  input: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 10,
    fontSize: 16,
    lineHeight: 22,
  },
});
