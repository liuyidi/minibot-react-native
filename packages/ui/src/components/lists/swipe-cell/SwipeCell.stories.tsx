import type { Meta, StoryObj } from "@storybook/react-native";
import { useRef, useState, type ReactNode } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { ListRow } from "../list-row";
import { Button } from "../../controls/button";
import {
  SwipeCell,
  type SwipeCellAction,
  type SwipeCellRef,
} from "./SwipeCell";

function DemoBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.block}>
      <Text style={styles.blockTitle}>{title}</Text>
      {children}
    </View>
  );
}

const rightActions: SwipeCellAction[] = [
  { key: "mute", text: "免打扰", color: "warning" },
  { key: "delete", text: "删除", color: "danger" },
];

const leftActions: SwipeCellAction[] = [
  { key: "pin", text: "置顶", color: "primary" },
];

function SwipeCellGallery() {
  const ref = useRef<SwipeCellRef>(null);
  const [log, setLog] = useState("左滑 / 右滑试一下");

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <DemoBlock title="右侧操作（左滑）">
        <View style={styles.list}>
          <SwipeCell
            rightActions={rightActions}
            onAction={(a) => setLog(`右侧操作：${String(a.text)}`)}
          >
            <ListRow title="会话 A" value="左滑删除" showDivider />
          </SwipeCell>
          <SwipeCell
            rightActions={[
              { key: "delete", text: "删除", color: "danger" },
            ]}
          >
            <ListRow title="会话 B" value="仅删除" />
          </SwipeCell>
        </View>
      </DemoBlock>

      <DemoBlock title="左侧操作（右滑）">
        <View style={styles.list}>
          <SwipeCell
            leftActions={leftActions}
            onAction={(a) => setLog(`左侧操作：${String(a.text)}`)}
          >
            <ListRow title="消息" value="右滑置顶" />
          </SwipeCell>
        </View>
      </DemoBlock>

      <DemoBlock title="左右都有">
        <View style={styles.list}>
          <SwipeCell
            leftActions={leftActions}
            rightActions={rightActions}
            onOpen={(side) => setLog(`打开：${side}`)}
            onClose={() => setLog("已关闭")}
          >
            <ListRow title="双向滑动" value="左右皆可" />
          </SwipeCell>
        </View>
      </DemoBlock>

      <DemoBlock title="命令式 open / close">
        <View style={styles.list}>
          <SwipeCell
            ref={ref}
            leftActions={leftActions}
            rightActions={rightActions}
            closeOnAction={false}
            onOpen={(side) => setLog(`命令式打开：${side}`)}
            onClose={() => setLog("命令式已关闭")}
          >
            <ListRow title="受控示例" value="点下方按钮" />
          </SwipeCell>
        </View>
        <View style={styles.rowBtns}>
          <Button
            size="small"
            fill="outline"
            onPress={() => ref.current?.open("right")}
          >
            打开右侧
          </Button>
          <Button
            size="small"
            fill="outline"
            onPress={() => ref.current?.open("left")}
          >
            打开左侧
          </Button>
          <Button size="small" onPress={() => ref.current?.close()}>
            关闭
          </Button>
        </View>
      </DemoBlock>

      <Text style={styles.log}>{log}</Text>
    </ScrollView>
  );
}

const meta = {
  title: "UI/Lists 列表/SwipeCell",
  component: SwipeCell,
} satisfies Meta<typeof SwipeCell>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <ListRow title="Item" />,
    rightActions: rightActions,
  },
  render: () => <SwipeCellGallery />,
};

const styles = StyleSheet.create({
  page: {
    paddingBottom: 40,
  },
  block: {
    paddingHorizontal: 0,
    paddingTop: 16,
    paddingBottom: 8,
    gap: 8,
  },
  blockTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#666",
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  list: {
    backgroundColor: "#fff",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#eee",
  },
  rowBtns: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  log: {
    marginTop: 16,
    marginHorizontal: 16,
    fontSize: 13,
    color: "#888",
  },
});
