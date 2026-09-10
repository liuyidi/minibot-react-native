import type { Meta, StoryObj } from "@storybook/react-native";
import { ActionSheet } from "./ActionSheet";

const meta = {
  title: "UI/ActionSheet",
  component: ActionSheet,
} satisfies Meta<typeof ActionSheet>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    visible: true,
    onClose: () => {},
    title: "Choose an action",
    options: [
      { label: "Edit", onPress: () => {} },
      { label: "Share", onPress: () => {} },
      { label: "Delete", onPress: () => {}, destructive: true },
    ],
  },
};
