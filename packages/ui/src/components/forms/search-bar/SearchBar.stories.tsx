import type { Meta, StoryObj } from "@storybook/react-native";
import { useState, type ReactNode } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Search } from "lucide-react-native";

import { Icon } from "../../foundation/icon";
import { SearchBar } from "./SearchBar";

function DemoBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.block}>
      <Text style={styles.blockTitle}>{title}</Text>
      {children}
    </View>
  );
}

function SearchBarGallery() {
  const [basic, setBasic] = useState("");
  const [focusCancel, setFocusCancel] = useState("");
  const [alwaysCancel, setAlwaysCancel] = useState("美食");
  const [customCancel, setCustomCancel] = useState("");
  const [iconValue, setIconValue] = useState("");
  const [lastEvent, setLastEvent] = useState("—");

  return (
    <ScrollView
      contentContainerStyle={styles.page}
      keyboardShouldPersistTaps="handled"
    >
      <DemoBlock title="基础用法">
        <SearchBar
          value={basic}
          placeholder="请输入内容"
          onChange={setBasic}
          onSearch={(v) => setLastEvent(`onSearch: ${v}`)}
          onClear={() => setLastEvent("onClear")}
        />
      </DemoBlock>

      <DemoBlock title="获取焦点后显示取消按钮">
        <SearchBar
          value={focusCancel}
          placeholder="请输入内容"
          showCancelButton
          onChange={setFocusCancel}
          onCancel={() => setLastEvent("onCancel")}
          onSearch={(v) => setLastEvent(`onSearch: ${v}`)}
        />
      </DemoBlock>

      <DemoBlock title="取消按钮始终展示">
        <SearchBar
          value={alwaysCancel}
          placeholder="请输入内容"
          showCancelButton={() => true}
          onChange={setAlwaysCancel}
          onCancel={() => setLastEvent("onCancel (always)")}
        />
      </DemoBlock>

      <DemoBlock title="自定义取消按钮展示时机">
        <Text style={styles.hint}>有内容时显示取消</Text>
        <SearchBar
          value={customCancel}
          placeholder="请输入内容"
          showCancelButton={(_focus, val) => val.length > 0}
          onChange={setCustomCancel}
          onCancel={() => setLastEvent("onCancel (custom)")}
        />
      </DemoBlock>

      <DemoBlock title="自定义搜索图标">
        <SearchBar
          value={iconValue}
          placeholder="自定义 icon"
          searchIcon={<Icon icon={Search} size={18} color="primary" />}
          onChange={setIconValue}
        />
      </DemoBlock>

      <DemoBlock title="非受控">
        <SearchBar defaultValue="默认关键词" placeholder="请输入内容" />
      </DemoBlock>

      <DemoBlock title="事件日志">
        <Text style={styles.log}>{lastEvent}</Text>
      </DemoBlock>
    </ScrollView>
  );
}

const meta = {
  title: "UI/Forms 表单/SearchBar",
  component: SearchBar,
} satisfies Meta<typeof SearchBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <SearchBarGallery />,
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
  hint: {
    fontSize: 13,
    color: "#999",
  },
  log: {
    fontSize: 13,
    color: "#333",
  },
});
