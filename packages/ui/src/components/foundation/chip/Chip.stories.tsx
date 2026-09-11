import type { Meta, StoryObj } from "@storybook/react-native";
import { useState, type ReactNode } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Check, Star, Tag } from "lucide-react-native";

import { Icon } from "../icon";
import { Chip } from "./Chip";

function DemoBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.block}>
      <Text style={styles.blockTitle}>{title}</Text>
      <View style={styles.blockBody}>{children}</View>
    </View>
  );
}

function FilterChips() {
  const options = ["全部", "设备", "会话", "技能", "未读"];
  const [active, setActive] = useState("全部");
  return (
    <View style={styles.row}>
      {options.map((label) => (
        <Chip
          key={label}
          label={label}
          selected={active === label}
          onPress={() => setActive(label)}
        />
      ))}
    </View>
  );
}

function MultiSelectChips() {
  const options = ["飞书", "微信", "Webhook", "Cron"];
  const [selected, setSelected] = useState<string[]>(["飞书"]);
  const toggle = (label: string) => {
    setSelected((prev) =>
      prev.includes(label) ? prev.filter((x) => x !== label) : [...prev, label],
    );
  };
  return (
    <View style={styles.row}>
      {options.map((label) => {
        const on = selected.includes(label);
        return (
          <Chip
            key={label}
            label={label}
            selected={on}
            onPress={() => toggle(label)}
            leading={
              on ? (
                <Icon icon={Check} size={14} color="#fff" />
              ) : undefined
            }
          />
        );
      })}
    </View>
  );
}

function ChipGallery() {
  return (
    <ScrollView contentContainerStyle={styles.page}>
      <DemoBlock title="默认 / 选中">
        <View style={styles.row}>
          <Chip label="默认" />
          <Chip label="选中" selected />
          <Chip label="可点" onPress={() => {}} />
          <Chip label="选中可点" selected onPress={() => {}} />
        </View>
      </DemoBlock>

      <DemoBlock title="筛选条（单选）">
        <FilterChips />
        <Text style={styles.hint}>点按切换当前筛选项</Text>
      </DemoBlock>

      <DemoBlock title="多选标签">
        <MultiSelectChips />
        <Text style={styles.hint}>可选多个通道；选中时显示勾选图标</Text>
      </DemoBlock>

      <DemoBlock title="带 leading 图标">
        <View style={styles.row}>
          <Chip
            label="收藏"
            leading={<Icon icon={Star} size={14} color="#f59e0b" />}
            onPress={() => {}}
          />
          <Chip
            label="标签"
            leading={<Icon icon={Tag} size={14} color="#666" />}
            onPress={() => {}}
          />
          <Chip
            label="已选"
            selected
            leading={<Icon icon={Check} size={14} color="#fff" />}
            onPress={() => {}}
          />
        </View>
      </DemoBlock>

      <DemoBlock title="换行标签云">
        <View style={styles.row}>
          {[
            "Python",
            "TypeScript",
            "React Native",
            "FastAPI",
            "MCP",
            "Cron",
            "飞书机器人",
            "长任务",
          ].map((label) => (
            <Chip key={label} label={label} onPress={() => {}} />
          ))}
        </View>
      </DemoBlock>

      <DemoBlock title="只读展示（无 onPress）">
        <View style={styles.row}>
          <Chip label="只读" />
          <Chip label="系统" selected />
        </View>
        <Text style={styles.hint}>未传 onPress 时不可点，适合状态展示</Text>
      </DemoBlock>
    </ScrollView>
  );
}

const meta = {
  title: "UI/Foundation 基础/Chip",
  component: Chip,
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: "Filter", selected: false },
  render: () => <ChipGallery />,
};

export const Selected: Story = {
  args: { label: "Active", selected: true },
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
    gap: 8,
  },
  hint: {
    fontSize: 12,
    color: "#aaa",
  },
});
