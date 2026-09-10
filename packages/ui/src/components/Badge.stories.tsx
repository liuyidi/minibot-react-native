import type { Meta, StoryObj } from "@storybook/react-native";

import { Badge } from "./Badge";

const meta = {
  title: "UI/Badge",
  component: Badge,
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { count: 3 },
};

export const Label: Story = {
  args: { children: "New" },
};
