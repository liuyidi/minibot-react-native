import type { Meta, StoryObj } from "@storybook/react-native";

import { ListRow } from "./ListRow";

const meta = {
  title: "UI/ListRow",
  component: ListRow,
} satisfies Meta<typeof ListRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Language",
    value: "English",
    onPress: () => {},
  },
};

export const Destructive: Story = {
  args: {
    title: "Sign out",
    destructive: true,
    onPress: () => {},
  },
};
