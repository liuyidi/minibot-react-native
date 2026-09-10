import { useState } from "react";
import {
  View,
  Pressable,
  Text,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { useResolvedTheme } from "../theme/ThemeProvider";
import type { UiTheme } from "../theme/types";
import { TextField, type TextFieldProps } from "./TextField";

export type PasswordFieldProps = Omit<TextFieldProps, "secureTextEntry"> & {
  theme?: TextFieldProps["theme"];
  toggleStyle?: StyleProp<ViewStyle>;
};

export function PasswordField({
  theme: themeOverride,
  toggleStyle,
  containerStyle,
  ...rest
}: PasswordFieldProps) {
  const palette = useResolvedTheme(themeOverride);
  const [visible, setVisible] = useState(false);

  return (
    <View style={[styles.wrap, containerStyle]}>
      <TextField
        {...rest}
        theme={themeOverride}
        secureTextEntry={!visible}
        containerStyle={styles.field}
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={visible ? "Hide password" : "Show password"}
        onPress={() => setVisible((v) => !v)}
        style={({ pressed }) => [
          styles.toggle,
          { opacity: pressed ? 0.7 : 1 },
          toggleStyle,
        ]}
      >
        <Text style={[styles.toggleLabel, { color: palette.primary }]}>
          {visible ? "Hide" : "Show"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "relative",
  },
  field: {
    gap: 8,
  },
  toggle: {
    position: "absolute",
    right: 12,
    bottom: 12,
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  toggleLabel: {
    fontSize: 15,
    fontWeight: "600",
  },
});
