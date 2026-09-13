import { useEffect, type ComponentType } from "react";
import type { Preview } from "@storybook/react-native";
import { View, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import {
  ConfigProvider,
  OverlayStack,
  brandDark,
  brandLight,
} from "@minibot/ui";

/** Clear global overlays whenever the active story changes or unmounts. */
function StoryCanvas({
  Story,
  storyId,
  mode,
}: {
  Story: ComponentType;
  storyId: string;
  mode: "light" | "dark";
}) {
  useEffect(() => {
    OverlayStack.dismissAll();
    return () => OverlayStack.dismissAll();
  }, [storyId]);

  const theme = mode === "dark" ? brandDark : brandLight;

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <ConfigProvider theme={theme} mode={mode} locale="zh">
          <View
            style={[styles.wrap, { backgroundColor: theme.background }]}
          >
            <Story />
          </View>
        </ConfigProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const preview: Preview = {
  globalTypes: {
    theme: {
      name: "Theme",
      description: "Brand light / dark",
      defaultValue: "light",
      toolbar: {
        icon: "circlehollow",
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
        ],
      },
    },
  },
  decorators: [
    (Story, context) => (
      <StoryCanvas
        Story={Story}
        storyId={context.id}
        mode={
          (context.globals.theme as string) === "dark" ? "dark" : "light"
        }
      />
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  wrap: {
    flex: 1,
    // Story canvas padding only — gallery home is outside this decorator.
    padding: 16,
  },
});
