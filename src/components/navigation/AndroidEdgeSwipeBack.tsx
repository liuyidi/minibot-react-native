import { router } from "expo-router";
import { type ReactNode } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";

/** Set true to re-enable Android left-edge swipe-back (kept off — UX not ready). */
export const ANDROID_EDGE_SWIPE_BACK_ENABLED = false;

const EDGE_WIDTH = 28;
const BACK_DISTANCE = 72;
const BACK_VELOCITY = 550;

type AndroidEdgeSwipeBackProps = {
  children: ReactNode;
};

function goBack() {
  if (router.canGoBack()) {
    router.back();
  }
}

/**
 * Native-stack interactive pop is iOS-only (`gestureEnabled`).
 * On Android, recognize a left-edge swipe and pop — same direction as iOS.
 * Currently gated by {@link ANDROID_EDGE_SWIPE_BACK_ENABLED}.
 */
export function AndroidEdgeSwipeBack({ children }: AndroidEdgeSwipeBackProps) {
  if (Platform.OS !== "android" || !ANDROID_EDGE_SWIPE_BACK_ENABLED) {
    return <>{children}</>;
  }

  const pan = Gesture.Pan()
    .activeOffsetX(10)
    .failOffsetY([-24, 24])
    .onEnd((e) => {
      if (e.translationX > BACK_DISTANCE || e.velocityX > BACK_VELOCITY) {
        runOnJS(goBack)();
      }
    });

  return (
    <View style={styles.root}>
      {children}
      <GestureDetector gesture={pan}>
        <View style={styles.edge} collapsable={false} />
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  edge: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: EDGE_WIDTH,
    zIndex: 100,
  },
});
