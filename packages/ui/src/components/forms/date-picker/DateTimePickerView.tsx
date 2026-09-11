import { useMemo } from "react";
import type { StyleProp, ViewStyle } from "react-native";

import { addDays, startOfDay } from "../../../date/calendar-math";
import { formatDate, formatDateTime, formatTime } from "../../../date/format";
import { parseDate, parseDateTime } from "../../../date/parse";
import type { UiTheme } from "../../../theme/types";
import { useControllableState } from "../../../utils/useControllableState";
import { PickerView, type PickerOption } from "../picker/PickerView";

export type DateTimePickerViewProps = {
  /** `YYYY-MM-DDTHH:mm` */
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Inclusive earliest datetime. */
  min?: string;
  max?: string;
  /** How many forward days in the date column. @default 30 */
  dayCount?: number;
  /** Start of date column. @default today */
  startDate?: string;
  minuteStep?: number;
  itemHeight?: number;
  visibleCount?: number;
  theme?: Partial<UiTheme>;
  style?: StyleProp<ViewStyle>;
};

const WEEK = ["日", "一", "二", "三", "四", "五", "六"];

function pad2(n: number) {
  return n < 10 ? `0${n}` : String(n);
}

function labelForDay(d: Date) {
  return `${d.getMonth() + 1}月 ${d.getDate()}日 周${WEEK[d.getDay()]}`;
}

export function DateTimePickerView({
  value: valueProp,
  defaultValue,
  onChange,
  min,
  max,
  dayCount = 30,
  startDate,
  minuteStep = 5,
  itemHeight,
  visibleCount,
  theme,
  style,
}: DateTimePickerViewProps) {
  const fallback =
    defaultValue ??
    formatDateTime(new Date());
  const [value, setValue] = useControllableState(valueProp, fallback, onChange);

  const current = parseDateTime(value) ?? new Date();
  const minDt = min ? parseDateTime(min) : null;
  const maxDt = max ? parseDateTime(max) : null;

  const dayOptions: PickerOption[] = useMemo(() => {
    const start = startDate
      ? parseDate(startDate) ?? startOfDay(new Date())
      : startOfDay(new Date());
    const list: PickerOption[] = [];
    for (let i = 0; i < dayCount; i++) {
      const d = addDays(start, i);
      const key = formatDate(d);
      list.push({ label: labelForDay(d), value: key });
    }
    return list;
  }, [dayCount, startDate]);

  const dateKey = formatDate(current);
  const hour = current.getHours();
  const minute = current.getMinutes();

  const hourOptions: PickerOption[] = useMemo(() => {
    const list: PickerOption[] = [];
    for (let h = 0; h < 24; h++) list.push({ label: pad2(h), value: String(h) });
    return list;
  }, []);

  const minuteOptions: PickerOption[] = useMemo(() => {
    const step = Math.max(1, Math.floor(minuteStep));
    const list: PickerOption[] = [];
    for (let m = 0; m < 60; m += step) {
      list.push({ label: pad2(m), value: String(m) });
    }
    return list;
  }, [minuteStep]);

  const snappedMinute = (() => {
    const step = Math.max(1, Math.floor(minuteStep));
    const nearest = Math.round(minute / step) * step;
    const m = nearest >= 60 ? 60 - step : nearest;
    return minuteOptions.some((o) => o.value === String(m))
      ? m
      : Number(minuteOptions[0]?.value ?? 0);
  })();

  const dayValue = dayOptions.some((o) => o.value === dateKey)
    ? dateKey
    : (dayOptions[0]?.value ?? dateKey);

  return (
    <PickerView
      columns={[dayOptions, hourOptions, minuteOptions]}
      value={[dayValue, String(hour), String(snappedMinute)]}
      onChange={([d, h, m]) => {
        const next = `${d}T${formatTime(Number(h), Number(m))}`;
        const dt = parseDateTime(next);
        if (!dt) return;
        if (minDt && dt < minDt) {
          setValue(formatDateTime(minDt));
          return;
        }
        if (maxDt && dt > maxDt) {
          setValue(formatDateTime(maxDt));
          return;
        }
        setValue(next);
      }}
      itemHeight={itemHeight}
      visibleCount={visibleCount}
      theme={theme}
      style={style}
    />
  );
}
