import type { ReactNode } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { OverlayPortal } from "../../../overlay";
import type { OverlayType } from "../../../overlay/types";
import { SafeArea } from "../../layout/safe-area";
import { useResolvedTheme } from "../../../theme/ThemeProvider";
import type { UiTheme } from "../../../theme/types";
import { Backdrop } from "../backdrop";
import { useSlideUpOverlay } from "../useSlideUpOverlay";
import { PopupPanelWrap, roundStyleFor } from "./PopupPanel";
import type {
  PopupAnchor,
  PopupAnimation,
  PopupCloseIconPosition,
  PopupPosition,
} from "./types";

export type {
  PopupAnchor,
  PopupAnimation,
  PopupCloseIconPosition,
  PopupPosition,
} from "./types";

export type PopupProps = {
  visible: boolean;
  onClose: () => void;
  /**
   * Panel placement.
   * With `anchor`: `"top"` docks below the rect, `"bottom"` docks above it.
   * @default "center"
   */
  position?: PopupPosition;
  /** Optional window rect for anchored open (DropdownMenu / Tabs expand). */
  anchor?: PopupAnchor;
  /** Show dimmed mask. @default true */
  overlay?: boolean;
  /** Close when mask is pressed. @default true */
  closeOnMaskPress?: boolean;
  /**
   * Motion. `slide-up` keeps the overlay mounted through the close spring.
   * @default "fade"
   */
  animation?: PopupAnimation;
  /** Rounded corners. @default false */
  round?: boolean;
  /** Show close (×) control. @default false */
  closeable?: boolean;
  /** Close icon corner. @default "top-right" */
  closeIconPosition?: PopupCloseIconPosition;
  /**
   * When true, children are positioned as-is (no card chrome).
   * Semantic overlays (Dialog / sheets) should set this.
   * @default false
   */
  bare?: boolean;
  /**
   * Extra nodes inside the overlay shell (e.g. DropdownMenu bar replica).
   * Painted above the mask.
   */
  floating?: ReactNode;
  /**
   * OverlayStack level type. Dialog uses `"Dialog"` (2000); sheets stay `"Popup"`.
   * @default "Popup"
   */
  overlayType?: OverlayType;
  /**
   * Reserve top/bottom safe-area on edge-docked panels (no `anchor`).
   * @default true for non-bare `top` | `bottom`; bare sheets embed SafeArea themselves
   */
  safeArea?: boolean;
  children?: ReactNode;
  theme?: Partial<UiTheme>;
  style?: StyleProp<ViewStyle>;
};

/**
 * Shared overlay shell: OverlayStack + Backdrop + position.
 * Semantic layers (Dialog / BottomSheet / ActionSheet / DropdownMenu) compose on top.
 */
export function Popup({
  visible,
  onClose,
  position = "center",
  anchor,
  overlay = true,
  closeOnMaskPress = true,
  animation = "fade",
  round = false,
  closeable = false,
  closeIconPosition = "top-right",
  bare = false,
  floating,
  overlayType = "Popup",
  safeArea,
  children,
  theme: themeOverride,
  style,
}: PopupProps) {
  const palette = useResolvedTheme(themeOverride);
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();
  const slide = useSlideUpOverlay(animation === "slide-up" ? visible : false);

  const useSlide = animation === "slide-up";
  const portalVisible = useSlide ? slide.mounted : visible;
  const pointerOpen = useSlide ? visible : true;
  const edgeDock =
    (position === "top" || position === "bottom") && anchor == null;
  // Bare sheets (BottomSheet / ActionSheet) paint their own chrome — they
  // should embed SafeArea inside. Non-bare edge docks get padding here.
  const useSafeArea = safeArea ?? (edgeDock && !bare);

  const onMaskPress = closeOnMaskPress
    ? () => {
        // Overlay unmounts before the gesture fully ends; defer so the same tap
        // cannot activate Pressables that were under the overlay (e.g. the
        // position grid that opened this popup — felt like needing 2 taps).
        setTimeout(onClose, 50);
      }
    : undefined;

  const roundStyle = round ? roundStyleFor(position) : null;
  const sizeStyle =
    position === "center"
      ? styles.panelCenter
      : position === "left" || position === "right"
        ? styles.panelSide
        : { width: windowWidth };

  const panelStyle: StyleProp<ViewStyle> = bare
    ? [roundStyle, style]
    : [
        styles.panelChrome,
        { backgroundColor: palette.card },
        sizeStyle,
        roundStyle,
        style,
      ];

  let panelInner: ReactNode =
    bare && style == null && !round && !closeable ? (
      children
    ) : (
      <View
        style={panelStyle}
        // Absorb presses on the panel so they never reach the mask.
        onStartShouldSetResponder={() => true}
      >
        {[
          closeable ? (
            <Pressable
              key="close"
              accessibilityRole="button"
              accessibilityLabel="Close"
              hitSlop={8}
              onPress={onClose}
              style={[
                styles.closeBtn,
                closeIconPosition === "top-left"
                  ? styles.closeBtnLeft
                  : styles.closeBtnRight,
                { backgroundColor: palette.surface },
              ]}
            >
              <Text style={[styles.closeGlyph, { color: palette.muted }]}>
                ×
              </Text>
            </Pressable>
          ) : null,
          children,
        ]}
      </View>
    );

  // Extend panel chrome into the inset so home-indicator / notch stay covered.
  if (useSafeArea && position === "top") {
    panelInner = (
      <SafeArea
        position="top"
        style={bare ? undefined : { backgroundColor: palette.card }}
      >
        {panelInner}
      </SafeArea>
    );
  } else if (useSafeArea && position === "bottom") {
    panelInner = (
      <SafeArea
        position="bottom"
        style={bare ? undefined : { backgroundColor: palette.card }}
      >
        {panelInner}
      </SafeArea>
    );
  }

  const showMask =
    overlay || useSlide || (closeOnMaskPress && onMaskPress != null);

  let maskStyle: StyleProp<Animated.WithAnimatedValue<ViewStyle>> | undefined;
  if (anchor && position === "top") {
    const top = anchor.y + anchor.height;
    maskStyle = { top, height: Math.max(0, windowHeight - top) };
  } else if (anchor && position === "bottom") {
    maskStyle = { top: 0, height: Math.max(0, anchor.y) };
  }
  if (useSlide) {
    maskStyle = [maskStyle, { opacity: slide.maskOpacity }];
  }

  const body = (
    <View
      style={styles.root}
      pointerEvents={pointerOpen ? "auto" : "none"}
    >
      {[
        <View key="mask" collapsable={false} style={styles.maskHost}>
          {showMask ? (
            <Backdrop
              visible
              onPress={onMaskPress}
              color={overlay ? "black" : "transparent"}
              theme={themeOverride}
              style={maskStyle}
              pointerEvents={onMaskPress ? "auto" : "none"}
            />
          ) : null}
        </View>,
        floating ? (
          <View key="floating" style={styles.floating} pointerEvents="box-none">
            {floating}
          </View>
        ) : null,
        <View
          key="panel"
          collapsable={false}
          style={styles.panelHost}
          pointerEvents="box-none"
        >
          <PopupPanelWrap
            position={position}
            anchor={anchor}
            windowHeight={windowHeight}
            useSlide={useSlide}
            translateY={slide.translateY}
            onSheetLayout={slide.onSheetLayout}
          >
            {panelInner}
          </PopupPanelWrap>
        </View>,
      ]}
    </View>
  );

  return (
    <OverlayPortal
      visible={portalVisible}
      options={{
        type: overlayType,
        hasMask: false,
        closeOnMask: false,
        dismissOnBack: true,
        pointerEvents: "box-none",
      }}
      onDismiss={onClose}
    >
      {body}
    </OverlayPortal>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFill,
  },
  maskHost: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 0,
  },
  panelHost: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 2,
  },
  floating: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 3,
  },
  panelChrome: {
    overflow: "hidden",
  },
  panelCenter: {
    maxWidth: 320,
    width: "100%",
    borderRadius: 12,
  },
  panelSide: {
    height: "100%",
  },
  closeBtn: {
    position: "absolute",
    top: 12,
    zIndex: 2,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  closeBtnRight: {
    right: 12,
  },
  closeBtnLeft: {
    left: 12,
  },
  closeGlyph: {
    fontSize: 20,
    lineHeight: 22,
    fontWeight: "400",
  },
});
