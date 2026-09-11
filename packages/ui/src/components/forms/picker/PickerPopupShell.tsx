import type { ReactNode } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { SafeArea } from "../../layout/safe-area";
import { Button } from "../../controls/button";
import { useResolvedTheme } from "../../../theme/ThemeProvider";
import type { UiTheme } from "../../../theme/types";
import { Popup } from "../../overlays/popup";

export type PickerPopupShellProps = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  /** Top-right close (×). @default true */
  showCloseButton?: boolean;
  /** Close icon side. @default "top-right" */
  closeIconPosition?: "top-right" | "top-left";
  /**
   * Fraction of window height for the sheet (capped at 90%).
   * Fixed height so nested ScrollViews / wheels get a bounded area.
   * @default 0.5
   */
  heightRatio?: number;
  /** Primary CTA. @default "确定" */
  confirmText?: string;
  showConfirm?: boolean;
  onConfirm?: () => void;
  /** Disable confirm (e.g. incomplete range). */
  confirmDisabled?: boolean;
  /** Optional block above the confirm button (summary). */
  footer?: ReactNode;
  children?: ReactNode;
  theme?: Partial<UiTheme>;
  style?: StyleProp<ViewStyle>;
};

/**
 * Bottom sheet chrome for pickers: title + close + flex body + confirm.
 * Body is a plain View (not ScrollView) so nested calendars / wheels work.
 * Sheet uses a definite height (like BottomSheet) so flex body + ScrollView
 * receive a bounded area — maxHeight-only collapses nested flex ScrollViews to 0.
 */
export function PickerPopupShell({
  visible,
  onClose,
  title,
  showCloseButton = true,
  closeIconPosition = "top-right",
  heightRatio = 0.5,
  confirmText = "确定",
  showConfirm = true,
  onConfirm,
  confirmDisabled = false,
  footer,
  children,
  theme: themeOverride,
  style,
}: PickerPopupShellProps) {
  const palette = useResolvedTheme(themeOverride);
  const { height: windowHeight } = useWindowDimensions();
  const sheetHeight = Math.round(
    windowHeight * Math.min(0.9, Math.max(0.25, heightRatio)),
  );
  const showTitleRow = Boolean(title) || showCloseButton;
  const closeOnLeft = closeIconPosition === "top-left";

  const closeBtn = showCloseButton ? (
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
      <Text style={[styles.closeLabel, { color: palette.text }]}>✕</Text>
    </Pressable>
  ) : (
    <View style={styles.closeSpacer} />
  );

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
        {showTitleRow ? (
          <View style={styles.titleRow}>
            {closeOnLeft ? closeBtn : <View style={styles.closeSpacer} />}
            <Text
              style={[styles.title, { color: palette.heading }]}
              numberOfLines={1}
            >
              {title ?? ""}
            </Text>
            {closeOnLeft ? <View style={styles.closeSpacer} /> : closeBtn}
          </View>
        ) : null}

        <View style={styles.body}>{children}</View>

        {footer || showConfirm ? (
          <SafeArea position="bottom" style={styles.footerSafe}>
            <View
              style={[styles.footerSlot, { borderTopColor: palette.border }]}
            >
              {footer}
              {showConfirm ? (
                <Button
                  variant="primary"
                  block
                  size="large"
                  disabled={confirmDisabled}
                  onPress={onConfirm}
                  theme={themeOverride}
                >
                  {confirmText}
                </Button>
              ) : null}
            </View>
          </SafeArea>
        ) : (
          <SafeArea position="bottom" />
        )}
      </View>
    </Popup>
  );
}

const styles = StyleSheet.create({
  sheet: {
    width: "100%",
    flexDirection: "column",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 8,
    gap: 8,
    minHeight: 44,
    flexShrink: 0,
  },
  title: {
    flex: 1,
    fontSize: 17,
    fontWeight: "600",
    textAlign: "center",
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  closeSpacer: {
    width: 32,
    height: 32,
  },
  closeLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  body: {
    flex: 1,
    minHeight: 0,
  },
  footerSafe: {
    flexShrink: 0,
  },
  footerSlot: {
    paddingHorizontal: 16,
    paddingTop: 12,
    // Bottom gap = device home-indicator inset only (via SafeArea wrapper).
    paddingBottom: 0,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 10,
  },
});
