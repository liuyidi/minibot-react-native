import type { Meta, StoryObj } from "@storybook/react-native";

import { TextField } from "./TextField";

const meta = {
  title: "UI/TextField",
  component: TextField,
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Email",
    placeholder: "you@example.com",
  },
};

export const WithHint: Story = {
  args: {
    label: "Email",
    hint: "We'll send a one-time code",
    placeholder: "you@example.com",
  },
};

export const WithError: Story = {
  args: {
    label: "Email",
    error: "Invalid email",
    value: "bad",
  },
};
