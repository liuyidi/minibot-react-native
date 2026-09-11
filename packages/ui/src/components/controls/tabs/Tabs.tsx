import { useEffect, useRef, type ReactNode } from "react";
import {
  View,
  Pressable,
  Text,
  ScrollView,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
  type LayoutChangeEvent,
} from "react-native";

import { useResolvedTheme } from "../../../theme/ThemeProvider";
import type { UiTheme } from "../../../theme/types";
import { useControllableState } from "../../../utils/useControllableState";

export type TabItem = {
  key: string;
  label: string;
  /** Optional leading icon. */
  icon?: ReactNode;
};

export type TabsProps = {
  items: TabItem[];
  /** Controlled active key. */
  value?: string;
  /** Uncontrolled initial key. Defaults to first item. */
  defaultValue?: string;
  onChange?: (key: string) => void;
  /** Horizontal scroll when many tabs. @default false */
  scrollable?: boolean;
  /**
   * Active indicator: full tab underline vs short bar under label.
   * @default full
   */
  indicator?: "full" | "short";
  /**
   * Trailing header slot (e.g. filter / more icon), fixed outside the
   * scrollable tab list.
   */
  extra?: ReactNode;
  theme?: Partial<UiTheme>;
  style?: StyleProp<ViewStyle>;
};

type TabLayout = { x: number; width: number };

export function Tabs({
  items,
  value: valueProp,
  defaultValue,
  onChange,
  scrollable = false,
  indicator = "full",
  extra,
  theme: themeOverride,
  style,
}: TabsProps) {
  const palette = useResolvedTheme(themeOverride);
  const scrollRef = useRef<ScrollView>(null);
  const tabLayouts = useRef<Record<string, TabLayout>>({});
  const viewportWidth = useRef(0);
  const contentWidth = useRef(0);
  const fallback = defaultValue ?? items[0]?.key ?? "";
  const [value, setValue] = useControllableState(valueProp, fallback, onChange);

  const scrollActiveIntoView = (animated = true) => {
    if (!scrollable) return;
    const layout = tabLayouts.current[value];
    const vw = viewportWidth.current;
    if (!layout || vw <= 0) return;

    const target = layout.x + layout.width / 2 - vw / 2;
    const maxX = Math.max(0, contentWidth.current - vw);
    const x = Math.min(maxX, Math.max(0, target));
    scrollRef.current?.scrollTo({ x, animated });
  };

  useEffect(() => {
    scrollActiveIntoView(true);
    // Only re-center when the active key changes; layout handlers cover mount/resize.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- scrollActiveIntoView reads latest refs
  }, [value]);

  const onViewportLayout = (e: LayoutChangeEvent) => {
    viewportWidth.current = e.nativeEvent.layout.width;
    scrollActiveIntoView(false);
  };

  const onTabLayout = (key: string, e: LayoutChangeEvent) => {
    const { x, width } = e.nativeEvent.layout;
    tabLayouts.current[key] = { x, width };
    if (key === value) {
      scrollActiveIntoView(false);
    }
  };

  const content = items.map((item) => {
    const active = item.key === value;
    const color = active ? palette.primary : palette.textSecondary;
    return (
      <Pressable
        key={item.key}
        accessibilityRole="tab"
        accessibilityState={{ selected: active }}
        onPress={() => setValue(item.key)}
        onLayout={scrollable ? (e) => onTabLayout(item.key, e) : undefined}
        style={({ pressed }) => [
          scrollable ? styles.tabScroll : styles.tabEqual,
          indicator === "full" && {
            borderBottomColor: active ? palette.primary : "transparent",
            borderBottomWidth: 2,
          },
          { opacity: pressed ? 0.75 : 1 },
        ]}
      >
        <View style={styles.tabInner}>
          {item.icon ? <View style={styles.iconSlot}>{item.icon}</View> : null}
          <Text
            style={[
              styles.label,
              {
                color,
                fontWeight: active ? "600" : "400",
              },
            ]}
          >
            {item.label}
          </Text>
        </View>
        {indicator === "short" ? (
          <View
            style={[
              styles.shortBar,
              {
                backgroundColor: active ? palette.primary : "transparent",
              },
            ]}
          />
        ) : null}
      </Pressable>
    );
  });

  const extraNode = extra ? (
    <View style={[styles.extra, { borderLeftColor: palette.border }]}>
      {extra}
    </View>
  ) : null;

  if (scrollable) {
    return (
      <View
        style={[
          styles.bar,
          { borderBottomColor: palette.border },
          style,
        ]}
      >
        <ScrollView
          ref={scrollRef}
          horizontal
          style={styles.scrollFlex}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          onLayout={onViewportLayout}
          onContentSizeChange={(w) => {
            contentWidth.current = w;
            scrollActiveIntoView(false);
          }}
        >
          {content}
        </ScrollView>
        {extraNode}
      </View>
    );
  }

  return (
    <View
      style={[
        styles.bar,
        { borderBottomColor: palette.border },
        style,
      ]}
    >
      <View style={styles.row}>{content}</View>
      {extraNode}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "stretch",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  row: {
    flex: 1,
    flexDirection: "row",
  },
  scrollFlex: {
    flex: 1,
  },
  scrollContent: {
    flexDirection: "row",
    alignItems: "stretch",
    paddingHorizontal: 4,
  },
  tabEqual: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  tabScroll: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: "center",
  },
  tabInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  iconSlot: {
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 15,
  },
  shortBar: {
    marginTop: 6,
    width: 20,
    height: 3,
    borderRadius: 2,
  },
  extra: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    borderLeftWidth: StyleSheet.hairlineWidth,
  },
});
