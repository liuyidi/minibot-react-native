import type { Meta, StoryObj } from "@storybook/react-native";
import type { ReactNode } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Bell, MapPin, Settings } from "lucide-react-native";

import { Icon } from "../../foundation/icon";
import { ListGroup } from "../list-group";
import { ListRow } from "./ListRow";

function DemoBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.block}>
      <Text style={styles.blockTitle}>{title}</Text>
      {children}
    </View>
  );
}

function ListRowGallery() {
  return (
    <ScrollView contentContainerStyle={styles.page}>
      <DemoBlock title="基础（title + value）">
        <ListGroup>
          <ListRow title="单元格" value="内容" showDivider />
          <ListRow title="单元格" value="内容" label="描述信息" />
        </ListGroup>
      </DemoBlock>

      <DemoBlock title="大号 size=large">
        <ListGroup>
          <ListRow title="单元格" value="内容" size="large" showDivider />
          <ListRow
            title="单元格"
            value="内容"
            label="描述信息"
            size="large"
          />
        </ListGroup>
      </DemoBlock>

      <DemoBlock title="图标 icon / leading">
        <ListGroup>
          <ListRow title="位置" icon={MapPin} isLink onPress={() => {}} showDivider />
          <ListRow
            title="通知"
            icon={Bell}
            value="开启"
            isLink
            onPress={() => {}}
            showDivider
          />
          <ListRow
            title="自定义 leading"
            leading={<Icon icon={Settings} size={20} color="primary" />}
            isLink
            onPress={() => {}}
          />
        </ListGroup>
      </DemoBlock>

      <DemoBlock title="isLink 箭头">
        <ListGroup>
          <ListRow title="默认右箭头" isLink onPress={() => {}} showDivider />
          <ListRow
            title="带内容"
            value="详细信息"
            isLink
            onPress={() => {}}
            showDivider
          />
          <ListRow
            title="向下"
            isLink
            arrowDirection="down"
            onPress={() => {}}
          />
        </ListGroup>
      </DemoBlock>

      <DemoBlock title="label + center">
        <ListGroup>
          <ListRow
            title="默认顶对齐"
            value="内容"
            label="多行描述时右侧 value 与标题顶对齐。"
            showDivider
          />
          <ListRow
            title="垂直居中"
            value="内容"
            label="center 后左右列垂直居中。"
            center
          />
        </ListGroup>
      </DemoBlock>

      <DemoBlock title="destructive / 自定义 title">
        <ListGroup>
          <ListRow
            title="退出登录"
            destructive
            isLink
            onPress={() => {}}
            showDivider
          />
          <ListRow
            title={
              <View style={styles.titleRow}>
                <Text style={styles.customTitle}>单元格</Text>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>标签</Text>
                </View>
              </View>
            }
            value="内容"
            isLink
            onPress={() => {}}
          />
        </ListGroup>
      </DemoBlock>
    </ScrollView>
  );
}

const meta = {
  title: "UI/Lists 列表/ListRow",
  component: ListRow,
} satisfies Meta<typeof ListRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Language",
    value: "English",
    isLink: true,
    onPress: () => {},
  },
  render: () => <ListRowGallery />,
};

const styles = StyleSheet.create({
  page: {
    padding: 16,
    paddingBottom: 40,
    gap: 8,
  },
  block: {
    marginBottom: 16,
    gap: 10,
  },
  blockTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#666",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  customTitle: {
    fontSize: 16,
    color: "#111",
  },
  tag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: "rgba(37, 99, 235, 0.12)",
  },
  tagText: {
    fontSize: 11,
    color: "#2563EB",
    fontWeight: "600",
  },
});
