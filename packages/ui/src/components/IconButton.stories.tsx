import type { Meta, StoryObj } from "@storybook/react-native";
import { Text } from "react-native";

import { IconButton } from "./IconButton";

const meta = {
  title: "UI/IconButton",
  component: IconButton,
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <Text style={{ fontSize: 18 }}>✕</Text>,
    accessibilityLabel: "Close",
  },
};
