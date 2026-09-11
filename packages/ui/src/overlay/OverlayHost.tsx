import { useEffect, useReducer } from "react";
import {
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from "react-native-safe-area-context";

import { ConfigContext } from "../config/context";
import { ThemeProvider } from "../theme/ThemeProvider";
import { getOverlayBridge, subscribeOverlayBridge } from "./bridge";
import { OverlayStack } from "./controller";
import { InsideOverlayHostContext } from "./insideHost";
import type { OverlayStackItem } from "./types";

function useOverlaySnapshot(): OverlayStackItem[] {
  const [, bump] = useReducer((n: number) => n + 1, 0);
  useEffect(() => OverlayStack.subscribe(bump), []);
  return OverlayStack.getSnapshot();
}

function useOverlayBridgeTheme() {
  const [, bump] = useReducer((n: number) => n + 1, 0);
  useEffect(() => subscribeOverlayBridge(bump), []);
  return getOverlayBridge();
}

function topInteractiveId(entries: OverlayStackItem[]): string | null {
  for (let i = entries.length - 1; i >= 0; i--) {
    const e = entries[i];
    if (e.type === "Toast") continue;
    return e.id;
  }
  return entries.length ? entries[entries.length - 1].id : null;
}

function OverlayLayer({
  item,
  zIndex,
  isTopInteractive,
}: {
  item: OverlayStackItem;
  zIndex: number;
  isTopInteractive: boolean;
}) {
  const { options, content } = item;
  const node = typeof content === "function" ? content() : content;
  const canCloseMask =
    isTopInteractive && options.hasMask && options.closeOnMask;

  return (
    <View
      style={[styles.fill, { zIndex } as StyleProp<ViewStyle>]}
      pointerEvents={options.pointerEvents}
      collapsable={false}
    >
      {options.hasMask ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Dismiss overlay"
          disabled={!canCloseMask}
          onPress={() => {
            if (canCloseMask) OverlayStack.dismiss(item.id);
          }}
          style={[styles.fill, { backgroundColor: options.maskColor }]}
        />
      ) : null}
      <View style={styles.fill} pointerEvents="box-none">
        <InsideOverlayHostContext.Provider value={true}>
          {node}
        </InsideOverlayHostContext.Provider>
      </View>
    </View>
  );
}

/**
 * Single host mounted via one RootSiblings instance.
 * Must be `position: absolute` full-bleed — SafeAreaProvider defaults to
 * `flex: 1`, which otherwise shares height with page content and clips the mask.
 */
export function OverlayHost() {
  const entries = useOverlaySnapshot();
  const bridge = useOverlayBridgeTheme();
  const topId = topInteractiveId(entries);

  return (
    <View style={styles.host} pointerEvents="box-none" collapsable={false}>
      <ConfigContext.Provider
        value={{
          locale: bridge.locale,
          mode: bridge.mode,
          messages: bridge.messages,
        }}
      >
        <ThemeProvider theme={bridge.theme}>
          <SafeAreaProvider
            style={styles.fill}
            initialMetrics={initialWindowMetrics ?? undefined}
          >
            <View style={styles.fill} pointerEvents="box-none" collapsable={false}>
              {entries.map((item, stackIndex) => (
                <OverlayLayer
                  key={item.id}
                  item={item}
                  zIndex={OverlayStack.zIndexFor(item, stackIndex)}
                  isTopInteractive={item.id === topId}
                />
              ))}
            </View>
          </SafeAreaProvider>
        </ThemeProvider>
      </ConfigContext.Provider>
    </View>
  );
}

const styles = StyleSheet.create({
  host: {
    ...StyleSheet.absoluteFill,
    // Sit above page content inside RootSiblingParent.
    zIndex: 100000,
    elevation: 100000,
  },
  fill: {
    ...StyleSheet.absoluteFill,
  },
});
