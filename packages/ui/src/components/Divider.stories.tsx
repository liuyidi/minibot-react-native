import type { Meta, StoryObj } from "@storybook/react-native";

import { Divider } from "./Divider";

const meta = {
  title: "UI/Divider",
  component: Divider,
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Inset: Story = {
  args: { inset: true },
};
