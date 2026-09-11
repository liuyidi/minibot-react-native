import type { Meta, StoryObj } from "@storybook/react-native";
import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Button } from "../../controls/button";
import { SafeArea } from "./SafeArea";

function DemoBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.block}>
      <Text style={styles.blockTitle}>{title}</Text>
      {children}
    </View>
  );
}

function SafeAreaGallery() {
  return (
    <View style={styles.page}>
      <DemoBlock title="底部占位（空 spacer）">
        <View style={styles.demoCard}>
          <Text style={styles.hint}>主内容</Text>
          <View style={styles.footerPreview}>
            <Button block onPress={() => {}}>
              底部操作
            </Button>
            <SafeArea position="bottom" style={styles.safeFill} />
          </View>
        </View>
      </DemoBlock>

      <DemoBlock title="包裹内容（padding 模式）">
        <SafeArea position="bottom" style={styles.wrapPreview}>
          <Button block onPress={() => {}}>
            按钮 + 底部安全区
          </Button>
        </SafeArea>
      </DemoBlock>

      <DemoBlock title="顶部占位">
        <View style={styles.demoCard}>
          <SafeArea position="top" style={styles.safeFill} />
          <Text style={styles.hint}>顶栏下方内容</Text>
        </View>
      </DemoBlock>
    </View>
  );
}

const meta = {
  title: "UI/Layout 布局/SafeArea",
  component: SafeArea,
} satisfies Meta<typeof SafeArea>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    position: "bottom",
  },
  render: () => <SafeAreaGallery />,
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
  demoCard: {
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#ddd",
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  hint: {
    padding: 16,
    fontSize: 14,
    color: "#333",
  },
  footerPreview: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#eee",
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  wrapPreview: {
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  safeFill: {
    backgroundColor: "rgba(180, 35, 24, 0.12)",
  },
});
