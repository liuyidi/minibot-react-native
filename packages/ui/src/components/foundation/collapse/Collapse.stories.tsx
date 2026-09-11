import type { Meta, StoryObj } from "@storybook/react-native";
import { useState, type ReactNode } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { CircleHelp, Minus, Plus } from "lucide-react-native";

import { Tag } from "../tag";
import { Icon } from "../icon";
import { useUiTheme } from "../../../theme/ThemeProvider";
import { Collapse } from "./Collapse";

function DemoBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.block}>
      <Text style={styles.blockTitle}>{title}</Text>
      {children}
    </View>
  );
}

function PanelBody({ children }: { children: ReactNode }) {
  const theme = useUiTheme();
  return (
    <Text style={[styles.bodyText, { color: theme.textSecondary }]}>
      {children}
    </Text>
  );
}

function PanelList({ children }: { children: ReactNode }) {
  const theme = useUiTheme();
  return (
    <View
      style={[
        styles.list,
        { backgroundColor: theme.card, borderColor: theme.border },
      ]}
    >
      {children}
    </View>
  );
}

function PanelRow({
  last,
  children,
}: {
  last?: boolean;
  children: ReactNode;
}) {
  const theme = useUiTheme();
  return (
    <View
      style={[
        styles.row,
        !last && { borderBottomColor: theme.border, borderBottomWidth: StyleSheet.hairlineWidth },
      ]}
    >
      {children}
    </View>
  );
}

function AccordionDemo() {
  const [open, setOpen] = useState<string | null>("1");
  const items = [
    { key: "1", title: "第一项", body: "手风琴模式只能同时展开一个面板。" },
    { key: "2", title: "第二项", body: "展开此项会自动收起其他项。" },
    { key: "3", title: "第三项", body: "适合 FAQ、设置说明这类互斥内容。" },
  ];
  return (
    <PanelList>
      {items.map((item, i) => (
        <PanelRow key={item.key} last={i === items.length - 1}>
          <Collapse
            title={item.title}
            expanded={open === item.key}
            onChange={(next) => setOpen(next ? item.key : null)}
          >
            <PanelBody>{item.body}</PanelBody>
          </Collapse>
        </PanelRow>
      ))}
    </PanelList>
  );
}

function BasicDemo() {
  return (
    <PanelList>
      <PanelRow>
        <Collapse title="第一项" defaultExpanded>
          <PanelBody>默认展开第一项。多个面板可以同时打开。</PanelBody>
        </Collapse>
      </PanelRow>
      <PanelRow>
        <Collapse title="第二项">
          <PanelBody>这是第二项的内容。</PanelBody>
        </Collapse>
      </PanelRow>
      <PanelRow last>
        <Collapse title="第三项">
          <PanelBody>这是第三项的内容。</PanelBody>
        </Collapse>
      </PanelRow>
    </PanelList>
  );
}

function CollapseGallery() {
  return (
    <ScrollView contentContainerStyle={styles.page}>
      <DemoBlock title="使用规则">
        <Collapse title="使用规则" defaultExpanded={false}>
          <PanelBody>
            {`1. 不可与其他优惠同享
2. 仅限指定品类使用
3. 过期作废`}
          </PanelBody>
        </Collapse>
      </DemoBlock>

      <DemoBlock title="基础用法">
        <BasicDemo />
      </DemoBlock>

      <DemoBlock title="手风琴">
        <AccordionDemo />
      </DemoBlock>

      <DemoBlock title="自定义标题">
        <PanelList>
          <PanelRow>
            <Collapse
              header={
                <View style={styles.customTitle}>
                  <Text style={styles.customTitleText}>标题 1</Text>
                  <Icon icon={CircleHelp} size={16} color="muted" />
                </View>
              }
            >
              <PanelBody>标题栏可放 Icon、Tag 等自定义内容。</PanelBody>
            </Collapse>
          </PanelRow>
          <PanelRow last>
            <Collapse
              header={
                <View style={styles.customTitle}>
                  <Text style={styles.customTitleText}>标题 2</Text>
                  <Tag label="新" variant="danger" fill="soft" />
                </View>
              }
            >
              <PanelBody>适合带状态标记的说明项。</PanelBody>
            </Collapse>
          </PanelRow>
        </PanelList>
      </DemoBlock>

      <DemoBlock title="自定义箭头">
        <PanelList>
          <PanelRow>
            <Collapse
              title="加减号"
              defaultExpanded
              arrow={(open) => (
                <Icon icon={open ? Minus : Plus} size={16} color="muted" />
              )}
            >
              <PanelBody>通过 arrow 渲染函数自定义展开/收起图标。</PanelBody>
            </Collapse>
          </PanelRow>
          <PanelRow last>
            <Collapse title="隐藏箭头" arrow={false}>
              <PanelBody>arrow={"{false}"} 时不显示右侧图标。</PanelBody>
            </Collapse>
          </PanelRow>
        </PanelList>
      </DemoBlock>
    </ScrollView>
  );
}

const meta = {
  title: "UI/Foundation 基础/Collapse",
  component: Collapse,
} satisfies Meta<typeof Collapse>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "使用规则",
    defaultExpanded: false,
    children: (
      <Text style={{ fontSize: 13, color: "#666", lineHeight: 20 }}>
        1. 不可与其他优惠同享{"\n"}
        2. 仅限指定品类使用{"\n"}
        3. 过期作废
      </Text>
    ),
  },
  render: () => <CollapseGallery />,
};

const styles = StyleSheet.create({
  page: {
    paddingBottom: 40,
  },
  block: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    gap: 10,
  },
  blockTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#666",
  },
  list: {
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
  row: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  bodyText: {
    fontSize: 13,
    lineHeight: 20,
    paddingBottom: 8,
  },
  customTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  customTitleText: {
    fontSize: 15,
    fontWeight: "500",
  },
});
