import type { Meta, StoryObj } from "@storybook/react-native";

import { Chip } from "./Chip";

const meta = {
  title: "UI/Chip",
  component: Chip,
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: "Filter", selected: false },
};

export const Selected: Story = {
  args: { label: "Active", selected: true },
};
