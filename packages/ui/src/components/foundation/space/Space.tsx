import {
  Children,
  isValidElement,
  type ReactNode,
} from "react";
import {
  View,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
  type FlexAlignType,
} from "react-native";

export type SpaceDirection = "horizontal" | "vertical";
export type SpaceAlign = "start" | "end" | "center" | "baseline";
export type SpaceJustify =
  | "start"
  | "end"
  | "center"
  | "between"
  | "around"
  | "evenly"
  | "stretch";

export type SpaceProps = {
  children?: ReactNode;
  /** @default horizontal */
  direction?: SpaceDirection;
  /** Cross-axis alignment. */
  align?: SpaceAlign;
  /** Main-axis distribution. */
  justify?: SpaceJustify;
  /** Wrap onto multiple lines (horizontal only). */
  wrap?: boolean;
  /** Stretch to full width of parent. */
  block?: boolean;
  /**
   * Gap between items (px).
   * @default 8
   */
  gap?: number;
  /** Override horizontal gap when `direction="horizontal"` or wrapping. */
  gapHorizontal?: number;
  /** Override vertical gap when `direction="vertical"` or wrapping. */
  gapVertical?: number;
  style?: StyleProp<ViewStyle>;
};

const ALIGN_MAP: Record<SpaceAlign, FlexAlignType> = {
  start: "flex-start",
  end: "flex-end",
  center: "center",
  baseline: "baseline",
};

const JUSTIFY_MAP: Record<SpaceJustify, ViewStyle["justifyContent"]> = {
  start: "flex-start",
  end: "flex-end",
  center: "center",
  between: "space-between",
  around: "space-around",
  evenly: "space-evenly",
  stretch: "flex-start",
};

/** Layout helper for consistent gaps between children. */
export function Space({
  children,
  direction = "horizontal",
  align,
  justify,
  wrap = false,
  block = false,
  gap = 8,
  gapHorizontal,
  gapVertical,
  style,
}: SpaceProps) {
  const horizontal = direction === "horizontal";
  const rowGap = gapVertical ?? gap;
  const columnGap = gapHorizontal ?? gap;

  const items = Children.toArray(children);

  return (
    <View
      style={[
        styles.root,
        {
          flexDirection: horizontal ? "row" : "column",
          flexWrap: wrap && horizontal ? "wrap" : "nowrap",
          alignItems: align ? ALIGN_MAP[align] : undefined,
          justifyContent: justify ? JUSTIFY_MAP[justify] : undefined,
          columnGap,
          rowGap,
          alignSelf: block ? "stretch" : "flex-start",
          width: block ? "100%" : undefined,
        },
        justify === "stretch" && horizontal
          ? styles.stretchHorizontal
          : null,
        justify === "stretch" && !horizontal
          ? styles.stretchVertical
          : null,
        style,
      ]}
    >
      {items.map((child, index) => {
        const key = isValidElement(child) && child.key != null ? child.key : index;
        return (
          <View
            key={key}
            style={
              justify === "stretch"
                ? horizontal
                  ? styles.itemStretchHorizontal
                  : styles.itemStretchVertical
                : undefined
            }
          >
            {child}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {},
  stretchHorizontal: {
    alignItems: "stretch",
  },
  stretchVertical: {
    alignItems: "stretch",
  },
  itemStretchHorizontal: {
    flexGrow: 1,
    flexShrink: 1,
  },
  itemStretchVertical: {
    alignSelf: "stretch",
  },
});
