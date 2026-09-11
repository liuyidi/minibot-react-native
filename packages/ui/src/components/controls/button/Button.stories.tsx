import type { Meta, StoryObj } from "@storybook/react-native";
import type { ReactNode } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { Button } from "./Button";

function DemoBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.block}>
      <Text style={styles.blockTitle}>{title}</Text>
      <View style={styles.blockBody}>{children}</View>
    </View>
  );
}

function ButtonGallery() {
  return (
    <ScrollView contentContainerStyle={styles.page}>
      <DemoBlock title="填充模式">
        <View style={styles.row}>
          <Button fill="solid" onPress={() => {}}>
            Solid
          </Button>
          <Button fill="outline" onPress={() => {}}>
            Outline
          </Button>
          <Button fill="none" onPress={() => {}}>
            None
          </Button>
        </View>
      </DemoBlock>

      <DemoBlock title="按钮尺寸">
        <View style={[styles.row, styles.rowAlignCenter]}>
          <Button size="mini" onPress={() => {}}>
            Mini
          </Button>
          <Button size="small" onPress={() => {}}>
            Small
          </Button>
          <Button size="middle" onPress={() => {}}>
            Middle
          </Button>
          <Button size="large" onPress={() => {}}>
            Large
          </Button>
        </View>
      </DemoBlock>

      <DemoBlock title="块级按钮">
        <Button block size="large" onPress={() => {}}>
          块级按钮
        </Button>
      </DemoBlock>

      <DemoBlock title="按钮类型">
        <View style={styles.row}>
          <Button variant="primary" onPress={() => {}}>
            Primary
          </Button>
          <Button variant="success" onPress={() => {}}>
            Success
          </Button>
          <Button variant="secondary" onPress={() => {}}>
            Default
          </Button>
        </View>
        <View style={styles.row}>
          <Button variant="destructive" onPress={() => {}}>
            Danger
          </Button>
          <Button variant="warning" onPress={() => {}}>
            Warning
          </Button>
        </View>
      </DemoBlock>

      <DemoBlock title="禁用按钮">
        <View style={styles.row}>
          <Button variant="primary" disabled onPress={() => {}}>
            禁用
          </Button>
          <Button variant="success" disabled onPress={() => {}}>
            禁用
          </Button>
        </View>
      </DemoBlock>

      <DemoBlock title="加载状态">
        <View style={styles.row}>
          <Button loading onPress={() => {}}>
            加载中
          </Button>
          <Button variant="success" loading onPress={() => {}}>
            加载中...
          </Button>
        </View>
      </DemoBlock>

      <DemoBlock title="自定义内容">
        <Button block onPress={() => {}}>
          <View style={{ alignItems: "center" }}>
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>
              1.1元抢购
            </Text>
            <Text style={{ color: "rgba(255,255,255,0.85)", fontSize: 12 }}>
              已优惠 11.4元
            </Text>
          </View>
        </Button>
      </DemoBlock>
    </ScrollView>
  );
}

const meta = {
  title: "UI/Controls 控件/Button",
  component: Button,
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Button",
    onPress: () => {},
  },
  render: () => <ButtonGallery />,
};

const styles = StyleSheet.create({
  page: {
    padding: 16,
    paddingBottom: 40,
  },
  block: {
    marginBottom: 20,
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
  },
  rowAlignCenter: {
    alignItems: "center",
  },
});
