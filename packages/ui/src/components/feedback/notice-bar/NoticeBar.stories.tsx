import type { Meta, StoryObj } from "@storybook/react-native";
import { StyleSheet, Text, View } from "react-native";
import { Volume2 } from "lucide-react-native";

import { Icon } from "../../foundation/icon";
import { NoticeBar } from "./NoticeBar";

const meta = {
  title: "UI/Feedback 反馈/NoticeBar",
  component: NoticeBar,
} satisfies Meta<typeof NoticeBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { text: "系统维护通知：今晚 23:00–24:00" },
  render: () => (
    <View style={styles.page}>
      <NoticeBar text="普通公告：欢迎使用 minibot UI" />
      <NoticeBar
        variant="warning"
        closeable
        icon={<Icon icon={Volume2} size={16} color="yellow" />}
        text="可关闭的警告条"
      />
      <NoticeBar
        variant="danger"
        scrollable
        text="这是一条较长的滚动公告，用于演示 marquee 效果 · 请留意活动规则与截止日期。"
      />
    </View>
  ),
};

const styles = StyleSheet.create({
  page: { padding: 16, gap: 12 },
});
