import type { Meta, StoryObj } from "@storybook/react-native";
import { useState, type ReactNode } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { Switch } from "../../controls/switch";
import { Skeleton } from "./Skeleton";

function DemoBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.block}>
      <Text style={styles.blockTitle}>{title}</Text>
      {children}
    </View>
  );
}

function SkeletonGallery() {
  const [loading, setLoading] = useState(true);

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <DemoBlock title="基础用法">
        <Skeleton title row={3} />
      </DemoBlock>

      <DemoBlock title="显示头像">
        <Skeleton title avatar row={3} />
      </DemoBlock>

      <DemoBlock title="展示子组件">
        <View style={styles.loadingRow}>
          <Text style={styles.label}>加载中</Text>
          <Switch checked={loading} onChange={setLoading} />
        </View>
        <Skeleton title avatar row={3} loading={loading}>
          <View style={styles.realContent}>
            <View style={styles.avatar} />
            <View style={styles.realBody}>
              <Text style={styles.realTitle}>关于 minibot</Text>
              <Text style={styles.realText}>
                minibot 是面向个人与小团队的 AI 助手运行时，支持多渠道接入与工具调用。
              </Text>
            </View>
          </View>
        </Skeleton>
      </DemoBlock>

      <DemoBlock title="自定义内容">
        <Skeleton
          template={
            <View style={styles.custom}>
              <Skeleton.Image />
              <View style={styles.customBody}>
                <Skeleton.Paragraph width="60%" />
                <Skeleton.Paragraph />
                <Skeleton.Paragraph />
              </View>
            </View>
          }
        />
      </DemoBlock>

      <DemoBlock title="圆角">
        <Skeleton title avatar row={3} round />
      </DemoBlock>
    </ScrollView>
  );
}

const meta = {
  title: "UI/Feedback 反馈/Skeleton",
  component: Skeleton,
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <SkeletonGallery />,
};

const styles = StyleSheet.create({
  page: {
    paddingBottom: 40,
  },
  block: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    gap: 12,
  },
  blockTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#666",
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  label: {
    fontSize: 15,
    color: "#333",
  },
  realContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#1989fa",
  },
  realBody: {
    flex: 1,
    gap: 8,
  },
  realTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#323233",
  },
  realText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#646566",
  },
  custom: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  customBody: {
    flex: 1,
    gap: 12,
    paddingTop: 4,
  },
});
