import type { Meta, StoryObj } from "@storybook/react-native";
import { useState } from "react";

import { Slider } from "./Slider";

const meta = {
  title: "UI/Slider",
  component: Slider,
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 0.4,
    onValueChange: () => {},
    min: 0,
    max: 1,
  },
  render: function SliderStory(args) {
    const [value, setValue] = useState(args.value);
    return <Slider {...args} value={value} onValueChange={setValue} />;
  },
};
