import type { ReactNode } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { useResolvedTheme } from "../theme/ThemeProvider";
import type { UiTheme } from "../theme/types";
import { Backdrop } from "./Backdrop";

export type BottomSheetProps = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  showCloseButton?: boolean;
  /** Fraction of window height (0–1). Default 0.5. */
  heightRatio?: number;
  children?: ReactNode;
  theme?: Partial<UiTheme>;
  style?: StyleProp<ViewStyle>;
};

export function BottomSheet({
  visible,
  onClose,
  title,
  showCloseButton = true,
  heightRatio = 0.5,
  children,
  theme: themeOverride,
  style,
}: BottomSheetProps) {
  const palette = useResolvedTheme(themeOverride);
  const { height: windowHeight } = useWindowDimensions();
  const sheetHeight = Math.round(windowHeight * Math.min(1, Math.max(0.2, heightRatio)));

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
              height: sheetHeight,
              backgroundColor: palette.card,
              borderColor: palette.border,
            },
            style,
          ]}
        >
          <View style={styles.handleRow}>
            <View style={[styles.handle, { backgroundColor: palette.border }]} />
          </View>
          {(title || showCloseButton) && (
            <View style={styles.header}>
              <Text
                style={[styles.title, { color: palette.heading }]}
                numberOfLines={1}
              >
                {title ?? ""}
              </Text>
              {showCloseButton ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Close"
                  onPress={onClose}
                  hitSlop={8}
                  style={({ pressed }) => [
                    styles.closeBtn,
                    {
                      backgroundColor: palette.surface,
                      opacity: pressed ? 0.7 : 1,
                    },
                  ]}
                >
                  <Text style={[styles.closeLabel, { color: palette.text }]}>
                    ✕
                  </Text>
                </Pressable>
              ) : null}
            </View>
          )}
          <ScrollView
            style={styles.body}
            contentContainerStyle={styles.bodyContent}
            keyboardShouldPersistTaps="handled"
          >
            {children}
          </ScrollView>
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
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    zIndex: 1,
  },
  handleRow: {
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 4,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 12,
    minHeight: 40,
  },
  title: {
    flex: 1,
    fontSize: 17,
    fontWeight: "600",
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  closeLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  body: {
    flex: 1,
  },
  bodyContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
});
