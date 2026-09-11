import type { Meta, StoryObj } from "@storybook/react-native";
import { useState, type ReactNode } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { SegmentedControl } from "./SegmentedControl";

const options = [
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
  { label: "System", value: "system" },
];

function DemoBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.block}>
      <Text style={styles.blockTitle}>{title}</Text>
      {children}
    </View>
  );
}

function SegmentedGallery() {
  const [value, setValue] = useState("light");

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <DemoBlock title="受控">
        <SegmentedControl options={options} value={value} onChange={setValue} />
      </DemoBlock>
      <DemoBlock title="非受控">
        <SegmentedControl options={options} defaultValue="system" />
      </DemoBlock>
    </ScrollView>
  );
}

const meta = {
  title: "UI/Controls 控件/SegmentedControl",
  component: SegmentedControl,
} satisfies Meta<typeof SegmentedControl>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    options,
    defaultValue: "light",
  },
  render: () => <SegmentedGallery />,
};

const styles = StyleSheet.create({
  page: { paddingBottom: 40 },
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
});
