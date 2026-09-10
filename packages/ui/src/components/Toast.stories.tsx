import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";
import { ToastHost } from "./Toast";

const meta = {
  title: "UI/Toast",
  component: ToastHost,
} satisfies Meta<typeof ToastHost>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    message: "Saved successfully",
  },
  render: (args) => (
    <View style={{ flex: 1, minHeight: 120 }}>
      <ToastHost {...args} />
    </View>
  ),
};
