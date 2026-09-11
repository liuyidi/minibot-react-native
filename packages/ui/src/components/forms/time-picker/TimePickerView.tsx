import { useMemo } from "react";
import type { StyleProp, ViewStyle } from "react-native";

import { formatTime } from "../../../date/format";
import { parseTime } from "../../../date/parse";
import type { UiTheme } from "../../../theme/types";
import { useControllableState } from "../../../utils/useControllableState";
import { PickerView, type PickerOption } from "../picker/PickerView";

export type TimePickerViewProps = {
  /** `HH:mm` */
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Minute step. @default 1 */
  minuteStep?: number;
  /** Filter hours 0–23. */
  filterHour?: (hour: number) => boolean;
  /** Filter minutes for a given hour. */
  filterMinute?: (minute: number, hour: number) => boolean;
  itemHeight?: number;
  visibleCount?: number;
  theme?: Partial<UiTheme>;
  style?: StyleProp<ViewStyle>;
};

function pad2(n: number) {
  return n < 10 ? `0${n}` : String(n);
}

export function TimePickerView({
  value: valueProp,
  defaultValue = "00:00",
  onChange,
  minuteStep = 1,
  filterHour,
  filterMinute,
  itemHeight,
  visibleCount,
  theme,
  style,
}: TimePickerViewProps) {
  const [value, setValue] = useControllableState(
    valueProp,
    defaultValue,
    onChange,
  );

  const parsed = parseTime(value) ?? { hour: 0, minute: 0 };

  const hourOptions: PickerOption[] = useMemo(() => {
    const list: PickerOption[] = [];
    for (let h = 0; h < 24; h++) {
      if (filterHour && !filterHour(h)) continue;
      list.push({ label: pad2(h), value: String(h) });
    }
    return list;
  }, [filterHour]);

  const minuteOptions: PickerOption[] = useMemo(() => {
    const list: PickerOption[] = [];
    const step = Math.max(1, Math.floor(minuteStep));
    for (let m = 0; m < 60; m += step) {
      if (filterMinute && !filterMinute(m, parsed.hour)) continue;
      list.push({ label: pad2(m), value: String(m) });
    }
    return list;
  }, [filterMinute, minuteStep, parsed.hour]);

  const hourValue = String(
    hourOptions.some((o) => o.value === String(parsed.hour))
      ? parsed.hour
      : Number(hourOptions[0]?.value ?? 0),
  );
  const minuteValue = String(
    minuteOptions.some((o) => o.value === String(parsed.minute))
      ? parsed.minute
      : Number(minuteOptions[0]?.value ?? 0),
  );

  return (
    <PickerView
      columns={[hourOptions, minuteOptions]}
      value={[hourValue, minuteValue]}
      onChange={([h, m]) => {
        setValue(formatTime(Number(h), Number(m)));
      }}
      itemHeight={itemHeight}
      visibleCount={visibleCount}
      theme={theme}
      style={style}
    />
  );
}
