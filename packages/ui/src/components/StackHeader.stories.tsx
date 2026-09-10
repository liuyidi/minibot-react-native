import type { Meta, StoryObj } from "@storybook/react-native";
import { Text } from "react-native";

import { StackHeader } from "./StackHeader";

const meta = {
  title: "UI/StackHeader",
  component: StackHeader,
} satisfies Meta<typeof StackHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Settings",
    onBack: () => {},
    trailing: <Text>•</Text>,
  },
};
