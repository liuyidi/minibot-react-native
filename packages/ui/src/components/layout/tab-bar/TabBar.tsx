import type { ReactNode } from "react";
import {
  Pressable,
  Text,
  View,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { useResolvedTheme } from "../../../theme/ThemeProvider";
import type { UiTheme } from "../../../theme/types";
import { useControllableState } from "../../../utils/useControllableState";
import { SafeArea } from "../safe-area";

export type TabBarItem = {
  key: string;
  label: string;
  /** Idle icon. */
  icon?: ReactNode;
  /** Active icon; falls back to `icon`. */
  activeIcon?: ReactNode;
  /** Optional badge text (e.g. "3" / "99+"). */
  badge?: string | number;
  disabled?: boolean;
};

export type TabBarProps = {
  items: TabBarItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (key: string) => void;
  /** Reserve home-indicator inset. @default true */
  safeArea?: boolean;
  theme?: Partial<UiTheme>;
  style?: StyleProp<ViewStyle>;
};

/**
 * Bottom app tab bar (shell). Pair with screen routers; does not own navigation.
 */
export function TabBar({
  items,
  value: valueProp,
  defaultValue,
  onChange,
  safeArea = true,
  theme: themeOverride,
  style,
}: TabBarProps) {
  const palette = useResolvedTheme(themeOverride);
  const fallback = defaultValue ?? items[0]?.key ?? "";
  const [value, setValue] = useControllableState(valueProp, fallback, onChange);

  const bar = (
    <View
      style={[
        styles.bar,
        {
          backgroundColor: palette.card,
          borderTopColor: palette.border,
        },
        style,
      ]}
    >
      {items.map((item) => {
        const active = item.key === value;
        const tone = active ? palette.primary : palette.muted;
        const glyph = active ? (item.activeIcon ?? item.icon) : item.icon;
        return (
          <Pressable
            key={item.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: active, disabled: item.disabled }}
            disabled={item.disabled}
            onPress={() => setValue(item.key)}
            style={({ pressed }) => [
              styles.item,
              { opacity: item.disabled ? 0.4 : pressed ? 0.7 : 1 },
            ]}
          >
            <View style={styles.iconWrap}>
              {glyph}
              {item.badge != null && String(item.badge).length > 0 ? (
                <View
                  style={[styles.badge, { backgroundColor: palette.red }]}
                >
                  <Text style={styles.badgeText} numberOfLines={1}>
                    {item.badge}
                  </Text>
                </View>
              ) : null}
            </View>
            <Text style={[styles.label, { color: tone }]} numberOfLines={1}>
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );

  if (!safeArea) return bar;
  return (
    <SafeArea position="bottom" style={{ backgroundColor: palette.card }}>
      {bar}
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    borderTopWidth: StyleSheet.hairlineWidth,
    minHeight: 52,
    paddingTop: 6,
    paddingBottom: 4,
  },
  item: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    paddingHorizontal: 4,
  },
  iconWrap: {
    width: 28,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -10,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    paddingHorizontal: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
    lineHeight: 12,
  },
  label: {
    fontSize: 11,
    fontWeight: "500",
    lineHeight: 14,
  },
});
