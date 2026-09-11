import { useEffect, useRef, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { useResolvedTheme } from "../../../theme/ThemeProvider";
import type { UiTheme } from "../../../theme/types";

const LONG_PRESS_START_MS = 300;
const LONG_PRESS_INTERVAL_MS = 100;
const BTN = 28;
const INPUT_W = 36;

export type StepperProps = {
  /** Controlled value. */
  value?: number;
  /** Uncontrolled initial value. @default 1 */
  defaultValue?: number;
  /** @default 1 */
  min?: number;
  max?: number;
  /** @default 1 */
  step?: number;
  /** Only allow integers. @default false */
  integer?: boolean;
  disabled?: boolean;
  disablePlus?: boolean;
  disableMinus?: boolean;
  /** Middle field is read-only; +/- still work. @default false */
  disableInput?: boolean;
  /** Hold +/- to keep stepping. @default true */
  longPress?: boolean;
  onChange?: (value: number) => void;
  theme?: Partial<UiTheme>;
  style?: StyleProp<ViewStyle>;
};

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

/** Avoid float drift: 0.1 + 0.2 style errors when stepping. */
function formatStep(n: number, step: number, integer: boolean) {
  if (integer) return Math.round(n);
  const decimals = (() => {
    const s = String(step);
    const i = s.indexOf(".");
    return i === -1 ? 0 : s.length - i - 1;
  })();
  const f = Number(n.toFixed(decimals));
  return Object.is(f, -0) ? 0 : f;
}

function parseInput(text: string, integer: boolean): number | null {
  const t = text.trim();
  if (t === "" || t === "-" || t === "." || t === "-.") return null;
  const n = Number(t);
  if (!Number.isFinite(n)) return null;
  return integer ? Math.trunc(n) : n;
}

/**
 * Numeric stepper: minus / input / plus.
 */
export function Stepper({
  value: valueProp,
  defaultValue = 1,
  min = 1,
  max = Number.MAX_SAFE_INTEGER,
  step = 1,
  integer = false,
  disabled = false,
  disablePlus = false,
  disableMinus = false,
  disableInput = false,
  longPress = true,
  onChange,
  theme: themeOverride,
  style,
}: StepperProps) {
  const palette = useResolvedTheme(themeOverride);
  const controlled = valueProp !== undefined;
  const [inner, setInner] = useState(() =>
    formatStep(clamp(defaultValue, min, max), step, integer),
  );
  const value = controlled ? valueProp : inner;

  const [text, setText] = useState(String(value));
  const focused = useRef(false);
  const longTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const didLongPress = useRef(false);
  const valueRef = useRef(value);
  valueRef.current = value;

  useEffect(() => {
    if (!focused.current) setText(String(value));
  }, [value]);

  const clearLongPress = () => {
    if (longTimer.current) {
      clearTimeout(longTimer.current);
      longTimer.current = null;
    }
    if (longInterval.current) {
      clearInterval(longInterval.current);
      longInterval.current = null;
    }
  };

  useEffect(() => {
    return () => {
      clearLongPress();
    };
  }, []);

  const commit = (next: number) => {
    const n = formatStep(clamp(next, min, max), step, integer);
    if (n === valueRef.current) {
      setText(String(n));
      return;
    }
    if (!controlled) setInner(n);
    onChange?.(n);
    setText(String(n));
  };

  const atMin = value <= min;
  const atMax = value >= max;
  const minusDisabled = disabled || disableMinus || atMin;
  const plusDisabled = disabled || disablePlus || atMax;
  const inputLocked = disabled || disableInput;

  const stepBy = (dir: 1 | -1) => {
    if (disabled) return;
    if (dir < 0 && (disableMinus || valueRef.current <= min)) return;
    if (dir > 0 && (disablePlus || valueRef.current >= max)) return;
    commit(valueRef.current + dir * step);
  };

  const startLongPress = (dir: 1 | -1) => {
    if (!longPress) return;
    didLongPress.current = false;
    clearLongPress();
    longTimer.current = setTimeout(() => {
      didLongPress.current = true;
      stepBy(dir);
      longInterval.current = setInterval(() => {
        stepBy(dir);
      }, LONG_PRESS_INTERVAL_MS);
    }, LONG_PRESS_START_MS);
  };

  const onBtnPress = (dir: 1 | -1) => {
    if (didLongPress.current) {
      didLongPress.current = false;
      return;
    }
    stepBy(dir);
  };

  const onBlurInput = () => {
    focused.current = false;
    const parsed = parseInput(text, integer);
    if (parsed == null) {
      setText(String(valueRef.current));
      return;
    }
    commit(parsed);
  };

  const btnBg = palette.surface;
  const btnFg = palette.text;
  const btnMuted = palette.muted;

  return (
    <View style={[styles.root, style]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Decrease"
        disabled={minusDisabled}
        onPress={() => onBtnPress(-1)}
        onPressIn={() => {
          if (!minusDisabled) startLongPress(-1);
        }}
        onPressOut={clearLongPress}
        style={({ pressed }) => [
          styles.btn,
          {
            backgroundColor: btnBg,
            opacity: minusDisabled ? 0.4 : pressed ? 0.75 : 1,
          },
        ]}
      >
        <Text style={[styles.btnGlyph, { color: minusDisabled ? btnMuted : btnFg }]}>
          −
        </Text>
      </Pressable>

      <TextInput
        accessibilityLabel="Value"
        editable={!inputLocked}
        keyboardType={integer ? "number-pad" : "decimal-pad"}
        value={text}
        onFocus={() => {
          focused.current = true;
        }}
        onBlur={onBlurInput}
        onChangeText={(t) => {
          if (inputLocked) return;
          setText(t);
        }}
        onSubmitEditing={onBlurInput}
        selectTextOnFocus
        style={[
          styles.input,
          {
            color: disabled ? btnMuted : palette.text,
            backgroundColor: palette.card,
          },
        ]}
      />

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Increase"
        disabled={plusDisabled}
        onPress={() => onBtnPress(1)}
        onPressIn={() => {
          if (!plusDisabled) startLongPress(1);
        }}
        onPressOut={clearLongPress}
        style={({ pressed }) => [
          styles.btn,
          {
            backgroundColor: btnBg,
            opacity: plusDisabled ? 0.4 : pressed ? 0.75 : 1,
          },
        ]}
      >
        <Text style={[styles.btnGlyph, { color: plusDisabled ? btnMuted : btnFg }]}>
          +
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
  },
  btn: {
    width: BTN,
    height: BTN,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  btnGlyph: {
    fontSize: 18,
    fontWeight: "500",
    lineHeight: 22,
  },
  input: {
    minWidth: INPUT_W,
    height: BTN,
    marginHorizontal: 2,
    paddingHorizontal: 4,
    borderRadius: 4,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "500",
  },
});
