import { useCallback, useMemo, useRef, useState, type ReactNode } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { useResolvedTheme } from "../../../theme/ThemeProvider";
import type { UiTheme } from "../../../theme/types";
import { Popup } from "../popup";

export type DropdownOption = {
  label: string;
  value: string | number;
  disabled?: boolean;
};

export type DropdownItemConfig = {
  /** Stable id for this menu column. */
  key: string;
  /** Override bar title; defaults to the selected option label. */
  title?: string;
  value: string | number;
  options?: DropdownOption[];
  disabled?: boolean;
  onChange?: (value: string | number) => void;
  /** Custom panel content. Call `close` when done. */
  renderPanel?: (ctx: { close: () => void }) => ReactNode;
};

export type DropdownMenuProps = {
  items: DropdownItemConfig[];
  /** Expand direction. */
  direction?: "down" | "up";
  /** Show dimmed mask. Default true. */
  overlay?: boolean;
  /** Close when mask is pressed. Default true. */
  closeOnMaskPress?: boolean;
  theme?: Partial<UiTheme>;
  style?: StyleProp<ViewStyle>;
};

type Anchor = { x: number; y: number; width: number; height: number };

function Caret({ pointUp, color }: { pointUp: boolean; color: string }) {
  return (
    <View
      style={[
        styles.caret,
        pointUp
          ? {
              borderBottomWidth: 5,
              borderBottomColor: color,
              borderTopWidth: 0,
            }
          : {
              borderTopWidth: 5,
              borderTopColor: color,
              borderBottomWidth: 0,
            },
      ]}
    />
  );
}

/**
 * Dropdown filter bar.
 * Panel + mask are hosted by Popup; bar replica floats via `floating`.
 */
export function DropdownMenu({
  items,
  direction = "down",
  overlay = true,
  closeOnMaskPress = true,
  theme: themeOverride,
  style,
}: DropdownMenuProps) {
  const palette = useResolvedTheme(themeOverride);
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();
  const barRef = useRef<View>(null);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [anchor, setAnchor] = useState<Anchor>({
    x: 0,
    y: 0,
    width: windowWidth,
    height: 48,
  });

  const close = useCallback(() => setActiveKey(null), []);

  const measureBar = useCallback((cb?: () => void) => {
    barRef.current?.measureInWindow((x, y, width, height) => {
      setAnchor({ x, y, width, height });
      cb?.();
    });
  }, []);

  const toggle = useCallback(
    (key: string) => {
      measureBar(() => {
        setActiveKey((prev) => (prev === key ? null : key));
      });
    },
    [measureBar],
  );

  const activeItem = useMemo(
    () => items.find((it) => it.key === activeKey) ?? null,
    [items, activeKey],
  );
  const open = activeItem != null;
  const panelMaxHeight = Math.round(windowHeight * 0.45);

  const titleFor = (item: DropdownItemConfig) => {
    if (item.title) return item.title;
    const hit = item.options?.find((o) => o.value === item.value);
    return hit?.label ?? String(item.value);
  };

  const onBarLayout = (_e: LayoutChangeEvent) => {
    if (open) measureBar();
  };

  const renderBar = (inModal: boolean) => (
    <View
      ref={inModal ? undefined : barRef}
      collapsable={false}
      onLayout={inModal ? undefined : onBarLayout}
      style={[
        styles.bar,
        {
          backgroundColor: palette.card,
          borderBottomColor: palette.border,
          borderTopColor: palette.border,
          width: inModal ? anchor.width : "100%",
        },
      ]}
    >
      {items.map((item) => {
        const active = activeKey === item.key;
        const disabled = item.disabled === true;
        const color = disabled
          ? palette.muted
          : active
            ? palette.primary
            : palette.text;
        const pointUp = direction === "down" ? active : !active;
        return (
          <Pressable
            key={item.key}
            accessibilityRole="button"
            accessibilityState={{ disabled, expanded: active }}
            disabled={disabled}
            onPress={() => toggle(item.key)}
            style={({ pressed }) => [
              styles.titleBtn,
              { opacity: disabled ? 0.45 : pressed ? 0.7 : 1 },
            ]}
          >
            <Text style={[styles.titleText, { color }]} numberOfLines={1}>
              {titleFor(item)}
            </Text>
            <Caret pointUp={pointUp} color={color} />
          </Pressable>
        );
      })}
    </View>
  );

  const panel = (
    <View
      style={[
        styles.panel,
        {
          backgroundColor: palette.card,
          maxHeight: panelMaxHeight,
          width: windowWidth,
        },
      ]}
    >
      {activeItem?.renderPanel ? (
        activeItem.renderPanel({ close })
      ) : (
        <ScrollView bounces={false} keyboardShouldPersistTaps="handled">
          {(activeItem?.options ?? []).map((opt) => {
            const selected = opt.value === activeItem?.value;
            const optDisabled = opt.disabled === true;
            return (
              <Pressable
                key={String(opt.value)}
                accessibilityRole="button"
                accessibilityState={{ selected, disabled: optDisabled }}
                disabled={optDisabled}
                onPress={() => {
                  if (optDisabled) return;
                  activeItem?.onChange?.(opt.value);
                  close();
                }}
                style={({ pressed }) => [
                  styles.option,
                  {
                    borderBottomColor: palette.border,
                    opacity: optDisabled ? 0.4 : pressed ? 0.7 : 1,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.optionLabel,
                    {
                      color: selected ? palette.primary : palette.text,
                      fontWeight: selected ? "600" : "400",
                    },
                  ]}
                >
                  {opt.label}
                </Text>
                {selected ? (
                  <Text style={[styles.check, { color: palette.primary }]}>
                    ✓
                  </Text>
                ) : null}
              </Pressable>
            );
          })}
        </ScrollView>
      )}
    </View>
  );

  return (
    <View style={[styles.root, style]} collapsable={false}>
      <View
        style={{ opacity: open ? 0 : 1 }}
        pointerEvents={open ? "none" : "auto"}
      >
        {renderBar(false)}
      </View>

      <Popup
        visible={open}
        onClose={close}
        position={direction === "down" ? "top" : "bottom"}
        anchor={{ y: anchor.y, height: anchor.height }}
        overlay={overlay}
        closeOnMaskPress={closeOnMaskPress}
        animation="none"
        bare
        theme={themeOverride}
        floating={
          <View
            style={[
              styles.barFloat,
              {
                top: anchor.y,
                left: anchor.x,
                width: anchor.width,
              },
            ]}
          >
            {renderBar(true)}
          </View>
        }
      >
        {panel}
      </Popup>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    zIndex: 20,
    position: "relative",
  },
  bar: {
    flexDirection: "row",
    minHeight: 48,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  titleBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingHorizontal: 8,
    minHeight: 48,
  },
  titleText: {
    fontSize: 15,
    fontWeight: "500",
    maxWidth: "85%",
  },
  caret: {
    width: 0,
    height: 0,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
  },
  barFloat: {
    position: "absolute",
    zIndex: 3,
  },
  panel: {
    overflow: "hidden",
  },
  option: {
    minHeight: 48,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  optionLabel: {
    fontSize: 15,
  },
  check: {
    fontSize: 16,
    fontWeight: "700",
  },
});
