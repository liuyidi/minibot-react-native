import type { ReactNode } from "react";
import {
  Animated,
  StyleSheet,
  View,
  type LayoutChangeEvent,
} from "react-native";

import type { PopupAnchor, PopupPosition } from "./types";

export type PopupPanelWrapProps = {
  position: PopupPosition;
  anchor?: PopupAnchor;
  windowHeight: number;
  useSlide: boolean;
  translateY: Animated.Value;
  onSheetLayout: (e: LayoutChangeEvent) => void;
  children: ReactNode;
};

/** Positions the panel for edge / center / anchored layouts. */
export function PopupPanelWrap({
  position,
  anchor,
  windowHeight,
  useSlide,
  translateY,
  onSheetLayout,
  children,
}: PopupPanelWrapProps) {
  if (position === "center") {
    return (
      <View style={styles.centerWrap} pointerEvents="box-none">
        {children}
      </View>
    );
  }

  if (position === "left") {
    return <View style={styles.leftWrap}>{children}</View>;
  }

  if (position === "right") {
    return <View style={styles.rightWrap}>{children}</View>;
  }

  if (position === "top") {
    const top = anchor ? anchor.y + anchor.height : 0;
    return (
      <View style={[styles.topPanelWrap, { top }]} pointerEvents="box-none">
        {children}
      </View>
    );
  }

  // bottom
  if (anchor) {
    return (
      <View
        style={[
          styles.bottomAnchoredWrap,
          { bottom: windowHeight - anchor.y },
        ]}
        pointerEvents="box-none"
      >
        {children}
      </View>
    );
  }

  if (useSlide) {
    return (
      <Animated.View
        onLayout={onSheetLayout}
        pointerEvents="box-none"
        style={[styles.bottomSlideWrap, { transform: [{ translateY }] }]}
      >
        {children}
      </Animated.View>
    );
  }

  return (
    <View style={styles.bottomSlideWrap} pointerEvents="box-none">
      {children}
    </View>
  );
}

export function roundStyleFor(position: PopupPosition) {
  switch (position) {
    case "bottom":
      return { borderTopLeftRadius: 16, borderTopRightRadius: 16 };
    case "top":
      return { borderBottomLeftRadius: 16, borderBottomRightRadius: 16 };
    case "left":
      return { borderTopRightRadius: 16, borderBottomRightRadius: 16 };
    case "right":
      return { borderTopLeftRadius: 16, borderBottomLeftRadius: 16 };
    case "center":
    default:
      return { borderRadius: 16 };
  }
}

const styles = StyleSheet.create({
  topPanelWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 2,
  },
  bottomAnchoredWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 2,
  },
  bottomSlideWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
    // If Yoga stretches this wrap to the panel host height, keep the sheet docked
    // to the bottom instead of packing from the top / looking full-bleed.
    justifyContent: "flex-end",
  },
  leftWrap: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    zIndex: 2,
  },
  rightWrap: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 2,
  },
  centerWrap: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
    paddingHorizontal: 24,
  },
});
