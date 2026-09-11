import type { ReactNode } from "react";
import {
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { durationLabel } from "../../../date/calendar-math";
import { formatMonthDay } from "../../../date/format";
import { parseDate, parseTime } from "../../../date/parse";
import type { YearHolidayMap } from "../../../date/holidays/cn";
import { useResolvedTheme } from "../../../theme/ThemeProvider";
import type { UiTheme } from "../../../theme/types";
import { useControllableState } from "../../../utils/useControllableState";
import {
  CalendarPickerView,
  type CalendarRangeValue,
} from "../calendar-picker/CalendarPickerView";
import { PickerGroup } from "../picker/PickerGroup";
import { TimePickerView } from "../time-picker/TimePickerView";

export type CalendarRangeWithTimeValue = {
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
};

export type CalendarRangeWithTimeViewProps = {
  value?: CalendarRangeWithTimeValue;
  defaultValue?: CalendarRangeWithTimeValue;
  onChange?: (value: CalendarRangeWithTimeValue) => void;
  minDate?: string;
  maxDate?: string;
  monthCount?: number;
  minuteStep?: number;
  startDateLabel?: string;
  endDateLabel?: string;
  startTimeTitle?: string;
  endTimeTitle?: string;
  showHolidays?: boolean;
  holidayMap?: YearHolidayMap | null;
  theme?: Partial<UiTheme>;
  style?: StyleProp<ViewStyle>;
  renderSummary?: (info: {
    value: CalendarRangeWithTimeValue;
    durationText: string;
  }) => ReactNode;
};

function combineDateTime(dateStr?: string, timeStr?: string): Date | null {
  if (!dateStr) return null;
  const d = parseDate(dateStr);
  if (!d) return null;
  const t = parseTime(timeStr ?? "00:00") ?? { hour: 0, minute: 0 };
  d.setHours(t.hour, t.minute, 0, 0);
  return d;
}

export function CalendarRangeWithTimeView({
  value: valueProp,
  defaultValue,
  onChange,
  minDate,
  maxDate,
  monthCount,
  minuteStep = 30,
  startDateLabel = "取车",
  endDateLabel = "还车",
  startTimeTitle = "取车时间",
  endTimeTitle = "还车时间",
  showHolidays = true,
  holidayMap,
  theme: themeOverride,
  style,
  renderSummary,
}: CalendarRangeWithTimeViewProps) {
  const palette = useResolvedTheme(themeOverride);
  const [value, setValue] = useControllableState(
    valueProp,
    defaultValue ?? {
      startTime: "11:00",
      endTime: "10:00",
    },
    onChange,
  );

  const range: CalendarRangeValue = {
    start: value.startDate,
    end: value.endDate,
  };

  const startDt = combineDateTime(value.startDate, value.startTime);
  const endDt = combineDateTime(value.endDate, value.endTime);
  const dur =
    startDt && endDt && endDt > startDt ? durationLabel(startDt, endDt) : null;
  const durationText = dur
    ? `共${dur.days}天 ${dur.hours}小时`
    : "";

  const patch = (partial: Partial<CalendarRangeWithTimeValue>) => {
    setValue({ ...value, ...partial });
  };

  return (
    <View style={[{ flex: 1 }, style]}>
      <CalendarPickerView
        mode="range"
        rangeValue={range}
        onRangeChange={(r) =>
          patch({ startDate: r.start, endDate: r.end })
        }
        minDate={minDate}
        maxDate={maxDate}
        monthCount={monthCount}
        startLabel={startDateLabel}
        endLabel={endDateLabel}
        showHolidays={showHolidays}
        holidayMap={holidayMap}
        theme={themeOverride}
        style={styles.calendar}
        renderSummary={() => null}
      />
      <View style={[styles.times, { borderTopColor: palette.border }]}>
        <PickerGroup
          theme={themeOverride}
          items={[
            {
              title: startTimeTitle,
              children: (
                <TimePickerView
                  value={value.startTime ?? "11:00"}
                  minuteStep={minuteStep}
                  onChange={(t) => patch({ startTime: t })}
                  theme={themeOverride}
                />
              ),
            },
            {
              title: endTimeTitle,
              children: (
                <TimePickerView
                  value={value.endTime ?? "10:00"}
                  minuteStep={minuteStep}
                  onChange={(t) => patch({ endTime: t })}
                  theme={themeOverride}
                />
              ),
            },
          ]}
        />
      </View>
      {renderSummary ? (
        renderSummary({ value, durationText })
      ) : (
        <View style={[styles.summary, { borderTopColor: palette.border }]}>
          <Text style={{ color: palette.text, fontSize: 13, flex: 1 }}>
            {startDateLabel[0]}:{" "}
            {value.startDate
              ? `${formatMonthDay(parseDate(value.startDate)!)} ${value.startTime ?? ""}`
              : "--"}
            {"\n"}
            {endDateLabel[0]}:{" "}
            {value.endDate
              ? `${formatMonthDay(parseDate(value.endDate)!)} ${value.endTime ?? ""}`
              : "--"}
            {durationText ? ` (${durationText})` : ""}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  calendar: {
    flex: 1,
  },
  times: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 8,
    paddingHorizontal: 8,
  },
  summary: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});
