import type { Meta, StoryObj } from "@storybook/react-native";

import { ProgressBar } from "./ProgressBar";

const meta = {
  title: "UI/Feedback 反馈/ProgressBar",
  component: ProgressBar,
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { progress: 0.65 },
};
