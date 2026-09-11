import type { ReactNode } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { SafeArea } from "../../layout/safe-area";
import { useResolvedTheme } from "../../../theme/ThemeProvider";
import type { UiTheme } from "../../../theme/types";
import { Popup } from "../popup";

export type BottomSheetProps = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  /** Top-right close (×). @default true */
  showCloseButton?: boolean;
  /** Fraction of window height (0–1). Default 0.5. */
  heightRatio?: number;
  /** Optional block under the title row (e.g. hero / product summary). */
  header?: ReactNode;
  /** Sticky footer below the scroll body (e.g. CTA). */
  footer?: ReactNode;
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
  header,
  footer,
  children,
  theme: themeOverride,
  style,
}: BottomSheetProps) {
  const palette = useResolvedTheme(themeOverride);
  const { height: windowHeight } = useWindowDimensions();
  const sheetHeight = Math.round(
    windowHeight * Math.min(1, Math.max(0.2, heightRatio)),
  );
  const showTitleRow = Boolean(title) || showCloseButton;

  return (
    <Popup
      visible={visible}
      onClose={onClose}
      position="bottom"
      animation="slide-up"
      bare
      theme={themeOverride}
    >
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
          <View
            style={[styles.handle, { backgroundColor: palette.border }]}
          />
        </View>

        {showTitleRow ? (
          <View style={styles.titleRow}>
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
        ) : null}

        {header ? <View style={styles.headerSlot}>{header}</View> : null}

        <ScrollView
          style={styles.body}
          contentContainerStyle={styles.bodyContent}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>

        {footer ? (
          <View
            style={[styles.footerSlot, { borderTopColor: palette.border }]}
          >
            {footer}
          </View>
        ) : null}

        <SafeArea position="bottom" />
      </View>
    </Popup>
  );
}

const styles = StyleSheet.create({
  sheet: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
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
  titleRow: {
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
  headerSlot: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  body: {
    flex: 1,
  },
  bodyContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  footerSlot: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
