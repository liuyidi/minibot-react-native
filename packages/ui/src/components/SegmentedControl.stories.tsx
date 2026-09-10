import type { Meta, StoryObj } from "@storybook/react-native";
import { useState } from "react";

import { SegmentedControl } from "./SegmentedControl";

const options = [
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
  { label: "System", value: "system" },
];

const meta = {
  title: "UI/SegmentedControl",
  component: SegmentedControl,
} satisfies Meta<typeof SegmentedControl>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    options,
    value: "light",
    onChange: () => {},
  },
  render: function SegmentedStory(args) {
    const [value, setValue] = useState(args.value);
    return <SegmentedControl {...args} value={value} onChange={setValue} />;
  },
};
