import type { Meta, StoryObj } from "@storybook/react-native";
import { EmptyState } from "./EmptyState";

const meta = {
  title: "UI/EmptyState",
  component: EmptyState,
} satisfies Meta<typeof EmptyState>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Nothing here yet",
    description: "Create your first item to get started.",
    actionLabel: "Create",
    onAction: () => {},
  },
};
