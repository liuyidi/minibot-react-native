import { type ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

import { useUiMessages } from "../../../config/context";
import type { UiTheme } from "../../../theme/types";
import { DialogContentText, DialogRoot } from "./Dialog";

/** Single-button alert — thin Dialog preset. */
export type AlertProps = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  content?: ReactNode;
  confirmText?: string;
  onConfirm?: () => void;
  closeOnMaskPress?: boolean;
  theme?: Partial<UiTheme>;
  style?: StyleProp<ViewStyle>;
};

export function Alert({
  visible,
  onClose,
  title,
  content,
  confirmText,
  onConfirm,
  closeOnMaskPress = true,
  theme,
  style,
}: AlertProps) {
  const messages = useUiMessages();
  const label = confirmText ?? messages.ok;
  return (
    <DialogRoot
      visible={visible}
      onClose={onClose}
      title={title}
      closeOnMaskPress={closeOnMaskPress}
      theme={theme}
      style={style}
      primaryAction={{
        label,
        onPress: () => {
          onConfirm?.();
          onClose();
        },
      }}
    >
      <DialogContentText content={content} theme={theme} />
    </DialogRoot>
  );
}
