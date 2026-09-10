import type { Meta, StoryObj } from "@storybook/react-native";

import { Screen } from "./Screen";
import { Text } from "./Text";

const meta = {
  title: "UI/Screen",
  component: Screen,
} satisfies Meta<typeof Screen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    paddingHorizontal: 16,
    paddingTop: 24,
    children: <Text variant="title">Screen content</Text>,
  },
};
