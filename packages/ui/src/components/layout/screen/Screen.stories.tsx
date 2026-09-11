import type { Meta, StoryObj } from "@storybook/react-native";

import { Screen } from "./Screen";
import { Text } from "../../foundation/text";

const meta = {
  title: "UI/Layout 布局/Screen",
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
