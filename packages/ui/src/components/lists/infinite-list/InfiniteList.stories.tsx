import type { Meta, StoryObj } from "@storybook/react-native";
import { useCallback, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { ListRow } from "../list-row";
import { PullRefresh } from "../pull-refresh";
import { InfiniteList } from "./InfiniteList";

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function PullDemo() {
  const [refreshing, setRefreshing] = useState(false);
  const [n, setN] = useState(0);
  return (
    <PullRefresh
      style={styles.box}
      refreshing={refreshing}
      onRefresh={async () => {
        setRefreshing(true);
        await sleep(800);
        setN((x) => x + 1);
        setRefreshing(false);
      }}
    >
      <View style={styles.pad}>
        <Text style={styles.hint}>下拉刷新 · 次数 {n}</Text>
      </View>
    </PullRefresh>
  );
}

function InfiniteDemo() {
  const [items, setItems] = useState(() =>
    Array.from({ length: 12 }, (_, i) => ({ id: String(i), title: `行 ${i + 1}` })),
  );
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const hasMore = page < 4;

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await sleep(600);
    setItems(
      Array.from({ length: 12 }, (_, i) => ({
        id: `r-${i}`,
        title: `刷新后 ${i + 1}`,
      })),
    );
    setPage(1);
    setRefreshing(false);
  }, []);

  const onEndReached = useCallback(async () => {
    if (!hasMore || loadingMore) return;
    setLoadingMore(true);
    await sleep(700);
    const next = page + 1;
    setItems((prev) => [
      ...prev,
      ...Array.from({ length: 8 }, (_, i) => {
        const n = prev.length + i;
        return { id: `p${next}-${i}`, title: `行 ${n + 1}` };
      }),
    ]);
    setPage(next);
    setLoadingMore(false);
  }, [hasMore, loadingMore, page]);

  return (
    <InfiniteList
      style={styles.box}
      data={items}
      keyExtractor={(item) => item.id}
      refreshing={refreshing}
      onRefresh={onRefresh}
      loadingMore={loadingMore}
      hasMore={hasMore}
      onEndReached={onEndReached}
      renderItem={({ item }) => (
        <ListRow title={item.title} showDivider />
      )}
    />
  );
}

const meta = {
  title: "UI/Lists 列表/InfiniteList",
  component: InfiniteList,
} satisfies Meta<typeof InfiniteList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: [],
    renderItem: () => null,
  },
  render: () => (
    <View style={styles.page}>
      <Text style={styles.section}>PullRefresh</Text>
      <PullDemo />
      <Text style={styles.section}>InfiniteList</Text>
      <InfiniteDemo />
    </View>
  ),
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    padding: 16,
    gap: 12,
    minHeight: 520,
  },
  section: {
    fontSize: 13,
    fontWeight: "600",
    color: "#666",
  },
  box: {
    height: 200,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#fff",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#E5E7EB",
  },
  pad: {
    padding: 24,
  },
  hint: {
    fontSize: 15,
    color: "#333",
  },
});
