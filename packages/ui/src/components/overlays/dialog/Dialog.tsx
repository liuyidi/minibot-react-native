import { type ReactNode } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { useResolvedTheme } from "../../../theme/ThemeProvider";
import type { UiTheme } from "../../../theme/types";
import { Button } from "../../controls/button";
import { Popup } from "../popup";

export type DialogAction = {
  label: string;
  onPress: () => void;
};

export type DialogProps = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children?: ReactNode;
  primaryAction?: DialogAction;
  secondaryAction?: DialogAction;
  /** Close when backdrop is pressed. @default true */
  closeOnMaskPress?: boolean;
  /** Show top-right close (×) control. @default false */
  showCloseButton?: boolean;
  theme?: Partial<UiTheme>;
  style?: StyleProp<ViewStyle>;
};

/** Renders string/number content as secondary text; otherwise passes through. */
export function DialogContentText({
  content,
  theme: themeOverride,
}: {
  content: ReactNode;
  theme?: Partial<UiTheme>;
}) {
  const palette = useResolvedTheme(themeOverride);
  if (content == null || content === false) return null;
  if (typeof content === "string" || typeof content === "number") {
    return (
      <Text style={[styles.contentText, { color: palette.textSecondary }]}>
        {content}
      </Text>
    );
  }
  return <>{content}</>;
}

function DialogView({
  visible,
  onClose,
  title,
  children,
  primaryAction,
  secondaryAction,
  closeOnMaskPress = true,
  showCloseButton = false,
  theme: themeOverride,
  style,
}: DialogProps) {
  const palette = useResolvedTheme(themeOverride);

  return (
    <Popup
      visible={visible}
      onClose={onClose}
      position="center"
      animation="fade"
      bare
      overlayType="Dialog"
      closeOnMaskPress={closeOnMaskPress}
      theme={themeOverride}
    >
      <View
        style={[
          styles.panel,
          {
            backgroundColor: palette.card,
            borderColor: palette.border,
          },
          style,
        ]}
      >
        {showCloseButton ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close"
            onPress={onClose}
            hitSlop={8}
            style={({ pressed }) => [
              styles.closeBtn,
              pressed && { opacity: 0.6 },
            ]}
          >
            <Text style={[styles.closeGlyph, { color: palette.muted }]}>
              ×
            </Text>
          </Pressable>
        ) : null}
        {title ? (
          <Text
            style={[
              styles.title,
              { color: palette.heading },
              showCloseButton ? styles.titleWithClose : null,
            ]}
          >
            {title}
          </Text>
        ) : null}
        {children ? <View style={styles.body}>{children}</View> : null}
        {primaryAction || secondaryAction ? (
          <View
            style={[
              styles.actions,
              !secondaryAction ? styles.actionsStack : null,
            ]}
          >
            {secondaryAction ? (
              <Button
                variant="secondary"
                onPress={secondaryAction.onPress}
                theme={themeOverride}
                style={styles.actionBtn}
              >
                {secondaryAction.label}
              </Button>
            ) : null}
            {primaryAction ? (
              <Button
                variant="primary"
                onPress={primaryAction.onPress}
                theme={themeOverride}
                block={!secondaryAction}
                style={secondaryAction ? styles.actionBtn : undefined}
              >
                {primaryAction.label}
              </Button>
            ) : null}
          </View>
        ) : null}
      </View>
    </Popup>
  );
}

export { DialogView as DialogRoot };

const styles = StyleSheet.create({
  panel: {
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 20,
    gap: 12,
    width: "100%",
    maxWidth: 320,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  titleWithClose: {
    paddingRight: 28,
  },
  closeBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 2,
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  closeGlyph: {
    fontSize: 22,
    lineHeight: 24,
    fontWeight: "400",
  },
  body: {
    gap: 8,
  },
  contentText: {
    fontSize: 15,
    lineHeight: 22,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
  },
  actionsStack: {
    flexDirection: "column",
  },
  actionBtn: {
    flex: 1,
  },
});
