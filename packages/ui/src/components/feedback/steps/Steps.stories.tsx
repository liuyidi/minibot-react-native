import type { Meta, StoryObj } from "@storybook/react-native";
import { StyleSheet, View } from "react-native";

import { Steps } from "./Steps";

const meta = {
  title: "UI/Feedback 反馈/Steps",
  component: Steps,
} satisfies Meta<typeof Steps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    current: 1,
    items: [
      { title: "下单", description: "已提交" },
      { title: "支付", description: "进行中" },
      { title: "发货" },
      { title: "完成" },
    ],
  },
  render: (args) => (
    <View style={styles.page}>
      <Steps {...args} />
      <Steps
        direction="vertical"
        current={2}
        items={[
          { title: "填写资料" },
          { title: "实名认证" },
          { title: "等待审核", description: "预计 1 个工作日" },
          { title: "开通成功" },
        ]}
      />
    </View>
  ),
};

const styles = StyleSheet.create({
  page: { padding: 16, gap: 28 },
});
