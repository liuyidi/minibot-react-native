import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ActivityIndicator,
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { useResolvedTheme } from "../../../theme/ThemeProvider";
import type { UiTheme } from "../../../theme/types";

const TRACK_W = 51;
const TRACK_H = 31;
const THUMB = 27;
const PAD = 2;
const TRAVEL = TRACK_W - THUMB - PAD * 2;

export type SwitchProps = {
  /** Controlled checked state. */
  checked?: boolean;
  /** Uncontrolled initial checked. @default false */
  defaultChecked?: boolean;
  disabled?: boolean;
  /** Shows spinner; also set automatically when `onChange` returns a Promise. */
  loading?: boolean;
  checkedText?: ReactNode;
  uncheckedText?: ReactNode;
  onChange?: (checked: boolean) => void | Promise<void>;
  theme?: Partial<UiTheme>;
  style?: StyleProp<ViewStyle>;
};

/**
 * Custom switch (track + thumb), not the system control.
 */
export function Switch({
  checked: checkedProp,
  defaultChecked = false,
  disabled = false,
  loading: loadingProp = false,
  checkedText,
  uncheckedText,
  onChange,
  theme: themeOverride,
  style,
}: SwitchProps) {
  const palette = useResolvedTheme(themeOverride);
  const controlled = checkedProp !== undefined;
  const [inner, setInner] = useState(defaultChecked);
  const [pending, setPending] = useState(false);
  const checked = controlled ? checkedProp : inner;
  const loading = loadingProp || pending;
  const locked = disabled || loading;

  const anim = useRef(new Animated.Value(checked ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: checked ? 1 : 0,
      useNativeDriver: true,
      bounciness: 0,
      speed: 20,
    }).start();
  }, [anim, checked]);

  const thumbX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, TRAVEL],
  });

  const handlePress = () => {
    if (locked) return;
    const next = !checked;

    const commit = () => {
      if (!controlled) setInner(next);
    };

    const result = onChange?.(next);
    if (result && typeof (result as Promise<void>).then === "function") {
      setPending(true);
      void Promise.resolve(result)
        .then(() => {
          commit();
        })
        .catch(() => {
          /* keep previous checked on reject */
        })
        .finally(() => {
          setPending(false);
        });
      return;
    }

    commit();
  };

  const trackOn = palette.primary;
  const trackOff = palette.border;
  const trackBg = checked ? trackOn : trackOff;

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked, disabled: locked }}
      disabled={locked}
      onPress={handlePress}
      style={({ pressed }) => [
        styles.track,
        {
          backgroundColor: trackBg,
          opacity: disabled ? 0.4 : pressed && !loading ? 0.85 : 1,
        },
        style,
      ]}
    >
      {checked && checkedText != null ? (
        <View style={[styles.innerText, styles.innerTextOn]} pointerEvents="none">
          {typeof checkedText === "string" || typeof checkedText === "number" ? (
            <Text style={[styles.innerLabel, { color: palette.onPrimary }]}>
              {checkedText}
            </Text>
          ) : (
            checkedText
          )}
        </View>
      ) : null}
      {!checked && uncheckedText != null ? (
        <View style={[styles.innerText, styles.innerTextOff]} pointerEvents="none">
          {typeof uncheckedText === "string" ||
          typeof uncheckedText === "number" ? (
            <Text style={[styles.innerLabel, { color: palette.muted }]}>
              {uncheckedText}
            </Text>
          ) : (
            uncheckedText
          )}
        </View>
      ) : null}

      <Animated.View
        style={[
          styles.thumb,
          {
            backgroundColor: palette.card,
            transform: [{ translateX: thumbX }],
          },
        ]}
      >
        {loading ? (
          <ActivityIndicator
            size="small"
            color={checked ? palette.primary : palette.muted}
            style={styles.spinner}
          />
        ) : null}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: TRACK_W,
    height: TRACK_H,
    borderRadius: TRACK_H / 2,
    padding: PAD,
    justifyContent: "center",
    overflow: "hidden",
  },
  thumb: {
    width: THUMB,
    height: THUMB,
    borderRadius: THUMB / 2,
    alignItems: "center",
    justifyContent: "center",
    // iOS-like elevation
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  spinner: {
    transform: [{ scale: 0.7 }],
  },
  innerText: {
    ...StyleSheet.absoluteFill,
    justifyContent: "center",
  },
  innerTextOn: {
    paddingLeft: 8,
    paddingRight: THUMB + 4,
  },
  innerTextOff: {
    paddingLeft: THUMB + 4,
    paddingRight: 8,
    alignItems: "flex-end",
  },
  innerLabel: {
    fontSize: 12,
    fontWeight: "600",
  },
});
