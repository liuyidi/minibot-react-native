import type { Preview } from "@storybook/react-native";
import { View, StyleSheet } from "react-native";

import { ThemeProvider, brandDark, brandLight } from "@minibot/ui";

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
        <ThemeProvider theme={theme}>
          <View
            style={[
              styles.wrap,
              { backgroundColor: theme.background },
            ]}
          >
            <Story />
          </View>
        </ThemeProvider>
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
  wrap: {
    flex: 1,
    padding: 16,
  },
});
