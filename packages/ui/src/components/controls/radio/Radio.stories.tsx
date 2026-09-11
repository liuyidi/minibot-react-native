import type { Meta, StoryObj } from "@storybook/react-native";
import { useState, type ReactNode } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { Radio, RadioGroup } from "./Radio";

function DemoBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.block}>
      <Text style={styles.blockTitle}>{title}</Text>
      {children}
    </View>
  );
}

function RadioGallery() {
  const [value, setValue] = useState("a");

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <DemoBlock title="受控">
        <RadioGroup value={value} onChange={setValue}>
          <Radio value="a" label="Option A" />
          <Radio value="b" label="Option B" />
        </RadioGroup>
      </DemoBlock>
      <DemoBlock title="非受控">
        <RadioGroup defaultValue="b">
          <Radio value="a" label="Option A" />
          <Radio value="b" label="Option B" />
        </RadioGroup>
      </DemoBlock>
    </ScrollView>
  );
}

const meta = {
  title: "UI/Controls 控件/Radio",
  component: RadioGroup,
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultValue: "a",
    children: (
      <>
        <Radio value="a" label="Option A" />
        <Radio value="b" label="Option B" />
      </>
    ),
  },
  render: () => <RadioGallery />,
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
