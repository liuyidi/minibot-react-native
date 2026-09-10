import type { Meta, StoryObj } from "@storybook/react-native";

import { Switch } from "./Switch";

const meta = {
  title: "UI/Switch",
  component: Switch,
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { value: true },
};
