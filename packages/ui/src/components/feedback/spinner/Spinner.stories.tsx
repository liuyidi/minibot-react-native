import type { Meta, StoryObj } from "@storybook/react-native";

import { Spinner } from "./Spinner";

const meta = {
  title: "UI/Feedback 反馈/Spinner",
  component: Spinner,
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
