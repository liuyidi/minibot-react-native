import type { Meta, StoryObj } from "@storybook/react-native";
import { Text } from "react-native";

import { Card } from "./Card";

const meta = {
  title: "UI/Card",
  component: Card,
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <Text>Card content</Text>,
  },
};
