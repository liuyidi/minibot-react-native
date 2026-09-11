import {
  View,
  Text,
  Pressable,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { SafeArea } from "../../layout/safe-area";
import { useResolvedTheme } from "../../../theme/ThemeProvider";
import type { UiTheme } from "../../../theme/types";
import { Popup } from "../popup";

export type ActionSheetOption = {
  label: string;
  onPress: () => void;
  destructive?: boolean;
};

export type ActionSheetProps = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  options: ActionSheetOption[];
  theme?: Partial<UiTheme>;
  style?: StyleProp<ViewStyle>;
};

/**
 * Action list sheet — Popup(bottom + slide-up) with option rows.
 * Shares the same shell as BottomSheet; chrome differs (inset card + cancel).
 */
export function ActionSheet({
  visible,
  onClose,
  title,
  options,
  theme: themeOverride,
  style,
}: ActionSheetProps) {
  const palette = useResolvedTheme(themeOverride);

  return (
    <Popup
      visible={visible}
      onClose={onClose}
      position="bottom"
      animation="slide-up"
      bare
      theme={themeOverride}
    >
      <View style={styles.wrap}>
        <View
          style={[
            styles.sheet,
            {
              backgroundColor: palette.card,
              borderColor: palette.border,
            },
            style,
          ]}
        >
          {title ? (
            <Text style={[styles.title, { color: palette.textSecondary }]}>
              {title}
            </Text>
          ) : null}
          {options.map((opt, i) => (
            <Pressable
              key={`${opt.label}-${i}`}
              accessibilityRole="button"
              onPress={() => {
                onClose();
                opt.onPress();
              }}
              style={({ pressed }) => [
                styles.option,
                {
                  borderTopColor: palette.border,
                  borderTopWidth:
                    i === 0 && !title ? 0 : StyleSheet.hairlineWidth,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <Text
                style={[
                  styles.optionLabel,
                  { color: opt.destructive ? palette.red : palette.text },
                ]}
              >
                {opt.label}
              </Text>
            </Pressable>
          ))}
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={onClose}
          style={({ pressed }) => [
            styles.cancel,
            {
              backgroundColor: palette.card,
              borderColor: palette.border,
              opacity: pressed ? 0.8 : 1,
            },
          ]}
        >
          <Text style={[styles.cancelLabel, { color: palette.text }]}>
            Cancel
          </Text>
        </Pressable>
        <SafeArea position="bottom" />
      </View>
    </Popup>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginHorizontal: 12,
    marginBottom: 8,
  },
  sheet: {
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
  title: {
    fontSize: 13,
    textAlign: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  option: {
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  optionLabel: {
    fontSize: 17,
    fontWeight: "500",
  },
  cancel: {
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
  },
  cancelLabel: {
    fontSize: 17,
    fontWeight: "600",
  },
});
