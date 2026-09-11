import type { Meta, StoryObj } from "@storybook/react-native";
import { useState, type ReactNode } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { useResolvedTheme } from "../../../theme/ThemeProvider";
import { Button } from "../../controls/button";
import { Switch } from "../../controls/switch";
import { DropdownMenu, type DropdownOption } from "./DropdownMenu";

const meta = {
  title: "UI/Overlays 浮层/DropdownMenu",
  component: DropdownMenu,
} satisfies Meta<typeof DropdownMenu>;
export default meta;
type Story = StoryObj<typeof meta>;

const OPTION_GOODS: DropdownOption[] = [
  { label: "全部商品", value: 0 },
  { label: "新款商品", value: 1 },
  { label: "活动商品", value: 2 },
];

const OPTION_SORT: DropdownOption[] = [
  { label: "默认排序", value: "a" },
  { label: "好评排序", value: "b" },
  { label: "销量排序", value: "c" },
];

function DemoBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.block}>
      <Text style={styles.blockTitle}>{title}</Text>
      <View style={styles.blockBody}>{children}</View>
    </View>
  );
}

function BasicDemo() {
  const [goods, setGoods] = useState<string | number>(0);
  const [sort, setSort] = useState<string | number>("a");
  return (
    <DropdownMenu
      items={[
        {
          key: "goods",
          value: goods,
          options: OPTION_GOODS,
          onChange: setGoods,
        },
        {
          key: "sort",
          value: sort,
          options: OPTION_SORT,
          onChange: setSort,
        },
      ]}
    />
  );
}

function CustomPanelDemo() {
  const palette = useResolvedTheme();
  const [goods, setGoods] = useState<string | number>(0);
  const [ship, setShip] = useState(false);
  const [group, setGroup] = useState(false);
  return (
    <DropdownMenu
      items={[
        {
          key: "goods",
          value: goods,
          options: OPTION_GOODS,
          onChange: setGoods,
        },
        {
          key: "filter",
          title: "筛选",
          value: 0,
          renderPanel: ({ close }) => (
            <View style={styles.filterPanel}>
              <View style={styles.filterRow}>
                <Text style={{ color: palette.text, fontSize: 15 }}>包邮</Text>
                <Switch checked={ship} onChange={setShip} />
              </View>
              <View style={styles.filterRow}>
                <Text style={{ color: palette.text, fontSize: 15 }}>团购</Text>
                <Switch checked={group} onChange={setGroup} />
              </View>
              <View style={styles.filterActions}>
                <Button  onPress={close} >确认</Button>
              </View>
            </View>
          ),
        },
      ]}
    />
  );
}

function DisabledDemo() {
  return (
    <DropdownMenu
      items={[
        {
          key: "goods",
          value: 0,
          options: OPTION_GOODS,
          disabled: true,
        },
        {
          key: "sort",
          value: "a",
          options: OPTION_SORT,
          disabled: true,
        },
      ]}
    />
  );
}

function DropdownMenuGallery() {
  return (
    <ScrollView
      contentContainerStyle={styles.scroll}
      keyboardShouldPersistTaps="handled"
    >
      <DemoBlock title="基础用法">
        <BasicDemo />
        <Text style={styles.hint}>基础筛选示例</Text>
      </DemoBlock>

      <DemoBlock title="自定义菜单内容">
        <CustomPanelDemo />
      </DemoBlock>

      <DemoBlock title="禁用菜单">
        <DisabledDemo />
      </DemoBlock>
    </ScrollView>
  );
}

export const Default: Story = {
  args: {
    items: [],
  },
  render: () => <DropdownMenuGallery />,
};

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: 48,
    gap: 8,
  },
  block: {
    marginBottom: 24,
  },
  blockTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  blockBody: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    overflow: "visible",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#E5E7EB",
    minHeight: 120,
  },
  hint: {
    marginTop: 10,
    marginHorizontal: 12,
    marginBottom: 12,
    fontSize: 12,
    color: "#9CA3AF",
  },
  filterPanel: {
    paddingVertical: 8,
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    minHeight: 48,
  },
  filterActions: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});
