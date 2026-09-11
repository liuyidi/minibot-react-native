import type { Meta, StoryObj } from "@storybook/react-native";
import type { ReactNode } from "react";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { MessageCircle, Pencil, Plus, ScanLine } from "lucide-react-native";

import { Icon } from "../../foundation/icon";
import { FAB } from "./FAB";

function DemoBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.block}>
      <Text style={styles.blockTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Stage({
  height = 200,
  children,
}: {
  height?: number;
  children: ReactNode;
}) {
  return <View style={[styles.stage, { height }]}>{children}</View>;
}

function FABGallery() {
  const [last, setLast] = useState("—");
  const tap = (name: string) => () => setLast(name);

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <Text style={styles.result}>最近点击：{last}</Text>

      <DemoBlock title="圆形 circle（默认）">
        <View style={styles.row}>
          <FAB label="+" onPress={tap("默认 +")} />
          <FAB
            icon={<Icon icon={Plus} size={28} color="onPrimary" />}
            onPress={tap("Plus icon")}
          />
          <FAB
            icon={<Icon icon={Pencil} size={22} color="onPrimary" />}
            onPress={tap("编辑")}
          />
          <FAB
            icon={<Icon icon={ScanLine} size={22} color="onPrimary" />}
            onPress={tap("扫码")}
          />
        </View>
      </DemoBlock>

      <DemoBlock title="禁用 / 自定义主题色">
        <View style={styles.row}>
          <FAB label="+" disabled onPress={tap("disabled")} />
          <FAB
            label="+"
            theme={{ primary: "#0F766E", onPrimary: "#ffffff" }}
            onPress={tap("teal")}
          />
          <FAB
            icon={<Icon icon={MessageCircle} size={24} color="onPrimary" />}
            theme={{ primary: "#7C3AED", onPrimary: "#ffffff" }}
            onPress={tap("purple chat")}
          />
        </View>
      </DemoBlock>

      <DemoBlock title="页面角落定位（父级 absolute）">
        <Stage height={220}>
          <Text style={styles.stageHint}>模拟页面内容区</Text>
          <FAB
            icon={<Icon icon={Plus} size={28} color="onPrimary" />}
            onPress={tap("右下角 FAB")}
            style={styles.cornerFab}
          />
        </Stage>
      </DemoBlock>

      <DemoBlock title="edge 贴边（docked，求助建议）">
        <Stage height={240}>
          <Text style={styles.stageHint}>右侧贴边，约垂直居中</Text>
          <FAB
            variant="edge"
            docked
            label="求助建议"
            icon={<Icon icon={Pencil} size={14} color="onPrimary" />}
            onPress={tap("edge docked")}
          />
        </Stage>
      </DemoBlock>

      <DemoBlock title="edge 未贴边（docked=false，自行排布）">
        <View style={styles.row}>
          <FAB
            variant="edge"
            docked={false}
            label="求助"
            icon={<Icon icon={Pencil} size={14} color="onPrimary" />}
            onPress={tap("edge undocked 短")}
          />
          <FAB
            variant="edge"
            docked={false}
            label="求助建议"
            icon={<Icon icon={MessageCircle} size={14} color="onPrimary" />}
            theme={{ heading: "#111827", onPrimary: "#ffffff" }}
            onPress={tap("edge undocked 长")}
          />
        </View>
      </DemoBlock>

      <DemoBlock title="children 自定义内容">
        <View style={styles.row}>
          <FAB onPress={tap("自定义字")}>
            <Text style={styles.customGlyph}>AI</Text>
          </FAB>
          <FAB
            variant="edge"
            docked={false}
            onPress={tap("自定义 edge")}
          >
            <Text style={styles.customEdge}>在线客服</Text>
          </FAB>
        </View>
      </DemoBlock>
    </ScrollView>
  );
}

const meta = {
  title: "UI/Layout 布局/FAB",
  component: FAB,
} satisfies Meta<typeof FAB>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "+",
    onPress: () => {},
  },
  render: () => <FABGallery />,
};

const styles = StyleSheet.create({
  page: {
    padding: 16,
    paddingBottom: 48,
  },
  result: {
    marginBottom: 12,
    fontSize: 13,
    color: "#888",
  },
  block: {
    marginBottom: 20,
    gap: 10,
  },
  blockTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#666",
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 16,
  },
  stage: {
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#E5E7EB",
    overflow: "hidden",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  stageHint: {
    fontSize: 13,
    color: "#9CA3AF",
  },
  cornerFab: {
    position: "absolute",
    right: 16,
    bottom: 16,
  },
  customGlyph: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  customEdge: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
});
