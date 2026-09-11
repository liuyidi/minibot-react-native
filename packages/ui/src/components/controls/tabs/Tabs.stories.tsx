import type { Meta, StoryObj } from "@storybook/react-native";
import { useRef, useState, type ReactNode } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Popup, type PopupAnchor } from "../../overlays/popup";
import { Tabs } from "./Tabs";

function DemoBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.block}>
      <Text style={styles.blockTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Panel({ text }: { text: string }) {
  return (
    <View style={styles.panel}>
      <Text style={styles.panelText}>{text}</Text>
    </View>
  );
}

function Glyph({ text, color }: { text: string; color: string }) {
  return <Text style={[styles.glyph, { color }]}>{text}</Text>;
}

const EXPAND_ITEMS = [
  { key: "1", label: "全部" },
  { key: "2", label: "热门" },
  { key: "3", label: "新品" },
  { key: "4", label: "优惠" },
  { key: "5", label: "数码" },
  { key: "6", label: "生活" },
  { key: "7", label: "出行" },
  { key: "8", label: "美食" },
  { key: "9", label: "酒店" },
  { key: "10", label: "门票" },
  { key: "11", label: "充电" },
  { key: "12", label: "商城" },
];

function TabsGallery() {
  const [basic, setBasic] = useState("a");
  const [short, setShort] = useState("a");
  const [scroll, setScroll] = useState("3");
  const [scrollFull, setScrollFull] = useState("2");
  const [withPanel, setWithPanel] = useState("home");
  const [withIcon, setWithIcon] = useState("home");
  const [withExtra, setWithExtra] = useState("3");
  const [expandOpen, setExpandOpen] = useState(false);
  const [expandValue, setExpandValue] = useState("3");
  const [anchor, setAnchor] = useState<PopupAnchor>({ y: 0, height: 0 });
  const expandBarRef = useRef<View>(null);

  const panels: Record<string, string> = {
    home: "首页内容区域",
    order: "订单列表内容区域",
    mine: "我的内容区域",
  };

  const activeIcon = "#1677ff";
  const idleIcon = "#999";

  const openExpand = () => {
    expandBarRef.current?.measureInWindow((_x, y, _w, height) => {
      setAnchor({ y, height });
      setExpandOpen(true);
    });
  };

  const closeExpand = () => setExpandOpen(false);

  const selectExpand = (key: string) => {
    setExpandValue(key);
    closeExpand();
  };

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <DemoBlock title="基础用法">
        <Tabs
          items={[
            { key: "a", label: "全部" },
            { key: "b", label: "进行中" },
            { key: "c", label: "已完成" },
          ]}
          value={basic}
          onChange={setBasic}
        />
        <Panel text={`当前选中：${basic}`} />
      </DemoBlock>

      <DemoBlock title="非受控">
        <Tabs
          defaultValue="b"
          items={[
            { key: "a", label: "全部" },
            { key: "b", label: "进行中" },
            { key: "c", label: "已完成" },
          ]}
        />
      </DemoBlock>

      <DemoBlock title="短指示条">
        <Tabs
          indicator="short"
          items={[
            { key: "a", label: "全部" },
            { key: "b", label: "进行中" },
            { key: "c", label: "已完成" },
          ]}
          value={short}
          onChange={setShort}
        />
      </DemoBlock>

      <DemoBlock title="自定义图标">
        <Tabs
          items={[
            {
              key: "home",
              label: "首页",
              icon: (
                <Glyph
                  text="⌂"
                  color={withIcon === "home" ? activeIcon : idleIcon}
                />
              ),
            },
            {
              key: "order",
              label: "订单",
              icon: (
                <Glyph
                  text="☰"
                  color={withIcon === "order" ? activeIcon : idleIcon}
                />
              ),
            },
            {
              key: "mine",
              label: "我的",
              icon: (
                <Glyph
                  text="☺"
                  color={withIcon === "mine" ? activeIcon : idleIcon}
                />
              ),
            },
          ]}
          value={withIcon}
          onChange={setWithIcon}
        />
      </DemoBlock>

      <DemoBlock title="超长滚动（短指示条）">
        <Tabs
          scrollable
          indicator="short"
          items={[
            { key: "1", label: "全部" },
            { key: "2", label: "热门" },
            { key: "3", label: "新品" },
            { key: "4", label: "优惠" },
            { key: "5", label: "数码" },
            { key: "6", label: "生活" },
            { key: "7", label: "出行" },
            { key: "8", label: "美食" },
          ]}
          value={scroll}
          onChange={setScroll}
        />
      </DemoBlock>

      <DemoBlock title="超长滚动（通栏指示条）">
        <Tabs
          scrollable
          indicator="full"
          items={[
            { key: "1", label: "推荐" },
            { key: "2", label: "关注" },
            { key: "3", label: "附近" },
            { key: "4", label: "视频" },
            { key: "5", label: "直播" },
            { key: "6", label: "商城" },
          ]}
          value={scrollFull}
          onChange={setScrollFull}
        />
      </DemoBlock>

      <DemoBlock title="右侧拓展（extra）">
        <Tabs
          scrollable
          indicator="short"
          items={[
            { key: "1", label: "全部" },
            { key: "2", label: "热门" },
            { key: "3", label: "新品" },
            { key: "4", label: "优惠" },
            { key: "5", label: "数码" },
            { key: "6", label: "生活" },
            { key: "7", label: "出行" },
          ]}
          value={withExtra}
          onChange={setWithExtra}
          extra={
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="更多"
              hitSlop={8}
              onPress={() => Alert.alert("拓展", "点击了右侧拓展按钮")}
              style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
            >
              <Text style={styles.extraIcon}>☰</Text>
            </Pressable>
          }
        />
        <Panel text="左侧 tabs 可滚动，右侧拓展图标固定不滚动" />
      </DemoBlock>

      <DemoBlock title="拓展展开全部（Tabs + Popup）">
        <View ref={expandBarRef} collapsable={false}>
          <Tabs
            scrollable
            indicator="short"
            items={EXPAND_ITEMS}
            value={expandValue}
            onChange={setExpandValue}
            extra={
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={expandOpen ? "收起全部" : "展开全部"}
                hitSlop={8}
                onPress={openExpand}
                style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
              >
                <Text style={styles.extraIcon}>{expandOpen ? "✕" : "▾"}</Text>
              </Pressable>
            }
          />
        </View>
        <Panel
          text={`当前选中：${
            EXPAND_ITEMS.find((i) => i.key === expandValue)?.label ?? expandValue
          }`}
        />
        <Popup
          visible={expandOpen}
          position="top"
          anchor={anchor}
          onClose={closeExpand}
        >
          <View style={styles.expandPanel}>
            <View style={styles.expandHeader}>
              <Text style={styles.expandTitle}>全部业务</Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="关闭"
                hitSlop={8}
                onPress={closeExpand}
                style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
              >
                <Text style={styles.expandClose}>✕</Text>
              </Pressable>
            </View>
            <View style={styles.expandGrid}>
              {EXPAND_ITEMS.map((item) => {
                const active = item.key === expandValue;
                return (
                  <Pressable
                    key={item.key}
                    accessibilityRole="button"
                    accessibilityState={{ selected: active }}
                    onPress={() => selectExpand(item.key)}
                    style={({ pressed }) => [
                      styles.expandCell,
                      {
                        opacity: pressed ? 0.75 : 1,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.expandCellText,
                        active && styles.expandCellTextActive,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </Popup>
      </DemoBlock>

      <DemoBlock title="搭配内容区">
        <Tabs
          items={[
            { key: "home", label: "首页" },
            { key: "order", label: "订单" },
            { key: "mine", label: "我的" },
          ]}
          value={withPanel}
          onChange={setWithPanel}
        />
        <Panel text={panels[withPanel] ?? ""} />
      </DemoBlock>
    </ScrollView>
  );
}

const meta = {
  title: "UI/Controls 控件/Tabs",
  component: Tabs,
} satisfies Meta<typeof Tabs>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [
      { key: "a", label: "全部" },
      { key: "b", label: "进行中" },
      { key: "c", label: "已完成" },
    ],
    value: "a",
    onChange: () => {},
  },
  render: () => <TabsGallery />,
};

const styles = StyleSheet.create({
  page: {
    paddingBottom: 40,
    gap: 8,
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
    marginBottom: 4,
  },
  panel: {
    paddingVertical: 20,
    paddingHorizontal: 12,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
  panelText: {
    fontSize: 14,
    color: "#333",
  },
  glyph: {
    fontSize: 14,
    lineHeight: 18,
  },
  extraIcon: {
    fontSize: 18,
    color: "#333",
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  expandPanel: {
    paddingBottom: 16,
  },
  expandHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
  },
  expandTitle: {
    fontSize: 14,
    color: "#666",
  },
  expandClose: {
    fontSize: 16,
    color: "#999",
    padding: 4,
  },
  expandGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 12,
    gap: 10,
  },
  expandCell: {
    width: "30%",
    flexGrow: 1,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  expandCellText: {
    fontSize: 14,
    color: "#333",
  },
  expandCellTextActive: {
    color: "#1677ff",
    fontWeight: "600",
  },
});
