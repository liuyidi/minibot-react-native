import type { Meta, StoryObj } from "@storybook/react-native";
import { useState, type ReactNode } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { Space } from "../../foundation/space";
import { Checkbox } from "./Checkbox";

function DemoBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.block}>
      <Text style={styles.blockTitle}>{title}</Text>
      {children}
    </View>
  );
}

function CheckboxGallery() {
  const [terms, setTerms] = useState(false);

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <DemoBlock title="受控">
        <Checkbox checked={terms} onChange={setTerms} label="Accept terms" />
      </DemoBlock>
      <DemoBlock title="非受控">
        <Space direction="vertical" gap={12}>
          <Checkbox defaultChecked label="Default checked" />
          <Checkbox label="Default unchecked" />
        </Space>
      </DemoBlock>
      <DemoBlock title="禁用">
        <Space direction="vertical" gap={12}>
          <Checkbox checked disabled label="Checked disabled" />
          <Checkbox disabled label="Unchecked disabled" />
        </Space>
      </DemoBlock>
    </ScrollView>
  );
}

const meta = {
  title: "UI/Controls 控件/Checkbox",
  component: Checkbox,
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { defaultChecked: true, label: "Accept terms" },
  render: () => <CheckboxGallery />,
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
