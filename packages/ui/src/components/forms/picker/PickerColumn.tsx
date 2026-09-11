import { useCallback, useEffect, useMemo, useRef } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  type ListRenderItemInfo,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { useResolvedTheme } from "../../../theme/ThemeProvider";
import type { UiTheme } from "../../../theme/types";
import { useControllableState } from "../../../utils/useControllableState";

export type PickerOption = {
  label: string;
  value: string;
  disabled?: boolean;
};

export type PickerColumnProps = {
  options: PickerOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string, option: PickerOption) => void;
  /** Row height. @default 44 */
  itemHeight?: number;
  /** Visible rows (odd). @default 5 */
  visibleCount?: number;
  theme?: Partial<UiTheme>;
  style?: StyleProp<ViewStyle>;
};

function nearestIndex(offset: number, itemHeight: number, len: number) {
  const i = Math.round(offset / itemHeight);
  return Math.max(0, Math.min(len - 1, i));
}

export function PickerColumn({
  options,
  value: valueProp,
  defaultValue,
  onChange,
  itemHeight = 44,
  visibleCount = 5,
  theme: themeOverride,
  style,
}: PickerColumnProps) {
  const palette = useResolvedTheme(themeOverride);
  const fallback = defaultValue ?? options.find((o) => !o.disabled)?.value ?? "";
  const [value, setValue] = useControllableState(valueProp, fallback, (next) => {
    const opt = options.find((o) => o.value === next);
    if (opt) onChange?.(next, opt);
  });

  const listRef = useRef<FlatList<PickerOption>>(null);
  const pad = Math.floor(visibleCount / 2) * itemHeight;
  const height = itemHeight * visibleCount;

  const index = useMemo(() => {
    const i = options.findIndex((o) => o.value === value);
    return i >= 0 ? i : 0;
  }, [options, value]);

  const scrollToIndex = useCallback(
    (i: number, animated: boolean) => {
      listRef.current?.scrollToOffset({
        offset: i * itemHeight,
        animated,
      });
    },
    [itemHeight],
  );

  useEffect(() => {
    scrollToIndex(index, false);
  }, [index, scrollToIndex]);

  const commitOffset = useCallback(
    (offset: number) => {
      let i = nearestIndex(offset, itemHeight, options.length);
      // Skip disabled: walk to nearest enabled
      if (options[i]?.disabled) {
        let found = -1;
        for (let d = 1; d < options.length; d++) {
          if (options[i + d] && !options[i + d].disabled) {
            found = i + d;
            break;
          }
          if (options[i - d] && !options[i - d].disabled) {
            found = i - d;
            break;
          }
        }
        if (found >= 0) i = found;
      }
      const opt = options[i];
      if (!opt) return;
      scrollToIndex(i, true);
      if (opt.value !== value) setValue(opt.value);
    },
    [itemHeight, options, scrollToIndex, setValue, value],
  );

  const onMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    commitOffset(e.nativeEvent.contentOffset.y);
  };

  const onScrollEndDrag = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    // If no momentum (slow drag), still snap
    const vy = e.nativeEvent.velocity?.y ?? 0;
    if (Math.abs(vy) < 0.05) {
      commitOffset(e.nativeEvent.contentOffset.y);
    }
  };

  const renderItem = ({ item }: ListRenderItemInfo<PickerOption>) => {
    const selected = item.value === value;
    return (
      <View style={[styles.row, { height: itemHeight }]}>
        <Text
          style={[
            styles.label,
            {
              color: item.disabled
                ? palette.muted
                : selected
                  ? palette.heading
                  : palette.textSecondary,
              fontWeight: selected ? "600" : "400",
              opacity: item.disabled ? 0.4 : 1,
            },
          ]}
          numberOfLines={1}
        >
          {item.label}
        </Text>
      </View>
    );
  };

  return (
    <View style={[{ height, overflow: "hidden" }, style]}>
      <View
        pointerEvents="none"
        style={[
          styles.indicator,
          {
            top: pad,
            height: itemHeight,
            backgroundColor: palette.surface,
            borderRadius: 8,
          },
        ]}
      />
      <FlatList
        ref={listRef}
        data={options}
        keyExtractor={(item) => item.value}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        snapToInterval={itemHeight}
        decelerationRate="fast"
        onMomentumScrollEnd={onMomentumEnd}
        onScrollEndDrag={onScrollEndDrag}
        getItemLayout={(_, i) => ({
          length: itemHeight,
          offset: itemHeight * i,
          index: i,
        })}
        contentContainerStyle={{ paddingVertical: pad }}
        style={{ backgroundColor: "transparent" }}
        nestedScrollEnabled
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  label: {
    fontSize: 17,
  },
  indicator: {
    position: "absolute",
    left: 4,
    right: 4,
    zIndex: 0,
  },
});
