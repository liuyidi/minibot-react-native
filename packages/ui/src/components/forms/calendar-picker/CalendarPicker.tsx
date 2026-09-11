import type { ReactNode } from "react";
import { Text } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";

import { formatMonthDay } from "../../../date/format";
import { parseDate } from "../../../date/parse";
import { useResolvedTheme } from "../../../theme/ThemeProvider";
import type { UiTheme } from "../../../theme/types";
import {
  PickerPopupShell,
  type PickerPopupShellProps,
} from "../picker/PickerPopupShell";
import { usePopupDraft } from "../picker/usePopupDraft";
import {
  CalendarPickerView,
  type CalendarPickerViewProps,
  type CalendarRangeValue,
} from "./CalendarPickerView";

export type { CalendarRangeValue };
export type { CalendarSelectionMode } from "./CalendarPickerView";

export type CalendarPickerProps = Omit<
  CalendarPickerViewProps,
  | "value"
  | "onChange"
  | "defaultValue"
  | "rangeValue"
  | "onRangeChange"
  | "defaultRangeValue"
  | "renderSummary"
  | "style"
> & {
  visible: boolean;
  onClose: () => void;
  value?: string;
  defaultValue?: string;
  rangeValue?: CalendarRangeValue;
  defaultRangeValue?: CalendarRangeValue;
  onConfirm?: (payload: {
    mode: "single" | "range";
    value?: string;
    range?: CalendarRangeValue;
    nights: number;
  }) => void;
  title?: string;
  confirmText?: string;
  showConfirm?: boolean;
  showCloseButton?: boolean;
  closeIconPosition?: PickerPopupShellProps["closeIconPosition"];
  heightRatio?: number;
  hideSummary?: boolean;
  footer?: ReactNode;
  popupStyle?: StyleProp<ViewStyle>;
  theme?: Partial<UiTheme>;
};

export function CalendarPicker({
  visible,
  onClose,
  mode = "single",
  value,
  defaultValue,
  rangeValue,
  defaultRangeValue,
  onConfirm,
  title = "日期选择",
  confirmText = "确定",
  showConfirm = true,
  showCloseButton,
  closeIconPosition,
  heightRatio = 0.75,
  hideSummary = false,
  footer,
  popupStyle,
  theme,
  startLabel = "入住",
  endLabel = "离店",
  ...rest
}: CalendarPickerProps) {
  const palette = useResolvedTheme(theme);
  const [singleDraft, setSingleDraft] = usePopupDraft(
    visible,
    value ?? defaultValue ?? "",
  );
  const [rangeDraft, setRangeDraft] = usePopupDraft(
    visible,
    rangeValue ?? defaultRangeValue ?? {},
  );

  const nights =
    rangeDraft.start && rangeDraft.end
      ? (() => {
          const a = parseDate(rangeDraft.start);
          const b = parseDate(rangeDraft.end);
          if (!a || !b) return 0;
          return Math.round((b.getTime() - a.getTime()) / 86_400_000);
        })()
      : 0;

  const confirmDisabled =
    mode === "range" ? !rangeDraft.start || !rangeDraft.end : !singleDraft;

  const summary =
    !hideSummary && mode === "range" && rangeDraft.start ? (
      <Text style={{ color: palette.text, fontSize: 14, marginBottom: 4 }}>
        {startLabel}：
        {formatMonthDay(parseDate(rangeDraft.start)!)} {endLabel}：
        {rangeDraft.end
          ? `${formatMonthDay(parseDate(rangeDraft.end)!)} 共${nights}晚`
          : "--"}
      </Text>
    ) : null;

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
      confirmDisabled={confirmDisabled}
      footer={
        <>
          {summary}
          {footer}
        </>
      }
      theme={theme}
      style={popupStyle}
      onConfirm={() => {
        onConfirm?.({
          mode,
          value: mode === "single" ? singleDraft : undefined,
          range: mode === "range" ? rangeDraft : undefined,
          nights,
        });
        onClose();
      }}
    >
      <CalendarPickerView
        {...rest}
        mode={mode}
        value={singleDraft}
        onChange={setSingleDraft}
        rangeValue={rangeDraft}
        onRangeChange={setRangeDraft}
        startLabel={startLabel}
        endLabel={endLabel}
        theme={theme}
        renderSummary={() => null}
        style={{ flex: 1 }}
      />
    </PickerPopupShell>
  );
}

