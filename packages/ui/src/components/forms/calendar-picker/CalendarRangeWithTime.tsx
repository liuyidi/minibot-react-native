import type { ReactNode } from "react";
import { Text } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";

import { durationLabel } from "../../../date/calendar-math";
import { formatMonthDay } from "../../../date/format";
import { parseDate, parseTime } from "../../../date/parse";
import { useResolvedTheme } from "../../../theme/ThemeProvider";
import type { UiTheme } from "../../../theme/types";
import {
  PickerPopupShell,
  type PickerPopupShellProps,
} from "../picker/PickerPopupShell";
import { usePopupDraft } from "../picker/usePopupDraft";
import {
  CalendarRangeWithTimeView,
  type CalendarRangeWithTimeViewProps,
  type CalendarRangeWithTimeValue,
} from "./CalendarRangeWithTimeView";

export type { CalendarRangeWithTimeValue };

export type CalendarRangeWithTimeProps = Omit<
  CalendarRangeWithTimeViewProps,
  "value" | "onChange" | "defaultValue" | "renderSummary" | "style"
> & {
  visible: boolean;
  onClose: () => void;
  value?: CalendarRangeWithTimeValue;
  defaultValue?: CalendarRangeWithTimeValue;
  onConfirm?: (value: CalendarRangeWithTimeValue) => void;
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

function combine(dateStr?: string, timeStr?: string): Date | null {
  if (!dateStr) return null;
  const d = parseDate(dateStr);
  if (!d) return null;
  const t = parseTime(timeStr ?? "00:00") ?? { hour: 0, minute: 0 };
  d.setHours(t.hour, t.minute, 0, 0);
  return d;
}

export function CalendarRangeWithTime({
  visible,
  onClose,
  value,
  defaultValue,
  onConfirm,
  title = "选择取还车日期",
  confirmText = "确定",
  showConfirm = true,
  showCloseButton,
  closeIconPosition,
  heightRatio = 0.8,
  hideSummary = false,
  footer,
  popupStyle,
  theme,
  startDateLabel = "取车",
  endDateLabel = "还车",
  ...rest
}: CalendarRangeWithTimeProps) {
  const palette = useResolvedTheme(theme);
  const [draft, setDraft] = usePopupDraft(
    visible,
    value ??
      defaultValue ?? {
        startTime: "11:00",
        endTime: "10:00",
      },
  );

  const startDt = combine(draft.startDate, draft.startTime);
  const endDt = combine(draft.endDate, draft.endTime);
  const dur =
    startDt && endDt && endDt > startDt ? durationLabel(startDt, endDt) : null;
  const durationText = dur ? `共${dur.days}天 ${dur.hours}小时` : "";
  const confirmDisabled = !draft.startDate || !draft.endDate;

  const summary = !hideSummary ? (
    <Text style={{ color: palette.text, fontSize: 13, marginBottom: 4 }}>
      {startDateLabel[0]}:{" "}
      {draft.startDate
        ? `${formatMonthDay(parseDate(draft.startDate)!)} ${draft.startTime ?? ""}`
        : "--"}
      {"  "}
      {endDateLabel[0]}:{" "}
      {draft.endDate
        ? `${formatMonthDay(parseDate(draft.endDate)!)} ${draft.endTime ?? ""}`
        : "--"}
      {durationText ? ` (${durationText})` : ""}
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
        onConfirm?.(draft);
        onClose();
      }}
    >
      <CalendarRangeWithTimeView
        {...rest}
        value={draft}
        onChange={setDraft}
        startDateLabel={startDateLabel}
        endDateLabel={endDateLabel}
        theme={theme}
        renderSummary={() => null}
        style={{ flex: 1 }}
      />
    </PickerPopupShell>
  );
}

