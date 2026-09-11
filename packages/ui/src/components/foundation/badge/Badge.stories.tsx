import type { Meta, StoryObj } from "@storybook/react-native";
import type { ReactNode } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Bell, MessageCircle } from "lucide-react-native";

import { Icon } from "../icon";
import { Badge } from "./Badge";

function DemoBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.block}>
      <Text style={styles.blockTitle}>{title}</Text>
      <View style={styles.blockBody}>{children}</View>
    </View>
  );
}

function BadgeGallery() {
  return (
    <ScrollView contentContainerStyle={styles.page}>
      <DemoBlock title="数字角标">
        <View style={styles.row}>
          <Badge count={1} />
          <Badge count={3} />
          <Badge count={12} />
          <Badge count={99} />
          <Badge count={128} />
        </View>
        <Text style={styles.hint}>超过 99 显示为 99+</Text>
      </DemoBlock>

      <DemoBlock title="文字标签">
        <View style={styles.row}>
          <Badge>New</Badge>
          <Badge>Beta</Badge>
          <Badge>Hot</Badge>
          <Badge>限时</Badge>
        </View>
      </DemoBlock>

      <DemoBlock title="搭配图标入口">
        <View style={styles.row}>
          <View style={styles.iconSlot}>
            <Icon icon={Bell} size={22} color="#444" />
            <View style={styles.corner}>
              <Badge count={8} />
            </View>
          </View>
          <View style={styles.iconSlot}>
            <Icon icon={MessageCircle} size={22} color="#444" />
            <View style={styles.corner}>
              <Badge count={128} />
            </View>
          </View>
        </View>
      </DemoBlock>

      <DemoBlock title="行内混排">
        <View style={styles.inlineRow}>
          <Text style={styles.inlineText}>未读消息</Text>
          <Badge count={5} />
          <Text style={styles.inlineMuted}>·</Text>
          <Text style={styles.inlineText}>频道</Text>
          <Badge>更新</Badge>
        </View>
      </DemoBlock>

      <DemoBlock title="强调色（style 覆盖）">
        <View style={styles.row}>
          <Badge style={{ backgroundColor: "#ef4444", borderColor: "#ef4444" }}>
            <Text style={styles.onAccent}>3</Text>
          </Badge>
          <Badge style={{ backgroundColor: "#22c55e", borderColor: "#22c55e" }}>
            <Text style={styles.onAccent}>上线</Text>
          </Badge>
          <Badge style={{ backgroundColor: "#2563eb", borderColor: "#2563eb" }}>
            <Text style={styles.onAccent}>Pro</Text>
          </Badge>
        </View>
      </DemoBlock>
    </ScrollView>
  );
}

const meta = {
  title: "UI/Foundation 基础/Badge",
  component: Badge,
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { count: 3 },
  render: () => <BadgeGallery />,
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
    gap: 10,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 10,
  },
  hint: {
    fontSize: 12,
    color: "#aaa",
  },
  iconSlot: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  corner: {
    position: "absolute",
    top: -4,
    right: -8,
  },
  inlineRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  inlineText: {
    fontSize: 15,
    color: "#222",
  },
  inlineMuted: {
    fontSize: 15,
    color: "#bbb",
  },
  onAccent: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
});
