import type { Meta, StoryObj } from "@storybook/react-native";
import { StyleSheet, View } from "react-native";

import { Image } from "./Image";

const meta = {
  title: "UI/Foundation 基础/Image",
  component: Image,
} satisfies Meta<typeof Image>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    source: { uri: "https://picsum.photos/seed/uiimg/300/200" },
    width: 180,
    height: 120,
    bordered: true,
  },
  render: (args) => (
    <View style={styles.page}>
      <Image {...args} />
      <Image
        source={{ uri: "https://picsum.photos/seed/uiimg2/200" }}
        width={96}
        height={96}
        radius={48}
      />
    </View>
  ),
};

const styles = StyleSheet.create({
  page: { padding: 16, gap: 16, flexDirection: "row", flexWrap: "wrap" },
});
