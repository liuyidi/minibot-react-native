import type { Meta, StoryObj } from "@storybook/react-native";
import type { ReactNode } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { Button } from "../../controls/button";
import { Tag } from "../../foundation/tag";
import { Ticket } from "./Ticket";

function DemoBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.block}>
      <Text style={styles.blockTitle}>{title}</Text>
      {children}
    </View>
  );
}

function TicketGallery() {
  return (
    <ScrollView contentContainerStyle={styles.page}>
      <DemoBlock title="基础 + 操作">
        <Ticket
          cornerTag="出行"
          value="35元"
          valueHint="满300元可用"
          title="出行 35元满减券"
          status={<Tag label="明天过期" variant="danger" />}
          meta="有效期至 2026-09-12"
          action={
            <Button
              size="mini"
              fill="outline"
              variant="destructive"
              onPress={() => {}}
            >
              去使用
            </Button>
          }
          details={"1. 不可与其他优惠同享\n2. 仅限指定品类订单"}
        />
      </DemoBlock>

      <DemoBlock title="数量 + 右侧渐变条">
        <View style={{ gap: 10 }}>
          <Ticket
            value="5元"
            valueHint="无门槛"
            title="出行立减券"
            meta="套餐内含"
            quantity={1}
          />
          <Ticket
            value="8折"
            valueHint="最高抵20元"
            title="出行折扣券"
            meta="套餐内含"
            quantity={2}
          />
          <Ticket
            value="15元"
            valueHint="满50可用"
            title="出行满减券"
            quantity="x 3张"
            accentBar
          />
        </View>
      </DemoBlock>

      <DemoBlock title="仅渐变条（无数量）">
        <Ticket
          value="10元"
          valueHint="满100可用"
          title="通用满减券"
          meta="有效期至 2026-12-31"
          accentBar
        />
      </DemoBlock>
    </ScrollView>
  );
}

const meta = {
  title: "UI/Business 业务/Ticket",
  component: Ticket,
} satisfies Meta<typeof Ticket>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "出行立减券",
    value: "5元",
  },
  render: () => <TicketGallery />,
};

const styles = StyleSheet.create({
  page: {
    paddingBottom: 40,
  },
  block: {
    paddingHorizontal: 12,
    paddingTop: 16,
    paddingBottom: 8,
    gap: 10,
  },
  blockTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#666",
  },
});
