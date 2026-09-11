import type { ReactNode } from "react";
import {
  View,
  Text,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { useResolvedTheme } from "../../../theme/ThemeProvider";
import type { UiTheme } from "../../../theme/types";

export type StepStatus = "wait" | "process" | "finish" | "error";

export type StepItem = {
  title: string;
  description?: string;
  status?: StepStatus;
  icon?: ReactNode;
};

export type StepsProps = {
  items: StepItem[];
  /** Current step index (0-based). Used when item.status omitted. */
  current?: number;
  direction?: "horizontal" | "vertical";
  theme?: Partial<UiTheme>;
  style?: StyleProp<ViewStyle>;
};

function resolveStatus(
  index: number,
  current: number,
  explicit?: StepStatus,
): StepStatus {
  if (explicit) return explicit;
  if (index < current) return "finish";
  if (index === current) return "process";
  return "wait";
}

export function Steps({
  items,
  current = 0,
  direction = "horizontal",
  theme: themeOverride,
  style,
}: StepsProps) {
  const palette = useResolvedTheme(themeOverride);
  const vertical = direction === "vertical";

  return (
    <View style={[vertical ? styles.col : styles.row, style]}>
      {items.map((item, index) => {
        const status = resolveStatus(index, current, item.status);
        const active =
          status === "process" || status === "finish" || status === "error";
        const color =
          status === "error"
            ? palette.red
            : active
              ? palette.primary
              : palette.border;
        const textColor =
          status === "wait" ? palette.muted : palette.heading;

        return (
          <View
            key={`${item.title}-${index}`}
            style={[
              vertical ? styles.vItem : styles.hItem,
              !vertical && { flex: 1 },
            ]}
          >
            <View style={vertical ? styles.vHead : styles.hHead}>
              <View
                style={[
                  styles.dot,
                  {
                    borderColor: color,
                    backgroundColor:
                      status === "finish" || status === "process"
                        ? color
                        : palette.card,
                  },
                ]}
              >
                {item.icon ?? (
                  <Text
                    style={[
                      styles.dotText,
                      {
                        color:
                          status === "finish" || status === "process"
                            ? palette.onPrimary
                            : color,
                      },
                    ]}
                  >
                    {status === "finish" ? "✓" : index + 1}
                  </Text>
                )}
              </View>
              {!vertical && index < items.length - 1 ? (
                <View
                  style={[
                    styles.hLine,
                    {
                      backgroundColor:
                        index < current ? palette.primary : palette.border,
                    },
                  ]}
                />
              ) : null}
              {vertical && index < items.length - 1 ? (
                <View
                  style={[
                    styles.vLine,
                    {
                      backgroundColor:
                        index < current ? palette.primary : palette.border,
                    },
                  ]}
                />
              ) : null}
            </View>
            <View style={vertical ? styles.vBody : styles.hBody}>
              <Text style={[styles.title, { color: textColor }]} numberOfLines={2}>
                {item.title}
              </Text>
              {item.description ? (
                <Text
                  style={[styles.desc, { color: palette.textSecondary }]}
                  numberOfLines={3}
                >
                  {item.description}
                </Text>
              ) : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  col: {
    gap: 0,
  },
  hItem: {
    alignItems: "stretch",
  },
  vItem: {
    flexDirection: "row",
    minHeight: 56,
  },
  hHead: {
    flexDirection: "row",
    alignItems: "center",
  },
  vHead: {
    width: 28,
    alignItems: "center",
  },
  dot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  dotText: {
    fontSize: 11,
    fontWeight: "700",
  },
  hLine: {
    flex: 1,
    height: 2,
    marginHorizontal: 4,
  },
  vLine: {
    width: 2,
    flex: 1,
    minHeight: 28,
    marginVertical: 4,
  },
  hBody: {
    marginTop: 8,
    paddingRight: 8,
  },
  vBody: {
    flex: 1,
    paddingLeft: 10,
    paddingBottom: 16,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
  },
  desc: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 18,
  },
});
