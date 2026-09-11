import type { ReactElement, ReactNode } from "react";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
  type FlatListProps,
  type ListRenderItem,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { useResolvedTheme } from "../../../theme/ThemeProvider";
import type { UiTheme } from "../../../theme/types";
import { EmptyState } from "../empty-state";
import { usePullRefreshControl } from "../pull-refresh";

export type InfiniteListProps<T> = Omit<
  FlatListProps<T>,
  "data" | "renderItem" | "onEndReached" | "ListFooterComponent" | "refreshControl"
> & {
  data: T[];
  renderItem: ListRenderItem<T>;
  /** Pull-to-refresh. */
  refreshing?: boolean;
  onRefresh?: () => void;
  /** Load-more footer. */
  loadingMore?: boolean;
  hasMore?: boolean;
  onEndReached?: () => void;
  /** Empty copy when `data.length === 0` and not refreshing. */
  emptyTitle?: string;
  emptyDescription?: string;
  ListHeaderComponent?: ReactNode;
  theme?: Partial<UiTheme>;
  style?: StyleProp<ViewStyle>;
};

/**
 * FlatList with pull-to-refresh + end-reached load more.
 */
export function InfiniteList<T>({
  data,
  renderItem,
  refreshing = false,
  onRefresh,
  loadingMore = false,
  hasMore = true,
  onEndReached,
  emptyTitle = "暂无数据",
  emptyDescription,
  ListHeaderComponent,
  theme: themeOverride,
  style,
  onEndReachedThreshold = 0.3,
  keyExtractor,
  ...rest
}: InfiniteListProps<T>): ReactElement {
  const palette = useResolvedTheme(themeOverride);
  const [guard, setGuard] = useState(false);
  const refreshControl = usePullRefreshControl(
    refreshing,
    onRefresh ?? (() => {}),
    themeOverride,
  );

  const handleEnd = useCallback(() => {
    if (!hasMore || loadingMore || refreshing || guard) return;
    if (data.length === 0) return;
    setGuard(true);
    onEndReached?.();
    // Allow next page after a tick so parent can flip loadingMore.
    requestAnimationFrame(() => setGuard(false));
  }, [
    hasMore,
    loadingMore,
    refreshing,
    guard,
    data.length,
    onEndReached,
  ]);

  const footer =
    loadingMore && data.length > 0 ? (
      <View style={styles.footer}>
        <ActivityIndicator color={palette.primary} />
        <Text style={[styles.footerText, { color: palette.muted }]}>
          加载中…
        </Text>
      </View>
    ) : !hasMore && data.length > 0 ? (
      <Text style={[styles.footerText, styles.footerDone, { color: palette.muted }]}>
        没有更多了
      </Text>
    ) : null;

  return (
    <FlatList
      style={[styles.flex, style]}
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      refreshControl={onRefresh ? refreshControl : undefined}
      onEndReached={handleEnd}
      onEndReachedThreshold={onEndReachedThreshold}
      ListHeaderComponent={ListHeaderComponent as ReactElement | null}
      ListFooterComponent={footer}
      ListEmptyComponent={
        refreshing ? (
          <View style={styles.emptyLoading}>
            <ActivityIndicator color={palette.primary} />
          </View>
        ) : (
          <EmptyState
            title={emptyTitle}
            description={emptyDescription}
            theme={themeOverride}
          />
        )
      }
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  footer: {
    paddingVertical: 16,
    alignItems: "center",
    gap: 8,
  },
  footerText: {
    fontSize: 13,
    textAlign: "center",
  },
  footerDone: {
    paddingVertical: 16,
  },
  emptyLoading: {
    paddingVertical: 48,
    alignItems: "center",
  },
});
