import type { Preview } from "@storybook/react-native";
import { View, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ConfigProvider, brandDark, brandLight } from "@minibot/ui";

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
    (Story, context) => {
      const mode = (context.globals.theme as string) === "dark" ? "dark" : "light";
      const theme = mode === "dark" ? brandDark : brandLight;
      return (
        <GestureHandlerRootView style={styles.root}>
          <SafeAreaProvider>
            <ConfigProvider theme={theme} mode={mode} locale="zh">
              <View
                style={[
                  styles.wrap,
                  { backgroundColor: theme.background },
                ]}
              >
                <Story />
              </View>
            </ConfigProvider>
          </SafeAreaProvider>
        </GestureHandlerRootView>
      );
    },
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
