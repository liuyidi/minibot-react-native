import type { Meta, StoryObj } from "@storybook/react-native";
import { useState } from "react";

import { SearchBar } from "./SearchBar";

const meta = {
  title: "UI/SearchBar",
  component: SearchBar,
} satisfies Meta<typeof SearchBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: "",
    placeholder: "Search…",
  },
  render: function SearchStory(args) {
    const [value, setValue] = useState(args.value ?? "");
    return (
      <SearchBar
        {...args}
        value={value}
        onChangeText={setValue}
        onClear={() => setValue("")}
      />
    );
  },
};
