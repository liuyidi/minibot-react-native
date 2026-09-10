import type { Meta, StoryObj } from "@storybook/react-native";
import { Text } from "react-native";
import { Dialog } from "./Dialog";

const meta = {
  title: "UI/Dialog",
  component: Dialog,
} satisfies Meta<typeof Dialog>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    visible: true,
    onClose: () => {},
    title: "Confirm",
    children: <Text>Are you sure you want to continue?</Text>,
    primaryAction: { label: "Confirm", onPress: () => {} },
    secondaryAction: { label: "Cancel", onPress: () => {} },
  },
};
