import { type ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

import { useUiMessages } from "../../../config/context";
import type { UiTheme } from "../../../theme/types";
import { DialogContentText, DialogRoot } from "./Dialog";

/** Two-button confirm — thin Dialog preset. */
export type ConfirmProps = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  content?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  closeOnMaskPress?: boolean;
  theme?: Partial<UiTheme>;
  style?: StyleProp<ViewStyle>;
};

export function Confirm({
  visible,
  onClose,
  title,
  content,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  closeOnMaskPress = true,
  theme,
  style,
}: ConfirmProps) {
  const messages = useUiMessages();
  const confirmLabel = confirmText ?? messages.confirm;
  const cancelLabel = cancelText ?? messages.cancel;
  const dismiss = (result: "confirm" | "cancel") => {
    if (result === "confirm") onConfirm?.();
    else onCancel?.();
    onClose();
  };

  return (
    <DialogRoot
      visible={visible}
      onClose={() => dismiss("cancel")}
      title={title}
      closeOnMaskPress={closeOnMaskPress}
      theme={theme}
      style={style}
      secondaryAction={{
        label: cancelLabel,
        onPress: () => dismiss("cancel"),
      }}
      primaryAction={{
        label: confirmLabel,
        onPress: () => dismiss("confirm"),
      }}
    >
      <DialogContentText content={content} theme={theme} />
    </DialogRoot>
  );
}
