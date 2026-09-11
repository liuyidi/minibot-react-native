import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Animated,
  Easing,
  Pressable,
  Text,
  View,
  StyleSheet,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { X } from "lucide-react-native";

import { Icon } from "../../foundation/icon";
import { useResolvedTheme } from "../../../theme/ThemeProvider";
import type { UiTheme } from "../../../theme/types";

export type NoticeBarVariant = "default" | "success" | "warning" | "danger";

export type NoticeBarProps = {
  text: ReactNode;
  /** Leading icon / emoji node. */
  icon?: ReactNode;
  variant?: NoticeBarVariant;
  /** Horizontal marquee when text overflows. @default false */
  scrollable?: boolean;
  /** Show close control. */
  closeable?: boolean;
  onClose?: () => void;
  onPress?: () => void;
  theme?: Partial<UiTheme>;
  style?: StyleProp<ViewStyle>;
};

function tone(
  variant: NoticeBarVariant,
  palette: UiTheme,
): { bg: string; fg: string } {
  switch (variant) {
    case "success":
      return { bg: "rgba(34,197,94,0.12)", fg: palette.green };
    case "warning":
      return { bg: "rgba(234,179,8,0.14)", fg: palette.yellow };
    case "danger":
      return { bg: "rgba(239,68,68,0.12)", fg: palette.red };
    default:
      return { bg: "rgba(37,99,235,0.1)", fg: palette.primary };
  }
}

export function NoticeBar({
  text,
  icon,
  variant = "default",
  scrollable = false,
  closeable = false,
  onClose,
  onPress,
  theme: themeOverride,
  style,
}: NoticeBarProps) {
  const palette = useResolvedTheme(themeOverride);
  const { bg, fg } = tone(variant, palette);
  const [visible, setVisible] = useState(true);
  const tx = useRef(new Animated.Value(0)).current;
  const viewport = useRef(0);
  const contentW = useRef(0);

  useEffect(() => {
    if (!scrollable) return;
    tx.stopAnimation();
    tx.setValue(0);
    if (contentW.current <= viewport.current || viewport.current <= 0) return;
    const distance = contentW.current + 24;
    const loop = Animated.loop(
      Animated.timing(tx, {
        toValue: -distance,
        duration: Math.max(6000, distance * 20),
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [scrollable, text, tx]);

  if (!visible) return null;

  const body =
    typeof text === "string" || typeof text === "number" ? (
      <Text style={[styles.text, { color: fg }]} numberOfLines={scrollable ? 1 : 3}>
        {text}
      </Text>
    ) : (
      text
    );

  return (
    <Pressable
      disabled={!onPress}
      onPress={onPress}
      style={[styles.bar, { backgroundColor: bg }, style]}
    >
      {icon ? <View style={styles.icon}>{icon}</View> : null}
      <View
        style={styles.viewport}
        onLayout={(e: LayoutChangeEvent) => {
          viewport.current = e.nativeEvent.layout.width;
        }}
      >
        {scrollable ? (
          <Animated.View
            style={{ flexDirection: "row", transform: [{ translateX: tx }] }}
            onLayout={(e) => {
              contentW.current = e.nativeEvent.layout.width;
            }}
          >
            {body}
            <View style={{ width: 24 }} />
            {body}
          </Animated.View>
        ) : (
          body
        )}
      </View>
      {closeable ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close"
          hitSlop={8}
          onPress={() => {
            setVisible(false);
            onClose?.();
          }}
          style={styles.close}
        >
          <Icon icon={X} size={16} color={fg} />
        </Pressable>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 8,
    borderRadius: 8,
  },
  icon: {
    marginTop: 1,
  },
  viewport: {
    flex: 1,
    overflow: "hidden",
  },
  text: {
    fontSize: 13,
    lineHeight: 18,
  },
  close: {
    padding: 2,
  },
});
