import {
  View,
  TextInput,
  Pressable,
  Text,
  StyleSheet,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from "react-native";

import { useResolvedTheme } from "../theme/ThemeProvider";
import type { UiTheme } from "../theme/types";

export type SearchBarProps = Omit<TextInputProps, "style"> & {
  theme?: Partial<UiTheme>;
  containerStyle?: StyleProp<ViewStyle>;
  onClear?: () => void;
};

export function SearchBar({
  theme: themeOverride,
  containerStyle,
  onClear,
  value,
  onChangeText,
  ...rest
}: SearchBarProps) {
  const palette = useResolvedTheme(themeOverride);
  const showClear = Boolean(value) && Boolean(onClear || onChangeText);

  return (
    <View
      style={[
        styles.wrap,
        {
          backgroundColor: palette.surface,
          borderColor: palette.border,
        },
        containerStyle,
      ]}
    >
      <Text style={[styles.icon, { color: palette.muted }]}>⌕</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={palette.muted}
        style={[styles.input, { color: palette.text }]}
        returnKeyType="search"
        clearButtonMode="never"
        {...rest}
      />
      {showClear ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Clear"
          hitSlop={8}
          onPress={() => {
            onClear?.();
            onChangeText?.("");
          }}
        >
          <Text style={[styles.clear, { color: palette.muted }]}>✕</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 44,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 12,
    gap: 8,
  },
  icon: {
    fontSize: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
  },
  clear: {
    fontSize: 14,
    paddingHorizontal: 4,
  },
});
