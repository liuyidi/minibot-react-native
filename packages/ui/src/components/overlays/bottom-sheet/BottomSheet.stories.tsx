import type { Meta, StoryObj } from "@storybook/react-native";
import type { ReactNode } from "react";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Button } from "../../controls/button";
import { Price } from "../../foundation/price";
import { Tag } from "../../foundation/tag";
import { Ticket } from "../../business/ticket";
import { BottomSheet } from "./BottomSheet";

function DemoBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.block}>
      <Text style={styles.blockTitle}>{title}</Text>
      {children}
    </View>
  );
}

function BottomSheetGallery() {
  const [basic, setBasic] = useState(false);
  const [pack, setPack] = useState(false);

  return (
    <View style={styles.page}>
      <DemoBlock title="基础（标题 + 关闭钮）">
        <Button onPress={() => setBasic(true)}>打开基础 Sheet</Button>
        <BottomSheet
          visible={basic}
          onClose={() => setBasic(false)}
          title="筛选"
          showCloseButton
          heightRatio={0.45}
        >
          <Text style={styles.bodyText}>内容区可滚动。点右上角 ✕ 或蒙层关闭。</Text>
        </BottomSheet>
      </DemoBlock>

      <DemoBlock title="header + footer（券包详情）">
        <Button onPress={() => setPack(true)}>打开券包详情</Button>
        <BottomSheet
          visible={pack}
          onClose={() => setPack(false)}
          title="券包详情"
          showCloseButton
          heightRatio={0.78}
          header={
            <View style={styles.hero}>
              <View style={styles.heroTags}>
                <Tag label="过期自动退" variant="warning" fill="soft" />
                <Tag label="超值特惠" variant="danger" fill="soft" />
              </View>
              <Text style={styles.heroTitle}>出行立减券包</Text>
              <Price value={1.1} original={12.5} />
            </View>
          }
          footer={
            <Button block variant="destructive" onPress={() => setPack(false)}>
              1.1元抢购
            </Button>
          }
        >
          <Text style={styles.sectionLabel}>套餐详情</Text>
          <View style={{ gap: 10, marginBottom: 16 }}>
            <Ticket value="5元" valueHint="无门槛" title="出行立减券" quantity={1} />
            <Ticket value="8折" valueHint="最高抵20元" title="出行折扣券" quantity={2} />
          </View>
          <Text style={styles.sectionLabel}>使用须知</Text>
          <Text style={styles.bodyText}>
            1. 购买后立即到账{"\n"}
            2. 不可与其他优惠同享{"\n"}
            3. 过期未使用自动退款
          </Text>
        </BottomSheet>
      </DemoBlock>
    </View>
  );
}

const meta = {
  title: "UI/Overlays 浮层/BottomSheet",
  component: BottomSheet,
} satisfies Meta<typeof BottomSheet>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    visible: false,
    onClose: () => {},
    title: "Sheet title",
    showCloseButton: true,
    heightRatio: 0.5,
    children: <Text>Sheet body content</Text>,
  },
  render: () => <BottomSheetGallery />,
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    paddingTop: 8,
  },
  block: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  blockTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#666",
  },
  bodyText: {
    fontSize: 14,
    lineHeight: 22,
    color: "#333",
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 10,
    color: "#111",
  },
  hero: {
    gap: 8,
    paddingBottom: 4,
  },
  heroTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
  },
});
