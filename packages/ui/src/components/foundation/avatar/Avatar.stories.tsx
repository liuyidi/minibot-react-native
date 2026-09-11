import type { Meta, StoryObj } from "@storybook/react-native";

import { Avatar } from "./Avatar";

const meta = {
  title: "UI/Foundation 基础/Avatar",
  component: Avatar,
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { initials: "MB", size: 48 },
};
