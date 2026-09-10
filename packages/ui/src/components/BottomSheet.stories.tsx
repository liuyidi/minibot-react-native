import type { Meta, StoryObj } from "@storybook/react-native";
import { Text } from "react-native";
import { BottomSheet } from "./BottomSheet";

const meta = {
  title: "UI/BottomSheet",
  component: BottomSheet,
} satisfies Meta<typeof BottomSheet>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    visible: true,
    onClose: () => {},
    title: "Sheet title",
    showCloseButton: true,
    heightRatio: 0.5,
    children: <Text>Sheet body content</Text>,
  },
};
