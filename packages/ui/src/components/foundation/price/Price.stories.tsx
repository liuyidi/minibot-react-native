import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";

import { Price } from "./Price";

const meta = {
  title: "UI/Foundation 基础/Price",
  component: Price,
} satisfies Meta<typeof Price>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { value: 0.9, original: 100 },
  render: () => (
    <View style={{ gap: 16, padding: 8, alignItems: "flex-start" }}>
      <Price value={0.9} original={100} />
      <Price value={35} />
      <Price value="5折" emphasize />
    </View>
  ),
};
