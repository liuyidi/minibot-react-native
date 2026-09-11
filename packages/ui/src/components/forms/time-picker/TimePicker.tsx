import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

import type { UiTheme } from "../../../theme/types";
import {
  PickerPopupShell,
  type PickerPopupShellProps,
} from "../picker/PickerPopupShell";
import { usePopupDraft } from "../picker/usePopupDraft";
import {
  TimePickerView,
  type TimePickerViewProps,
} from "./TimePickerView";

export type TimePickerProps = Omit<
  TimePickerViewProps,
  "value" | "onChange" | "defaultValue"
> & {
  visible: boolean;
  onClose: () => void;
  value?: string;
  defaultValue?: string;
  onConfirm?: (value: string) => void;
  title?: string;
  confirmText?: string;
  showConfirm?: boolean;
  showCloseButton?: boolean;
  closeIconPosition?: PickerPopupShellProps["closeIconPosition"];
  heightRatio?: number;
  footer?: ReactNode;
  popupStyle?: StyleProp<ViewStyle>;
  theme?: Partial<UiTheme>;
};

export function TimePicker({
  visible,
  onClose,
  value,
  defaultValue = "00:00",
  onConfirm,
  title = "选择时间",
  confirmText,
  showConfirm = true,
  showCloseButton,
  closeIconPosition,
  heightRatio = 0.4,
  footer,
  popupStyle,
  theme,
  ...rest
}: TimePickerProps) {
  const [draft, setDraft] = usePopupDraft(visible, value ?? defaultValue);

  return (
    <PickerPopupShell
      visible={visible}
      onClose={onClose}
      title={title}
      confirmText={confirmText}
      showConfirm={showConfirm}
      showCloseButton={showCloseButton}
      closeIconPosition={closeIconPosition}
      heightRatio={heightRatio}
      footer={footer}
      theme={theme}
      style={popupStyle}
      onConfirm={() => {
        onConfirm?.(draft);
        onClose();
      }}
    >
      <TimePickerView
        {...rest}
        value={draft}
        onChange={setDraft}
        theme={theme}
      />
    </PickerPopupShell>
  );
}

