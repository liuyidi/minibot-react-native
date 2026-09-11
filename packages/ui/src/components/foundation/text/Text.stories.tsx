import type { Meta, StoryObj } from "@storybook/react-native";

import { Text } from "./Text";

const meta = {
  title: "UI/Foundation 基础/Text",
  component: Text,
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: "Hello", variant: "body" },
};

export const Title: Story = {
  args: { children: "Title text", variant: "title" },
};
