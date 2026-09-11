import type { Meta, StoryObj } from "@storybook/react-native";
import type { ReactNode } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { Flex } from "./Flex";

function DemoBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.block}>
      <Text style={styles.blockTitle}>{title}</Text>
      <View style={styles.blockBody}>{children}</View>
    </View>
  );
}

function Box({
  label,
  color,
  style,
}: {
  label: string;
  color: string;
  style?: object;
}) {
  return (
    <View style={[styles.box, { backgroundColor: color }, style]}>
      <Text style={styles.boxLabel}>{label}</Text>
    </View>
  );
}

function FlexGallery() {
  return (
    <ScrollView contentContainerStyle={styles.page}>
      <DemoBlock title="左中右（固定 + 自适应）">
        <Flex align="center" gap={8}>
          <Box label="左 40" color="#E8E8E8" style={{ width: 40 }} />
          <Flex.Item>
            <Box label="中间自适应" color="#D0E8FF" />
          </Flex.Item>
          <Box label="右 40" color="#E8E8E8" style={{ width: 40 }} />
        </Flex>
      </DemoBlock>

      <DemoBlock title="上中下（中间可滚）">
        <Flex direction="vertical" style={styles.verticalDemo}>
          <Box label="顶 48" color="#E8E8E8" style={{ height: 48 }} />
          <Flex.Item>
            <ScrollView>
              {Array.from({ length: 12 }, (_, i) => (
                <Box
                  key={i}
                  label={`内容行 ${i + 1}`}
                  color={i % 2 === 0 ? "#D0E8FF" : "#E8F5E9"}
                  style={{ marginBottom: 4 }}
                />
              ))}
            </ScrollView>
          </Flex.Item>
          <Box label="底 56" color="#E8E8E8" style={{ height: 56 }} />
        </Flex>
      </DemoBlock>

      <DemoBlock title="justify=between（无 Item）">
        <Flex justify="between" align="center">
          <Box label="A" color="#E8E8E8" style={{ width: 48 }} />
          <Box label="B" color="#E8E8E8" style={{ width: 48 }} />
          <Box label="C" color="#E8E8E8" style={{ width: 48 }} />
        </Flex>
      </DemoBlock>

      <DemoBlock title="自定义 flex 比例 1 : 2">
        <Flex gap={8}>
          <Flex.Item flex={1}>
            <Box label="flex=1" color="#D0E8FF" />
          </Flex.Item>
          <Flex.Item flex={2}>
            <Box label="flex=2" color="#FFE0B2" />
          </Flex.Item>
        </Flex>
      </DemoBlock>
    </ScrollView>
  );
}

const meta = {
  title: "UI/Foundation 基础/Flex",
  component: Flex,
} satisfies Meta<typeof Flex>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Family: Story = {
  render: () => <FlexGallery />,
};

const styles = StyleSheet.create({
  page: { paddingBottom: 40 },
  block: {
    paddingHorizontal: 16,
    paddingTop: 20,
    gap: 10,
  },
  blockTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  blockBody: {
    gap: 8,
  },
  box: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  boxLabel: {
    fontSize: 13,
    color: "#333",
  },
  verticalDemo: {
    height: 320,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#CCC",
    borderRadius: 8,
    overflow: "hidden",
  },
});
