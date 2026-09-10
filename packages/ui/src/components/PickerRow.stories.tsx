import type { Meta, StoryObj } from "@storybook/react-native";

import { PickerRow } from "./PickerRow";

const meta = {
  title: "UI/PickerRow",
  component: PickerRow,
} satisfies Meta<typeof PickerRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Language",
    value: "中文",
    onPress: () => {},
  },
};

export const Placeholder: Story = {
  args: {
    label: "Timezone",
    onPress: () => {},
  },
};
