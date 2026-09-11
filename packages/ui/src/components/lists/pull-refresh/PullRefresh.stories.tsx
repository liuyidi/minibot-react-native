import type { Meta, StoryObj } from "@storybook/react-native";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { PullRefresh } from "./PullRefresh";

function Demo() {
  const [refreshing, setRefreshing] = useState(false);
  const [n, setN] = useState(0);
  return (
    <PullRefresh
      style={styles.box}
      refreshing={refreshing}
      onRefresh={() => {
        setRefreshing(true);
        setTimeout(() => {
          setN((x) => x + 1);
          setRefreshing(false);
        }, 800);
      }}
    >
      <View style={styles.pad}>
        <Text>下拉刷新演示 · {n}</Text>
      </View>
    </PullRefresh>
  );
}

const meta = {
  title: "UI/Lists 列表/PullRefresh",
  component: PullRefresh,
} satisfies Meta<typeof PullRefresh>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    refreshing: false,
    onRefresh: () => {},
  },
  render: () => <Demo />,
};

const styles = StyleSheet.create({
  box: {
    height: 240,
    margin: 16,
    borderRadius: 12,
    backgroundColor: "#fff",
  },
  pad: {
    padding: 24,
  },
});
