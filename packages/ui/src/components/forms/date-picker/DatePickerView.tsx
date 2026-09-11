import { useMemo } from "react";
import type { StyleProp, ViewStyle } from "react-native";

import { daysInMonth } from "../../../date/calendar-math";
import { formatDate } from "../../../date/format";
import { parseDate } from "../../../date/parse";
import type { UiTheme } from "../../../theme/types";
import { useControllableState } from "../../../utils/useControllableState";
import { PickerView, type PickerOption } from "../picker/PickerView";

export type DatePickerViewProps = {
  /** `YYYY-MM-DD` */
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Inclusive min date `YYYY-MM-DD` */
  min?: string;
  /** Inclusive max date `YYYY-MM-DD` */
  max?: string;
  /** @default currentYear - 10 */
  startYear?: number;
  /** @default currentYear + 10 */
  endYear?: number;
  itemHeight?: number;
  visibleCount?: number;
  theme?: Partial<UiTheme>;
  style?: StyleProp<ViewStyle>;
};

function pad2(n: number) {
  return n < 10 ? `0${n}` : String(n);
}

function todayStr() {
  return formatDate(new Date());
}

export function DatePickerView({
  value: valueProp,
  defaultValue,
  onChange,
  min,
  max,
  startYear,
  endYear,
  itemHeight,
  visibleCount,
  theme,
  style,
}: DatePickerViewProps) {
  const [value, setValue] = useControllableState(
    valueProp,
    defaultValue ?? todayStr(),
    onChange,
  );

  const date = parseDate(value) ?? new Date();
  const minDate = min ? parseDate(min) : null;
  const maxDate = max ? parseDate(max) : null;
  const yNow = new Date().getFullYear();
  const y0 = startYear ?? yNow - 10;
  const y1 = endYear ?? yNow + 10;

  const yearOptions: PickerOption[] = useMemo(() => {
    const list: PickerOption[] = [];
    for (let y = y0; y <= y1; y++) {
      list.push({ label: `${y}年`, value: String(y) });
    }
    return list;
  }, [y0, y1]);

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const monthOptions: PickerOption[] = useMemo(() => {
    const list: PickerOption[] = [];
    for (let m = 1; m <= 12; m++) {
      if (minDate && year === minDate.getFullYear() && m < minDate.getMonth() + 1)
        continue;
      if (maxDate && year === maxDate.getFullYear() && m > maxDate.getMonth() + 1)
        continue;
      list.push({ label: `${m}月`, value: String(m) });
    }
    return list;
  }, [year, minDate, maxDate]);

  const dim = daysInMonth(year, month - 1);
  const dayOptions: PickerOption[] = useMemo(() => {
    const list: PickerOption[] = [];
    for (let d = 1; d <= dim; d++) {
      if (
        minDate &&
        year === minDate.getFullYear() &&
        month === minDate.getMonth() + 1 &&
        d < minDate.getDate()
      )
        continue;
      if (
        maxDate &&
        year === maxDate.getFullYear() &&
        month === maxDate.getMonth() + 1 &&
        d > maxDate.getDate()
      )
        continue;
      list.push({ label: `${d}日`, value: String(d) });
    }
    return list;
  }, [dim, year, month, minDate, maxDate]);

  const yVal = String(year);
  const mVal = monthOptions.some((o) => o.value === String(month))
    ? String(month)
    : (monthOptions[0]?.value ?? "1");
  const dVal = dayOptions.some((o) => o.value === String(day))
    ? String(day)
    : (dayOptions[0]?.value ?? "1");

  return (
    <PickerView
      columns={[yearOptions, monthOptions, dayOptions]}
      value={[yVal, mVal, dVal]}
      onChange={([y, m, d]) => {
        const maxD = daysInMonth(Number(y), Number(m) - 1);
        const dd = Math.min(Number(d), maxD);
        setValue(`${y}-${pad2(Number(m))}-${pad2(dd)}`);
      }}
      itemHeight={itemHeight}
      visibleCount={visibleCount}
      theme={theme}
      style={style}
    />
  );
}
