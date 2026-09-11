import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

import { formatDateTime } from "../../../date/format";
import type { UiTheme } from "../../../theme/types";
import {
  PickerPopupShell,
  type PickerPopupShellProps,
} from "../picker/PickerPopupShell";
import { usePopupDraft } from "../picker/usePopupDraft";
import {
  DateTimePickerView,
  type DateTimePickerViewProps,
} from "./DateTimePickerView";

export type DateTimePickerProps = Omit<
  DateTimePickerViewProps,
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

export function DateTimePicker({
  visible,
  onClose,
  value,
  defaultValue,
  onConfirm,
  title = "选择日期时间",
  confirmText = "确认",
  showConfirm = true,
  showCloseButton,
  closeIconPosition = "top-left",
  heightRatio = 0.45,
  footer,
  popupStyle,
  theme,
  ...rest
}: DateTimePickerProps) {
  const [draft, setDraft] = usePopupDraft(
    visible,
    value ?? defaultValue ?? formatDateTime(new Date()),
  );

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
      <DateTimePickerView
        {...rest}
        value={draft}
        onChange={setDraft}
        theme={theme}
      />
    </PickerPopupShell>
  );
}

