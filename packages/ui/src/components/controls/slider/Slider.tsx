import CommunitySlider from "@react-native-community/slider";
import { useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { useResolvedTheme } from "../../../theme/ThemeProvider";
import type { UiTheme } from "../../../theme/types";

export type SliderProps = {
  /** Controlled value. */
  value?: number;
  /** Uncontrolled initial value. @default min */
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  /** Draw tick marks on the track (requires `step`). Uses overlay, not StepMarker. */
  ticks?: boolean;
  disabled?: boolean;
  /** iOS: tap track to seek. */
  tapToSeek?: boolean;
  onSlidingStart?: (value: number) => void;
  onSlidingComplete?: (value: number) => void;
  theme?: Partial<UiTheme>;
  style?: StyleProp<ViewStyle>;
};

/** Native thumb diameter — also used as horizontal inset for tick alignment. */
const THUMB_SIZE = 16;
const SLIDER_HEIGHT = 40;

/** Snap to nearest step when ticks are enabled. */
export function snapSliderValue(
  value: number,
  min: number,
  max: number,
  step?: number,
): number {
  const clamped = Math.min(max, Math.max(min, value));
  if (step == null || step <= 0) return clamped;
  const steps = Math.round((clamped - min) / step);
  const snapped = min + steps * step;
  const precision = Math.max(0, String(step).split(".")[1]?.length ?? 0);
  const rounded =
    precision > 0 ? Number(snapped.toFixed(precision)) : Math.round(snapped);
  return Math.min(max, Math.max(min, rounded));
}

function TickRail({
  min,
  max,
  step,
  color,
}: {
  min: number;
  max: number;
  step: number;
  color: string;
}) {
  const points = useMemo(() => {
    const out: number[] = [];
    const count = Math.floor((max - min) / step);
    for (let i = 0; i <= count; i += 1) {
      out.push(snapSliderValue(min + i * step, min, max, step));
    }
    return out;
  }, [min, max, step]);

  return (
    <View pointerEvents="none" style={styles.tickRail}>
      {points.map((v) => {
        const pct = max === min ? 0 : ((v - min) / (max - min)) * 100;
        return (
          <View
            key={v}
            style={[
              styles.tick,
              {
                left: `${pct}%`,
                backgroundColor: color,
              },
            ]}
          />
        );
      })}
    </View>
  );
}

/**
 * Themed wrapper around `@react-native-community/slider`.
 *
 * `value` is write-only on the native side: if parent re-renders during a drag
 * while we still pass the press-down value, iOS yanks the thumb back (feels like
 * rubber-banding on tick steps). Keep `nativeValue` in sync with the live thumb.
 * Ticks are an overlay so the native thumb stays in sync with the fill.
 */
export function Slider({
  value: valueProp,
  defaultValue,
  onValueChange,
  min = 0,
  max = 1,
  step,
  ticks = false,
  disabled,
  tapToSeek = true,
  onSlidingStart,
  onSlidingComplete,
  theme: themeOverride,
  style,
}: SliderProps) {
  const palette = useResolvedTheme(themeOverride);
  const slidingRef = useRef(false);
  const controlled = valueProp !== undefined;
  const initial = snapSliderValue(
    valueProp ?? defaultValue ?? min,
    min,
    max,
    step,
  );
  const [inner, setInner] = useState(initial);
  const value = controlled ? valueProp : inner;
  const [nativeValue, setNativeValue] = useState(initial);

  useEffect(() => {
    if (slidingRef.current) return;
    setNativeValue(snapSliderValue(value, min, max, step));
  }, [value, min, max, step]);

  const showTicks = ticks && step != null && step > 0;

  const emit = (raw: number) => {
    const snapped = snapSliderValue(raw, min, max, step);
    setNativeValue((prev) => (prev === snapped ? prev : snapped));
    if (!controlled) setInner(snapped);
    onValueChange?.(snapped);
    return snapped;
  };

  return (
    <View style={[styles.wrap, style]}>
      {showTicks ? (
        <TickRail min={min} max={max} step={step} color={palette.border} />
      ) : null}
      <CommunitySlider
        value={nativeValue}
        minimumValue={min}
        maximumValue={max}
        step={step && step > 0 ? step : undefined}
        disabled={disabled}
        tapToSeek={tapToSeek}
        minimumTrackTintColor={palette.primary}
        maximumTrackTintColor={palette.border}
        thumbTintColor={palette.primary}
        thumbSize={THUMB_SIZE}
        style={styles.slider}
        onSlidingStart={(v) => {
          slidingRef.current = true;
          onSlidingStart?.(emit(v));
        }}
        onValueChange={(v) => {
          emit(v);
        }}
        onSlidingComplete={(v) => {
          const snapped = emit(v);
          slidingRef.current = false;
          onSlidingComplete?.(snapped);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: "100%",
    height: SLIDER_HEIGHT,
    justifyContent: "center",
  },
  slider: {
    width: "100%",
    height: SLIDER_HEIGHT,
  },
  tickRail: {
    ...StyleSheet.absoluteFill,
    // Match native thumb travel inset so ticks line up with stop points.
    left: THUMB_SIZE / 2,
    right: THUMB_SIZE / 2,
    justifyContent: "center",
  },
  tick: {
    position: "absolute",
    width: 2,
    height: 8,
    marginLeft: -1,
    borderRadius: 1,
  },
});
