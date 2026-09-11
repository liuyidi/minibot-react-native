import { useEffect, useRef, useState } from "react";
import {
  Animated,
  useWindowDimensions,
  type LayoutChangeEvent,
} from "react-native";

/**
 * Panel spring (mass 0.4 / tension 300 / friction 30 → overdamped, soft settle).
 */
const SPRING = {
  mass: 0.4,
  stiffness: 300,
  damping: 30,
  overshootClamping: true,
  restDisplacementThreshold: 0.5,
  restSpeedThreshold: 0.5,
  useNativeDriver: true,
} as const;

/** Mask fade on close only — appear stays instant. */
const MASK_CLOSE_MS = 250;
/** Fallback so Modal always unmounts even if spring never reports finished. */
const CLOSE_UNMOUNT_MS = 420;

/**
 * Instant mask + spring-slide panel.
 * Modal: `animationType="none"`, `visible={mounted}`.
 * Sheet: `onLayout={onSheetLayout}`, `transform: [{ translateY }]`.
 * Mask: `opacity: maskOpacity` (instant in, fades with panel out).
 */
export function useSlideUpOverlay(visible: boolean) {
  const { height: windowHeight } = useWindowDimensions();
  const [mounted, setMounted] = useState(visible);
  const translateY = useRef(new Animated.Value(visible ? 0 : windowHeight))
    .current;
  const maskOpacity = useRef(new Animated.Value(visible ? 1 : 0)).current;
  const windowHeightRef = useRef(windowHeight);
  const panelHeightRef = useRef(0);
  const wasVisible = useRef(visible);
  const pendingOpen = useRef(false);
  windowHeightRef.current = windowHeight;

  const offscreenY = () => {
    const panel = panelHeightRef.current;
    return panel > 0 ? panel + 48 : windowHeightRef.current;
  };

  const runOpen = () => {
    maskOpacity.setValue(1);
    translateY.setValue(offscreenY());
    Animated.spring(translateY, { toValue: 0, ...SPRING }).start();
  };

  useEffect(() => {
    if (visible) {
      setMounted(true);
      if (!wasVisible.current) {
        maskOpacity.setValue(1);
        translateY.setValue(offscreenY());
        if (panelHeightRef.current > 0) {
          runOpen();
        } else {
          pendingOpen.current = true;
        }
      }
      wasVisible.current = true;
      return;
    }

    if (!wasVisible.current) return;
    wasVisible.current = false;
    pendingOpen.current = false;

    let cancelled = false;
    const unmount = () => {
      if (!cancelled) setMounted(false);
    };

    Animated.parallel([
      Animated.spring(translateY, {
        toValue: offscreenY(),
        ...SPRING,
      }),
      Animated.timing(maskOpacity, {
        toValue: 0,
        duration: MASK_CLOSE_MS,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Always unmount when the close animation ends. Relying on `finished`
      // alone can leave an invisible Modal that swallows taps to Open.
      unmount();
    });

    const fallback = setTimeout(unmount, CLOSE_UNMOUNT_MS);
    return () => {
      cancelled = true;
      clearTimeout(fallback);
    };
  }, [visible, translateY, maskOpacity]);

  const onSheetLayout = (e: LayoutChangeEvent) => {
    const h = e.nativeEvent.layout.height;
    if (h <= 0) return;
    panelHeightRef.current = h;
    if (pendingOpen.current) {
      pendingOpen.current = false;
      runOpen();
    }
  };

  return { mounted, translateY, maskOpacity, onSheetLayout };
}
