import type { ReactNode } from "react";
import {
  View,
  Text,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { useResolvedTheme } from "../theme/ThemeProvider";
import type { UiTheme } from "../theme/types";

export type FormFieldProps = {
  label?: string;
  error?: string;
  children: ReactNode;
  theme?: Partial<UiTheme>;
  style?: StyleProp<ViewStyle>;
};

export function FormField({
  label,
  error,
  children,
  theme: themeOverride,
  style,
}: FormFieldProps) {
  const palette = useResolvedTheme(themeOverride);

  return (
    <View style={[styles.field, style]}>
      {label ? (
        <Text style={[styles.label, { color: palette.heading }]}>{label}</Text>
      ) : null}
      {children}
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
  error: {
    fontSize: 13,
    lineHeight: 18,
  },
});
