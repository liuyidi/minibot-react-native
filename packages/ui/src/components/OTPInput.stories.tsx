import type { Meta, StoryObj } from "@storybook/react-native";
import { useState } from "react";
import { OTPInput } from "./OTPInput";

const meta = {
  title: "UI/OTPInput",
  component: OTPInput,
} satisfies Meta<typeof OTPInput>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    length: 6,
    value: "",
    onChangeText: () => {},
  },
  render: function Render(args) {
    const [value, setValue] = useState(args.value);
    return <OTPInput {...args} value={value} onChangeText={setValue} />;
  },
};
