import type { ReactNode } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import {
  buildMonthCells,
  isSameDay,
  isWeekend,
  type MonthCell,
} from "../../../date/calendar-math";
import { formatDate } from "../../../date/format";
import {
  resolveDayHolidayMeta,
  type DayHolidayMeta,
  type YearHolidayMap,
} from "../../../date/holidays/cn";
import { useResolvedTheme } from "../../../theme/ThemeProvider";
import type { UiTheme } from "../../../theme/types";

export type CalendarDayState =
  | "normal"
  | "disabled"
  | "today"
  | "selected"
  | "range-start"
  | "range-end"
  | "in-range";

export type CalendarDayInfo = {
  date: Date;
  key: string;
  state: CalendarDayState;
  weekend: boolean;
  holiday?: DayHolidayMeta;
};

export type CalendarGridProps = {
  year: number;
  /** 0–11 */
  monthIndex: number;
  /** Selected single day or range endpoints. */
  selected?: { start?: Date | null; end?: Date | null };
  minDate?: Date | null;
  maxDate?: Date | null;
  /** Show “今天” instead of day number. @default true */
  showTodayLabel?: boolean;
  /** Highlight Sat/Sun. @default true */
  highlightWeekend?: boolean;
  weekendColor?: string;
  holidayMap?: YearHolidayMap | null;
  /** Use builtin CN holidays. @default true */
  showHolidays?: boolean;
  startLabel?: string;
  endLabel?: string;
  onSelectDay?: (date: Date) => void;
  renderDay?: (info: CalendarDayInfo, defaultNode: ReactNode) => ReactNode;
  theme?: Partial<UiTheme>;
  style?: StyleProp<ViewStyle>;
};

function dayState(
  date: Date,
  selected: CalendarGridProps["selected"],
  minDate?: Date | null,
  maxDate?: Date | null,
): CalendarDayState {
  if (minDate && date < strip(minDate)) return "disabled";
  if (maxDate && date > strip(maxDate)) return "disabled";
  const start = selected?.start ? strip(selected.start) : null;
  const end = selected?.end ? strip(selected.end) : null;
  if (start && end) {
    if (isSameDay(date, start) && isSameDay(date, end)) return "selected";
    if (isSameDay(date, start)) return "range-start";
    if (isSameDay(date, end)) return "range-end";
    if (date > start && date < end) return "in-range";
  } else if (start && isSameDay(date, start)) {
    return "selected";
  }
  const today = strip(new Date());
  if (isSameDay(date, today)) return "today";
  return "normal";
}

function strip(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function CalendarGrid({
  year,
  monthIndex,
  selected,
  minDate,
  maxDate,
  showTodayLabel = true,
  highlightWeekend = true,
  weekendColor = "#FF8A00",
  holidayMap,
  showHolidays = true,
  startLabel = "入住",
  endLabel = "离店",
  onSelectDay,
  renderDay,
  theme: themeOverride,
  style,
}: CalendarGridProps) {
  const palette = useResolvedTheme(themeOverride);
  const cells = buildMonthCells(year, monthIndex);
  const today = strip(new Date());

  const renderCell = (cell: MonthCell, idx: number) => {
    if (cell.kind === "empty") {
      return (
        <View key={`e-${idx}`} style={styles.cellWrap}>
          <View style={styles.cell} />
        </View>
      );
    }
    const { date, key } = cell;
    const state = dayState(date, selected, minDate, maxDate);
    const weekend = isWeekend(date);
    const holiday = showHolidays
      ? resolveDayHolidayMeta(key, holidayMap)
      : holidayMap
        ? resolveDayHolidayMeta(key, holidayMap)
        : undefined;

    const info: CalendarDayInfo = { date, key, state, weekend, holiday };
    const disabled = state === "disabled";
    const selectedLike =
      state === "selected" ||
      state === "range-start" ||
      state === "range-end";
    const inRange = state === "in-range";

    const isToday = isSameDay(date, today);
    const dayText =
      showTodayLabel && isToday && !selectedLike ? "今天" : String(date.getDate());

    let fg = palette.text;
    if (disabled) fg = palette.muted;
    else if (selectedLike) fg = palette.onPrimary;
    else if (holiday?.kind === "rest" || (highlightWeekend && weekend))
      fg = weekendColor;
    else if (holiday?.kind === "work") fg = palette.text;

    const defaultNode = (
      <Pressable
        disabled={disabled}
        onPress={() => onSelectDay?.(date)}
        style={[
          styles.cell,
          inRange && { backgroundColor: `${palette.primary}22` },
          selectedLike && {
            backgroundColor: palette.primary,
            borderRadius: 8,
          },
        ]}
      >
        {holiday?.label ? (
          <Text
            style={[
              styles.fest,
              { color: selectedLike ? palette.onPrimary : weekendColor },
            ]}
            numberOfLines={1}
          >
            {holiday.label}
          </Text>
        ) : holiday?.kind === "rest" ? (
          <Text
            style={[
              styles.fest,
              { color: selectedLike ? palette.onPrimary : weekendColor },
            ]}
          >
            休
          </Text>
        ) : holiday?.kind === "work" ? (
          <Text
            style={[
              styles.fest,
              { color: selectedLike ? palette.onPrimary : palette.textSecondary },
            ]}
          >
            班
          </Text>
        ) : (
          <View style={styles.festSlot} />
        )}
        <Text style={[styles.day, { color: fg, fontWeight: selectedLike ? "700" : "500" }]}>
          {dayText}
        </Text>
        {state === "range-start" ? (
          <Text style={[styles.sub, { color: palette.onPrimary }]}>{startLabel}</Text>
        ) : state === "range-end" ? (
          <Text style={[styles.sub, { color: palette.onPrimary }]}>{endLabel}</Text>
        ) : selectedLike && isToday ? (
          <Text style={[styles.sub, { color: palette.onPrimary }]}>今天</Text>
        ) : (
          <View style={styles.subSlot} />
        )}
      </Pressable>
    );

    return (
      <View key={key} style={styles.cellWrap}>
        {renderDay ? renderDay(info, defaultNode) : defaultNode}
      </View>
    );
  };

  return (
    <View style={style}>
      <Text style={[styles.monthTitle, { color: palette.heading }]}>
        {year}年{monthIndex + 1}月
      </Text>
      <View style={styles.grid}>{cells.map(renderCell)}</View>
    </View>
  );
}

/** Re-export helper for keys. */
export { formatDate };

const styles = StyleSheet.create({
  monthTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginVertical: 10,
    paddingHorizontal: 4,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  cellWrap: {
    width: "14.2857%",
  },
  cell: {
    minHeight: 56,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
  },
  fest: {
    fontSize: 10,
    lineHeight: 12,
    height: 12,
  },
  festSlot: {
    height: 12,
  },
  day: {
    fontSize: 16,
    lineHeight: 22,
  },
  sub: {
    fontSize: 10,
    lineHeight: 14,
    height: 14,
  },
  subSlot: {
    height: 14,
  },
});
