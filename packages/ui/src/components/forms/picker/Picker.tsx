import { useState, type ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

import type { UiTheme } from "../../../theme/types";
import {
  PickerPopupShell,
  type PickerPopupShellProps,
} from "./PickerPopupShell";
import { usePopupDraft } from "./usePopupDraft";
import {
  PickerView,
  type PickerViewProps,
} from "./PickerView";

export type { PickerOption, PickerColumnConfig } from "./PickerView";

export type PickerProps = Omit<
  PickerViewProps,
  "value" | "onChange" | "defaultValue"
> & {
  visible: boolean;
  onClose: () => void;
  value?: string[];
  defaultValue?: string[];
  onConfirm?: (values: string[], indexes: number[]) => void;
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

export function Picker({
  visible,
  onClose,
  value,
  defaultValue,
  onConfirm,
  title = "请选择",
  confirmText,
  showConfirm = true,
  showCloseButton,
  closeIconPosition,
  heightRatio = 0.42,
  footer,
  popupStyle,
  theme,
  columns,
  ...viewRest
}: PickerProps) {
  const seed = value ?? defaultValue ?? [];
  const [draft, setDraft] = usePopupDraft(visible, seed);
  const [indexes, setIndexes] = useState<number[]>([]);

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
        onConfirm?.(draft, indexes);
        onClose();
      }}
    >
      <PickerView
        {...viewRest}
        columns={columns}
        value={draft.length ? draft : undefined}
        defaultValue={defaultValue}
        onChange={(values, idxs) => {
          setDraft(values);
          setIndexes(idxs);
        }}
        theme={theme}
      />
    </PickerPopupShell>
  );
}

