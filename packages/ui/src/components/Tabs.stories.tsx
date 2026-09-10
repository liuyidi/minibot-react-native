import type { Meta, StoryObj } from "@storybook/react-native";
import { useState } from "react";
import { Tabs } from "./Tabs";

const meta = {
  title: "UI/Tabs",
  component: Tabs,
} satisfies Meta<typeof Tabs>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [
      { key: "a", label: "All" },
      { key: "b", label: "Active" },
      { key: "c", label: "Done" },
    ],
    value: "a",
    onChange: () => {},
  },
  render: function Render(args) {
    const [value, setValue] = useState(args.value);
    return <Tabs {...args} value={value} onChange={setValue} />;
  },
};
