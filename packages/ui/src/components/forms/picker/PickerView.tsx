import { useMemo } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import type { UiTheme } from "../../../theme/types";
import { useControllableState } from "../../../utils/useControllableState";
import {
  PickerColumn,
  type PickerOption,
} from "./PickerColumn";

export type { PickerOption };

export type PickerColumnConfig = {
  key?: string;
  options: PickerOption[];
};

export type PickerViewProps = {
  /** One or more columns. */
  columns: PickerColumnConfig[] | PickerOption[][];
  /** Selected values per column. */
  value?: string[];
  defaultValue?: string[];
  onChange?: (values: string[], indexes: number[]) => void;
  itemHeight?: number;
  visibleCount?: number;
  theme?: Partial<UiTheme>;
  style?: StyleProp<ViewStyle>;
};

function normalizeColumns(
  columns: PickerViewProps["columns"],
): PickerColumnConfig[] {
  if (columns.length === 0) return [];
  const first = columns[0] as PickerColumnConfig | PickerOption[];
  if (Array.isArray(first)) {
    return (columns as PickerOption[][]).map((options, i) => ({
      key: String(i),
      options,
    }));
  }
  return columns as PickerColumnConfig[];
}

export function PickerView({
  columns: columnsProp,
  value: valueProp,
  defaultValue,
  onChange,
  itemHeight,
  visibleCount,
  theme,
  style,
}: PickerViewProps) {
  const columns = normalizeColumns(columnsProp);
  const fallback = useMemo(
    () =>
      defaultValue ??
      columns.map((c) => c.options.find((o) => !o.disabled)?.value ?? ""),
    // only seed once from columns shape
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  const [values, setValues] = useControllableState(
    valueProp,
    fallback,
    (next) => {
      const indexes = next.map((v, i) =>
        Math.max(0, columns[i]?.options.findIndex((o) => o.value === v) ?? 0),
      );
      onChange?.(next, indexes);
    },
  );

  const handleChange = (colIndex: number, next: string) => {
    setValues(values.map((v, i) => (i === colIndex ? next : v)));
  };

  return (
    <View style={[styles.row, style]}>
      {columns.map((col, i) => (
        <PickerColumn
          key={col.key ?? String(i)}
          options={col.options}
          value={values[i]}
          onChange={(v) => handleChange(i, v)}
          itemHeight={itemHeight}
          visibleCount={visibleCount}
          theme={theme}
          style={styles.col}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "stretch",
  },
  col: {
    flex: 1,
  },
});
