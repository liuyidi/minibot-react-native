import type { ReactElement, ReactNode } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  type RefreshControlProps,
  type ScrollViewProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { useResolvedTheme } from "../../../theme/ThemeProvider";
import type { UiTheme } from "../../../theme/types";

export type PullRefreshProps = Omit<ScrollViewProps, "refreshControl"> & {
  refreshing: boolean;
  onRefresh: () => void;
  /** Passed to RefreshControl (tint / colors). */
  refreshControlProps?: Omit<
    RefreshControlProps,
    "refreshing" | "onRefresh"
  >;
  children?: ReactNode;
  theme?: Partial<UiTheme>;
  style?: StyleProp<ViewStyle>;
};

/**
 * ScrollView + native pull-to-refresh.
 * For FlatList, use `usePullRefreshControl()` / compose RefreshControl yourself.
 */
export function PullRefresh({
  refreshing,
  onRefresh,
  refreshControlProps,
  children,
  theme: themeOverride,
  style,
  ...rest
}: PullRefreshProps): ReactElement {
  const palette = useResolvedTheme(themeOverride);

  return (
    <ScrollView
      style={[styles.flex, style]}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={palette.primary}
          colors={[palette.primary]}
          {...refreshControlProps}
        />
      }
      {...rest}
    >
      {children}
    </ScrollView>
  );
}

/** Build RefreshControl for FlatList / SectionList. */
export function usePullRefreshControl(
  refreshing: boolean,
  onRefresh: () => void,
  themeOverride?: Partial<UiTheme>,
): ReactElement<RefreshControlProps> {
  const palette = useResolvedTheme(themeOverride);
  return (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      tintColor={palette.primary}
      colors={[palette.primary]}
    />
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { flexGrow: 1 },
});
