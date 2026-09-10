import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";
import { Backdrop } from "./Backdrop";

const meta = {
  title: "UI/Backdrop",
  component: Backdrop,
} satisfies Meta<typeof Backdrop>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    visible: true,
    onPress: () => {},
  },
  render: (args) => (
    <View style={{ height: 200, width: "100%" }}>
      <Backdrop {...args} />
    </View>
  ),
};
