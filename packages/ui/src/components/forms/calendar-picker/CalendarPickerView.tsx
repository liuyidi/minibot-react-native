import { useMemo, type ReactNode } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import {
  addMonths,
  compareDay,
  eachMonth,
  nightCount,
  startOfDay,
} from "../../../date/calendar-math";
import { formatDate, formatMonthDay } from "../../../date/format";
import { parseDate } from "../../../date/parse";
import type { YearHolidayMap } from "../../../date/holidays/cn";
import { useResolvedTheme } from "../../../theme/ThemeProvider";
import type { UiTheme } from "../../../theme/types";
import { useControllableState } from "../../../utils/useControllableState";
import { CalendarGrid } from "./CalendarGrid";

export type CalendarSelectionMode = "single" | "range";

export type CalendarRangeValue = {
  start?: string;
  end?: string;
};

export type CalendarPickerViewProps = {
  mode?: CalendarSelectionMode;
  /** Single: `YYYY-MM-DD`. Range: use `rangeValue`. */
  value?: string;
  defaultValue?: string;
  rangeValue?: CalendarRangeValue;
  defaultRangeValue?: CalendarRangeValue;
  onChange?: (value: string) => void;
  onRangeChange?: (range: CalendarRangeValue) => void;
  /** First month to show. @default today */
  minDate?: string;
  maxDate?: string;
  /** How many months to render from min (or today). @default 13 */
  monthCount?: number;
  showTodayLabel?: boolean;
  highlightWeekend?: boolean;
  weekendColor?: string;
  showHolidays?: boolean;
  holidayMap?: YearHolidayMap | null;
  startLabel?: string;
  endLabel?: string;
  /** Sticky weekday header. @default true */
  showWeekdays?: boolean;
  weekdays?: string[];
  theme?: Partial<UiTheme>;
  style?: StyleProp<ViewStyle>;
  /** Optional footer summary renderer for range mode. */
  renderSummary?: (info: {
    start?: string;
    end?: string;
    nights: number;
  }) => ReactNode;
};

const DEFAULT_WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"];

export function CalendarPickerView({
  mode = "single",
  value: valueProp,
  defaultValue,
  rangeValue: rangeProp,
  defaultRangeValue,
  onChange,
  onRangeChange,
  minDate: minStr,
  maxDate: maxStr,
  monthCount = 13,
  showTodayLabel = true,
  highlightWeekend = true,
  weekendColor,
  showHolidays = true,
  holidayMap,
  startLabel = "入住",
  endLabel = "离店",
  showWeekdays = true,
  weekdays = DEFAULT_WEEKDAYS,
  theme: themeOverride,
  style,
  renderSummary,
}: CalendarPickerViewProps) {
  const palette = useResolvedTheme(themeOverride);
  const [single, setSingle] = useControllableState(
    valueProp,
    defaultValue ?? "",
    onChange,
  );
  const [range, setRange] = useControllableState(
    rangeProp,
    defaultRangeValue ?? {},
    onRangeChange,
  );

  const minDate = minStr ? parseDate(minStr) : startOfDay(new Date());
  const maxDate = maxStr
    ? parseDate(maxStr)
    : addMonths(minDate ?? new Date(), monthCount - 1);

  const months = useMemo(() => {
    const from = minDate ?? startOfDay(new Date());
    const to = maxDate ?? addMonths(from, monthCount - 1);
    return eachMonth(from, to).slice(0, monthCount);
  }, [minDate, maxDate, monthCount]);

  const selected = useMemo(() => {
    if (mode === "range") {
      return {
        start: range.start ? parseDate(range.start) : null,
        end: range.end ? parseDate(range.end) : null,
      };
    }
    const d = single ? parseDate(single) : null;
    return { start: d, end: null };
  }, [mode, range, single]);

  const onSelectDay = (date: Date) => {
    const key = formatDate(date);
    if (mode === "single") {
      setSingle(key);
      return;
    }
    const start = range.start ? parseDate(range.start) : null;
    const end = range.end ? parseDate(range.end) : null;
    if (!start || (start && end)) {
      setRange({ start: key, end: undefined });
      return;
    }
    if (compareDay(date, start) < 0) {
      setRange({ start: key, end: undefined });
      return;
    }
    if (compareDay(date, start) === 0) {
      // same day: keep as start only (or treat as 1-night need end next day — leave as start)
      setRange({ start: key, end: undefined });
      return;
    }
    setRange({ start: range.start, end: key });
  };

  const nights =
    selected.start && selected.end
      ? nightCount(selected.start, selected.end)
      : 0;

  return (
    <View style={[{ flex: 1 }, style]}>
      {showWeekdays ? (
        <View style={[styles.weekRow, { borderBottomColor: palette.border }]}>
          {weekdays.map((w, i) => (
            <Text
              key={w + i}
              style={[
                styles.weekCell,
                {
                  color:
                    highlightWeekend && (i === 0 || i === 6)
                      ? weekendColor ?? "#FF8A00"
                      : palette.textSecondary,
                },
              ]}
            >
              {w}
            </Text>
          ))}
        </View>
      ) : null}
      <ScrollView style={styles.scrollFlex} contentContainerStyle={styles.scroll}>
        {months.map(({ year, monthIndex }) => (
          <CalendarGrid
            key={`${year}-${monthIndex}`}
            year={year}
            monthIndex={monthIndex}
            selected={selected}
            minDate={minDate}
            maxDate={maxDate}
            showTodayLabel={showTodayLabel}
            highlightWeekend={highlightWeekend}
            weekendColor={weekendColor}
            showHolidays={showHolidays}
            holidayMap={holidayMap}
            startLabel={startLabel}
            endLabel={endLabel}
            onSelectDay={onSelectDay}
            theme={themeOverride}
          />
        ))}
      </ScrollView>
      {renderSummary
        ? renderSummary({
            start: range.start ?? (mode === "single" ? single : undefined),
            end: range.end,
            nights,
          })
        : mode === "range" && range.start ? (
            <View style={[styles.summary, { borderTopColor: palette.border }]}>
              <Text style={{ color: palette.text, fontSize: 14 }}>
                {startLabel}：
                {range.start ? formatMonthDay(parseDate(range.start)!) : "--"}{" "}
                {endLabel}：
                {range.end ? formatMonthDay(parseDate(range.end)!) : "--"}
                {range.end ? ` 共${nights}晚` : ""}
              </Text>
            </View>
          ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  weekRow: {
    flexDirection: "row",
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  weekCell: {
    width: "14.2857%",
    textAlign: "center",
    fontSize: 13,
  },
  scrollFlex: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: 8,
    paddingBottom: 16,
  },
  summary: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
