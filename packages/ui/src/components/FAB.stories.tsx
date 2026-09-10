import type { Meta, StoryObj } from "@storybook/react-native";

import { FAB } from "./FAB";

const meta = {
  title: "UI/FAB",
  component: FAB,
} satisfies Meta<typeof FAB>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "+",
    onPress: () => {},
  },
};
