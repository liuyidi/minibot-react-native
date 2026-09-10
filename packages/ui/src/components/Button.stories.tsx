import type { Meta, StoryObj } from "@storybook/react-native";

import { Button } from "./Button";

const meta = {
  title: "UI/Button",
  component: Button,
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { label: "Continue", variant: "primary" },
};

export const Secondary: Story = {
  args: { label: "Cancel", variant: "secondary" },
};

export const Ghost: Story = {
  args: { label: "Skip", variant: "ghost" },
};

export const Destructive: Story = {
  args: { label: "Delete", variant: "destructive" },
};

export const Loading: Story = {
  args: { label: "Saving", loading: true },
};
