import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { useResolvedTheme } from "../theme/ThemeProvider";
import type { UiTheme } from "../theme/types";
import { Backdrop } from "./Backdrop";

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
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.root}>
        <Backdrop visible onPress={onClose} theme={themeOverride} />
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
                  borderTopWidth: i === 0 && !title ? 0 : StyleSheet.hairlineWidth,
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
          <Pressable
            accessibilityRole="button"
            onPress={onClose}
            style={({ pressed }) => [
              styles.cancel,
              {
                backgroundColor: palette.surface,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <Text style={[styles.cancelLabel, { color: palette.text }]}>
              Cancel
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "flex-end",
  },
  sheet: {
    marginHorizontal: 12,
    marginBottom: 24,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
    zIndex: 1,
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
  },
  cancelLabel: {
    fontSize: 17,
    fontWeight: "600",
  },
});
