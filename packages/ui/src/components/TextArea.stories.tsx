import type { Meta, StoryObj } from "@storybook/react-native";

import { TextArea } from "./TextArea";

const meta = {
  title: "UI/TextArea",
  component: TextArea,
} satisfies Meta<typeof TextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Notes",
    placeholder: "Write something…",
  },
};
