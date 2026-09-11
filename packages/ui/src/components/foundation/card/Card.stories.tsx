import type { Meta, StoryObj } from "@storybook/react-native";
import type { ReactNode } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { ChevronRight, Wifi } from "lucide-react-native";

import { Button } from "../../controls/button";
import { Badge } from "../badge";
import { Icon } from "../icon";
import { Card } from "./Card";

function DemoBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.block}>
      <Text style={styles.blockTitle}>{title}</Text>
      <View style={styles.blockBody}>{children}</View>
    </View>
  );
}

function CardGallery() {
  return (
    <ScrollView contentContainerStyle={styles.page}>
      <DemoBlock title="基础卡片">
        <Card>
          <Text style={styles.body}>一段简短的卡片内容，用于承载说明或摘要。</Text>
        </Card>
      </DemoBlock>

      <DemoBlock title="标题 + 正文 + 元信息">
        <Card>
          <View style={styles.headerRow}>
            <Text style={styles.title}>设备状态</Text>
            <Badge>在线</Badge>
          </View>
          <Text style={styles.body}>
            客厅机器人已连接，最近同步时间 2 分钟前。可在设置中调整唤醒词与静音时段。
          </Text>
          <Text style={styles.meta}>更新于今天 19:32</Text>
        </Card>
      </DemoBlock>

      <DemoBlock title="带操作区">
        <Card>
          <Text style={styles.title}>固件更新可用</Text>
          <Text style={[styles.body, styles.bodySpaced]}>
            v1.4.2 包含稳定性修复与功耗优化，建议在充电时升级。
          </Text>
          <View style={styles.actions}>
            <Button size="small" variant="secondary" onPress={() => {}}>
              稍后
            </Button>
            <Button size="small" onPress={() => {}}>
              立即更新
            </Button>
          </View>
        </Card>
      </DemoBlock>

      <DemoBlock title="列表式条目">
        <Card style={styles.cardTight}>
          <View style={styles.listRow}>
            <View style={styles.listLeading}>
              <Icon icon={Wifi} size={18} color="#2563eb" />
              <Text style={styles.listTitle}>网络</Text>
            </View>
            <View style={styles.listTrailing}>
              <Text style={styles.listValue}>Wi‑Fi</Text>
              <Icon icon={ChevronRight} size={16} color="#999" />
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.listRow}>
            <Text style={styles.listTitle}>会话密钥</Text>
            <Text style={styles.listValue}>已配置</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.listRow}>
            <Text style={styles.listTitle}>存储占用</Text>
            <Text style={styles.listValue}>128 MB</Text>
          </View>
        </Card>
      </DemoBlock>

      <DemoBlock title="紧凑 / 强调边距">
        <Card style={styles.cardCompact}>
          <Text style={styles.compactText}>padding: 10 · 适合密集信息</Text>
        </Card>
        <Card style={styles.cardAccent}>
          <Text style={styles.accentTitle}>提示</Text>
          <Text style={styles.body}>可用 style 覆盖边框与背景，突出重要信息。</Text>
        </Card>
      </DemoBlock>

      <DemoBlock title="卡片堆叠">
        <View style={styles.stack}>
          <Card>
            <Text style={styles.title}>今日日程</Text>
            <Text style={styles.body}>3 项待办 · 1 次例会</Text>
          </Card>
          <Card>
            <Text style={styles.title}>本周摘要</Text>
            <Text style={styles.body}>对话 42 次 · 工具调用 18 次</Text>
          </Card>
        </View>
      </DemoBlock>
    </ScrollView>
  );
}

const meta = {
  title: "UI/Foundation 基础/Card",
  component: Card,
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <Text>Card content</Text>,
  },
  render: () => <CardGallery />,
};

const styles = StyleSheet.create({
  page: {
    padding: 16,
    paddingBottom: 40,
  },
  block: {
    marginBottom: 22,
  },
  blockTitle: {
    fontSize: 14,
    color: "#999",
    marginBottom: 12,
  },
  blockBody: {
    gap: 12,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
    color: "#444",
  },
  bodySpaced: {
    marginTop: 6,
    marginBottom: 14,
  },
  meta: {
    marginTop: 10,
    fontSize: 12,
    color: "#999",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  cardTight: {
    paddingVertical: 4,
    paddingHorizontal: 14,
  },
  listRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    gap: 12,
  },
  listLeading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  listTrailing: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  listTitle: {
    fontSize: 15,
    color: "#222",
  },
  listValue: {
    fontSize: 14,
    color: "#888",
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#e5e5e5",
  },
  cardCompact: {
    padding: 10,
  },
  compactText: {
    fontSize: 13,
    color: "#555",
  },
  cardAccent: {
    borderColor: "#2563eb",
    backgroundColor: "rgba(37,99,235,0.06)",
  },
  accentTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2563eb",
    marginBottom: 4,
  },
  stack: {
    gap: 10,
  },
});
