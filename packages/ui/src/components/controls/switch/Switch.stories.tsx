import type { Meta, StoryObj } from "@storybook/react-native";
import { useState, type ReactNode } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Check, X } from "lucide-react-native";

import { Icon } from "../../foundation/icon";
import { Space } from "../../foundation/space";
import { Switch } from "./Switch";

function DemoBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.block}>
      <Text style={styles.blockTitle}>{title}</Text>
      {children}
    </View>
  );
}

function mockRequest() {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, 1000);
  });
}

function SwitchGallery() {
  const [basic, setBasic] = useState(false);
  const [asyncOn, setAsyncOn] = useState(false);
  const [manual, setManual] = useState(false);
  const [manualLoading, setManualLoading] = useState(false);

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <DemoBlock title="基础用法">
        <Space direction="horizontal" align="center" gap={16}>
          <Switch checked={basic} onChange={setBasic} />
          <Switch defaultChecked />
        </Space>
      </DemoBlock>

      <DemoBlock title="文字和图标">
        <Space direction="horizontal" align="center" gap={16} wrap>
          <Switch uncheckedText="关" checkedText="开" defaultChecked />
          <Switch
            defaultChecked
            checkedText={<Icon icon={Check} size={14} color="onPrimary" />}
            uncheckedText={<Icon icon={X} size={14} color="muted" />}
          />
          <Switch uncheckedText="0" checkedText="1" />
        </Space>
      </DemoBlock>

      <DemoBlock title="禁用状态">
        <Space direction="horizontal" align="center" gap={16}>
          <Switch disabled />
          <Switch disabled defaultChecked />
        </Space>
      </DemoBlock>

      <DemoBlock title="加载状态">
        <Space direction="horizontal" align="center" gap={16}>
          <Switch loading />
          <Switch loading defaultChecked />
          <Switch
            checked={manual}
            loading={manualLoading}
            onChange={(v) => {
              setManualLoading(true);
              setTimeout(() => {
                setManual(v);
                setManualLoading(false);
              }, 800);
            }}
          />
        </Space>
      </DemoBlock>

      <DemoBlock title="异步 onChange">
        <Switch
          checked={asyncOn}
          onChange={async (v) => {
            await mockRequest();
            setAsyncOn(v);
          }}
        />
      </DemoBlock>
    </ScrollView>
  );
}

const meta = {
  title: "UI/Controls 控件/Switch",
  component: Switch,
} satisfies Meta<typeof Switch>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultChecked: true,
  },
  render: () => <SwitchGallery />,
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
});
