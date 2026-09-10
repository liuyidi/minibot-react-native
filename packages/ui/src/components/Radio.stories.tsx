import type { Meta, StoryObj } from "@storybook/react-native";
import { useState } from "react";

import { Radio, RadioGroup } from "./Radio";

const meta = {
  title: "UI/Radio",
  component: RadioGroup,
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: "a",
    onChange: () => {},
    children: (
      <>
        <Radio value="a" label="Option A" />
        <Radio value="b" label="Option B" />
      </>
    ),
  },
  render: function RadioStory(args) {
    const [value, setValue] = useState(args.value);
    return (
      <RadioGroup {...args} value={value} onChange={setValue}>
        <Radio value="a" label="Option A" />
        <Radio value="b" label="Option B" />
      </RadioGroup>
    );
  },
};
