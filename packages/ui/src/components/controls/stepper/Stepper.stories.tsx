import type { Meta, StoryObj } from "@storybook/react-native";
import { useState, type ReactNode } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { Space } from "../../foundation/space";
import { Stepper } from "./Stepper";

function DemoBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.block}>
      <Text style={styles.blockTitle}>{title}</Text>
      {children}
    </View>
  );
}

function StepperGallery() {
  const [basic, setBasic] = useState(1);
  const [range, setRange] = useState(1);
  const [stepVal, setStepVal] = useState(1);

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <DemoBlock title="基础用法（受控）">
        <Space direction="horizontal" align="center" gap={12}>
          <Stepper value={basic} onChange={setBasic} />
          <Text style={styles.hint}>value = {basic}</Text>
        </Space>
      </DemoBlock>

      <DemoBlock title="非受控">
        <Stepper defaultValue={1} onChange={(v) => console.log("stepper", v)} />
      </DemoBlock>

      <DemoBlock title="范围限制 min=0 max=8">
        <Stepper value={range} min={0} max={8} onChange={setRange} />
      </DemoBlock>

      <DemoBlock title="步进 step=2 + 整数">
        <Stepper
          value={stepVal}
          min={0}
          max={20}
          step={2}
          integer
          onChange={setStepVal}
        />
      </DemoBlock>

      <DemoBlock title="禁用状态">
        <Space direction="vertical" gap={12}>
          <Stepper value={3} disabled />
          <Stepper value={1} min={1} max={5} disableMinus />
          <Stepper value={5} min={1} max={5} disablePlus />
          <Stepper defaultValue={2} disableInput />
        </Space>
      </DemoBlock>

      <DemoBlock title="关闭长按">
        <Stepper defaultValue={1} longPress={false} />
      </DemoBlock>
    </ScrollView>
  );
}

const meta = {
  title: "UI/Controls 控件/Stepper",
  component: Stepper,
} satisfies Meta<typeof Stepper>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultValue: 1,
  },
  render: () => <StepperGallery />,
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
});
