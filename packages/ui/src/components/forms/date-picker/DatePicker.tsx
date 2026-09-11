import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

import { formatDate } from "../../../date/format";
import type { UiTheme } from "../../../theme/types";
import {
  PickerPopupShell,
  type PickerPopupShellProps,
} from "../picker/PickerPopupShell";
import { usePopupDraft } from "../picker/usePopupDraft";
import {
  DatePickerView,
  type DatePickerViewProps,
} from "./DatePickerView";

export type DatePickerProps = Omit<
  DatePickerViewProps,
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

export function DatePicker({
  visible,
  onClose,
  value,
  defaultValue,
  onConfirm,
  title = "选择日期",
  confirmText,
  showConfirm = true,
  showCloseButton,
  closeIconPosition,
  heightRatio = 0.42,
  footer,
  popupStyle,
  theme,
  ...rest
}: DatePickerProps) {
  const [draft, setDraft] = usePopupDraft(
    visible,
    value ?? defaultValue ?? formatDate(new Date()),
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
      <DatePickerView
        {...rest}
        value={draft}
        onChange={setDraft}
        theme={theme}
      />
    </PickerPopupShell>
  );
}

