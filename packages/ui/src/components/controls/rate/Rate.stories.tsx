import type { Meta, StoryObj } from "@storybook/react-native";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Button } from "../button";
import { Rate } from "./Rate";

function Demo() {
  const [v, setV] = useState(3);
  return (
    <View style={styles.page}>
      <Text style={styles.label}>受控 · {v} 星</Text>
      <Rate value={v} onChange={setV} />
      <Text style={styles.label}>只读</Text>
      <Rate value={4} readonly />
      <Button size="small" onPress={() => setV(0)}>
        清空
      </Button>
    </View>
  );
}

const meta = {
  title: "UI/Controls 控件/Rate",
  component: Rate,
} satisfies Meta<typeof Rate>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { defaultValue: 3 },
  render: () => <Demo />,
};

const styles = StyleSheet.create({
  page: { padding: 16, gap: 12 },
  label: { fontSize: 13, color: "#666" },
});
