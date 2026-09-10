import type { ReactNode } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { useResolvedTheme } from "../theme/ThemeProvider";
import type { UiTheme } from "../theme/types";
import { Backdrop } from "./Backdrop";
import { Button } from "./Button";

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
  theme?: Partial<UiTheme>;
  style?: StyleProp<ViewStyle>;
};

export function Dialog({
  visible,
  onClose,
  title,
  children,
  primaryAction,
  secondaryAction,
  theme: themeOverride,
  style,
}: DialogProps) {
  const palette = useResolvedTheme(themeOverride);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.root}>
        <Backdrop visible onPress={onClose} theme={themeOverride} />
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
          {title ? (
            <Text style={[styles.title, { color: palette.heading }]}>
              {title}
            </Text>
          ) : null}
          {children ? <View style={styles.body}>{children}</View> : null}
          {primaryAction || secondaryAction ? (
            <View style={styles.actions}>
              {secondaryAction ? (
                <Button
                  label={secondaryAction.label}
                  variant="secondary"
                  onPress={secondaryAction.onPress}
                  theme={themeOverride}
                  style={styles.actionBtn}
                />
              ) : null}
              {primaryAction ? (
                <Button
                  label={primaryAction.label}
                  variant="primary"
                  onPress={primaryAction.onPress}
                  theme={themeOverride}
                  style={styles.actionBtn}
                />
              ) : null}
            </View>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  panel: {
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 20,
    gap: 12,
    zIndex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  body: {
    gap: 8,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
  },
  actionBtn: {
    flex: 1,
  },
});
