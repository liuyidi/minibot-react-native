import type { Meta, StoryObj } from "@storybook/react-native";
import type { ReactNode } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { Button } from "../../controls/button";
import { Space } from "./Space";

function DemoBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.block}>
      <Text style={styles.blockTitle}>{title}</Text>
      <View style={styles.blockBody}>{children}</View>
    </View>
  );
}

function SpaceGallery() {
  return (
    <ScrollView contentContainerStyle={styles.page}>
      <DemoBlock title="水平方向的间距">
        <Space>
          <Button  size="small" onPress={() => {}} >按钮1</Button>
          <Button  size="small" onPress={() => {}} >按钮2</Button>
          <Button  size="small" onPress={() => {}} >按钮3</Button>
        </Space>
      </DemoBlock>

      <DemoBlock title="换行">
        <Space wrap>
          {Array.from({ length: 11 }, (_, i) => (
            <Button key={i} size="small" onPress={() => {}}>
              {`按钮${i + 1}`}
            </Button>
          ))}
        </Space>
      </DemoBlock>

      <DemoBlock title="垂直方向的间距">
        <Space direction="vertical">
          <Button  size="small" onPress={() => {}} >按钮1</Button>
          <Button  size="small" onPress={() => {}} >按钮2</Button>
          <Button  size="small" onPress={() => {}} >按钮3</Button>
        </Space>
      </DemoBlock>

      <DemoBlock title="自定义间距大小">
        <Space gap={24}>
          <Button  size="small" onPress={() => {}} >按钮1</Button>
          <Button  size="small" onPress={() => {}} >按钮2</Button>
          <Button  size="small" onPress={() => {}} >按钮3</Button>
        </Space>
      </DemoBlock>

      <DemoBlock title="渲染为块级元素">
        <Space direction="vertical" block>
          <Button  block size="small" onPress={() => {}} >按钮1</Button>
          <Button  block size="small" onPress={() => {}} >按钮2</Button>
          <Button  block size="small" onPress={() => {}} >按钮3</Button>
        </Space>
      </DemoBlock>

      <DemoBlock title="主轴对齐方式">
        <Space justify="center" block>
          <Button  size="small" onPress={() => {}} >1</Button>
          <Button  size="small" onPress={() => {}} >{"2\n2"}</Button>
          <Button  size="small" onPress={() => {}} >{"3\n3\n3"}</Button>
        </Space>
      </DemoBlock>

      <DemoBlock title="交叉轴对齐方式">
        <Space align="end">
          <Button  size="small" onPress={() => {}} >1</Button>
          <Button  size="small" onPress={() => {}} >{"2\n2"}</Button>
          <Button  size="small" onPress={() => {}} >{"3\n3\n3"}</Button>
        </Space>
      </DemoBlock>
    </ScrollView>
  );
}

const meta = {
  title: "UI/Foundation 基础/Space",
  component: Space,
} satisfies Meta<typeof Space>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <SpaceGallery />,
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
  blockBody: {},
});
