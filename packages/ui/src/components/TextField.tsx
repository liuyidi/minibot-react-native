import {
  TextInput,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from "react-native";

export type TextFieldPalette = {
  ink: string;
  canvas: string;
  border: string;
  focus: string;
  muted: string;
};

export type TextFieldProps = TextInputProps & {
  label?: string;
  hint?: string;
  palette: TextFieldPalette;
  containerStyle?: StyleProp<ViewStyle>;
};

export function TextField({
  label,
  hint,
  palette,
  containerStyle,
  style,
  ...rest
}: TextFieldProps) {
  return (
    <View style={[styles.field, containerStyle]}>
      {label ? (
        <Text style={[styles.label, { color: palette.ink }]}>{label}</Text>
      ) : null}
      {hint ? (
        <Text style={[styles.hint, { color: palette.muted }]}>{hint}</Text>
      ) : null}
      <TextInput
        placeholderTextColor={palette.muted}
        style={[
          styles.input,
          {
            color: palette.ink,
            backgroundColor: palette.canvas,
            borderColor: palette.border,
          },
          style,
        ]}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: 12,
  },
  label: {
    fontSize: 18,
    fontWeight: "500",
    lineHeight: 18,
    textAlign: "left",
  },
  hint: {
    fontSize: 14,
    fontWeight: "300",
    lineHeight: 18,
    textAlign: "left",
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
