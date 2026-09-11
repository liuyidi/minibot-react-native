import type { Meta, StoryObj } from "@storybook/react-native";
import { Text, Pressable, View, StyleSheet } from "react-native";
import { MoreHorizontal } from "lucide-react-native";

import { Icon } from "../../foundation/icon";
import { IconButton } from "../../controls/icon-button";
import { StackHeader } from "./StackHeader";

const meta = {
  title: "UI/Layout 布局/StackHeader",
  component: StackHeader,
} satisfies Meta<typeof StackHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Settings",
    onBack: () => {},
  },
  render: () => (
    <View style={styles.page}>
      <StackHeader
        title="设置"
        onBack={() => {}}
        trailing={
          <IconButton size={36}>
            <Icon icon={MoreHorizontal} size={20} color="text" />
          </IconButton>
        }
      />
      <StackHeader
        title="卡券中心"
        subtitle="精选优惠 随心选购"
        onBack={() => {}}
        trailing={
          <Pressable>
            <Text style={styles.link}>购买记录</Text>
          </Pressable>
        }
      />
      <StackHeader
        title="沉浸标题"
        transparent
        onBack={() => {}}
        style={{ backgroundColor: "#E0F2FE" }}
      />
    </View>
  ),
};

const styles = StyleSheet.create({
  page: { gap: 12, paddingVertical: 8 },
  link: { fontSize: 13, color: "#666", paddingRight: 8 },
});
