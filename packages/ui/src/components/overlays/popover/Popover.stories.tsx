import type { Meta, StoryObj } from "@storybook/react-native";
import { useState, type ReactNode } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import {
  Copy,
  Link2,
  MoreHorizontal,
  Share2,
  Trash2,
} from "lucide-react-native";

import { Button } from "../../controls/button";
import { Icon } from "../../foundation/icon";
import {
  Popover,
  Tooltip,
  type PopoverAction,
  type PopoverPlacement,
} from "./Popover";

function DemoBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.block}>
      <Text style={styles.blockTitle}>{title}</Text>
      <View style={styles.blockBody}>{children}</View>
    </View>
  );
}

function PlacementGrid() {
  const placements: PopoverPlacement[] = [
    "top-start",
    "top",
    "top-end",
    "left-start",
    "left",
    "left-end",
    "right-start",
    "right",
    "right-end",
    "bottom-start",
    "bottom",
    "bottom-end",
  ];
  return (
    <View style={styles.placementGrid}>
      {placements.map((p) => (
        <Popover
          key={p}
          placement={p}
          content={`placement: ${p}`}
          mode="dark"
        >
          <Button size="mini" variant="secondary" style={styles.placementBtn}>
            {p}
          </Button>
        </Popover>
      ))}
    </View>
  );
}

function ActionsDemo() {
  const [last, setLast] = useState<string>("—");
  const actions: PopoverAction[] = [
    {
      text: "复制",
      icon: <Icon icon={Copy} size={16} color="text" />,
      onPress: () => setLast("复制"),
    },
    {
      text: "分享",
      icon: <Icon icon={Share2} size={16} color="text" />,
      onPress: () => setLast("分享"),
    },
    {
      text: "删除",
      icon: <Icon icon={Trash2} size={16} color="red" />,
      color: "#ef4444",
      onPress: () => setLast("删除"),
    },
  ];
  return (
    <View style={styles.gap8}>
      <Popover actions={actions} placement="bottom-end">
        <Button size="small">
          <View style={styles.btnInner}>
            <Icon icon={MoreHorizontal} size={18} color="onPrimary" />
            <Text style={styles.btnInnerText}>操作菜单</Text>
          </View>
        </Button>
      </Popover>
      <Text style={styles.hint}>最近选择：{last}</Text>
    </View>
  );
}

function HorizontalActionsDemo() {
  const actions: PopoverAction[] = [
    {
      text: "链接",
      icon: <Icon icon={Link2} size={18} color="#fff" />,
    },
    {
      text: "复制",
      icon: <Icon icon={Copy} size={18} color="#fff" />,
    },
    {
      text: "分享",
      icon: <Icon icon={Share2} size={18} color="#fff" />,
    },
  ];
  return (
    <Popover
      mode="dark"
      actions={actions}
      actionsDirection="horizontal"
      placement="top"
    >
      <Button size="small" variant="secondary">
        横向动作
      </Button>
    </Popover>
  );
}

function PopoverGallery() {
  return (
    <ScrollView contentContainerStyle={styles.page}>
      <DemoBlock title="基础气泡（带箭头）">
        <View style={styles.row}>
          <Popover content="这是一段气泡说明，点蒙层关闭。">
            <Button size="small">浅色</Button>
          </Popover>
          <Popover mode="dark" content="深色主题气泡，对齐 Vant dark。">
            <Button size="small" variant="secondary">
              深色
            </Button>
          </Popover>
          <Popover showArrow={false} content="无箭头">
            <Button size="small" variant="ghost">
              无箭头
            </Button>
          </Popover>
        </View>
      </DemoBlock>

      <DemoBlock title="Tooltip">
        <View style={styles.row}>
          <Tooltip title="保存后不可修改">
            <Button size="small" variant="secondary">
              默认深色
            </Button>
          </Tooltip>
          <Tooltip title="浅色提示" mode="light" placement="top">
            <Button size="small" variant="ghost">
              浅色 top
            </Button>
          </Tooltip>
        </View>
      </DemoBlock>

      <DemoBlock title="弹出位置（12 向）">
        <Text style={styles.hint}>对齐 Vant / Ant Design Mobile placement</Text>
        <PlacementGrid />
      </DemoBlock>

      <DemoBlock title="动作面板（竖向）">
        <ActionsDemo />
      </DemoBlock>

      <DemoBlock title="动作面板（横向 · 深色）">
        <HorizontalActionsDemo />
      </DemoBlock>

      <DemoBlock title="自定义内容">
        <Popover
          placement="bottom-start"
          content={
            <View style={styles.custom}>
              <Text style={styles.customTitle}>优惠说明</Text>
              <Text style={styles.customBody}>
                新用户首单立减 10 元，可与满减叠加一次。
              </Text>
              <Button size="mini" onPress={() => {}}>
                知道了
              </Button>
            </View>
          }
        >
          <Button size="small" variant="secondary">
            自定义节点
          </Button>
        </Popover>
      </DemoBlock>

      <DemoBlock title="禁用项">
        <Popover
          actions={[
            { text: "可用", onPress: () => {} },
            { text: "禁用", disabled: true },
            { text: "危险", color: "#ef4444", onPress: () => {} },
          ]}
        >
          <Button size="small">含禁用</Button>
        </Popover>
      </DemoBlock>
    </ScrollView>
  );
}

const meta = {
  title: "UI/Overlays 浮层/Popover",
  component: Popover,
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: null,
    content: "",
  },
  render: () => <PopoverGallery />,
};

const styles = StyleSheet.create({
  page: {
    padding: 16,
    paddingBottom: 48,
  },
  block: {
    marginBottom: 24,
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
    gap: 10,
    alignItems: "center",
  },
  gap8: {
    gap: 8,
  },
  hint: {
    fontSize: 12,
    color: "#aaa",
  },
  placementGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
    paddingVertical: 8,
  },
  placementBtn: {
    minWidth: 88,
  },
  btnInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  btnInnerText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  custom: {
    gap: 8,
    maxWidth: 220,
  },
  customTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111",
  },
  customBody: {
    fontSize: 13,
    lineHeight: 18,
    color: "#555",
  },
});
