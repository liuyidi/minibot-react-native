import { createContext, useContext, type ReactNode } from "react";
import {
  View,
  type FlexAlignType,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { withStatics } from "../../../utils/withStatics";

export type FlexDirection = "horizontal" | "vertical";
export type FlexAlign = "start" | "center" | "end" | "stretch" | "baseline";
export type FlexJustify =
  | "start"
  | "end"
  | "center"
  | "between"
  | "around"
  | "evenly";

export type FlexProps = {
  children?: ReactNode;
  /** @default horizontal */
  direction?: FlexDirection;
  align?: FlexAlign;
  justify?: FlexJustify;
  /** @default false */
  wrap?: boolean;
  /** @default 0 */
  gap?: number;
  gapHorizontal?: number;
  gapVertical?: number;
  /** Stretch to parent width when horizontal. @default true */
  block?: boolean;
  style?: StyleProp<ViewStyle>;
};

export type FlexItemProps = {
  children?: ReactNode;
  /** @default 1 */
  flex?: number;
  style?: StyleProp<ViewStyle>;
};

type FlexContextValue = { direction: FlexDirection };

const FlexContext = createContext<FlexContextValue>({
  direction: "horizontal",
});

const ALIGN_MAP: Record<FlexAlign, FlexAlignType> = {
  start: "flex-start",
  end: "flex-end",
  center: "center",
  stretch: "stretch",
  baseline: "baseline",
};

const JUSTIFY_MAP: Record<FlexJustify, ViewStyle["justifyContent"]> = {
  start: "flex-start",
  end: "flex-end",
  center: "center",
  between: "space-between",
  around: "space-around",
  evenly: "space-evenly",
};

function FlexRoot({
  children,
  direction = "horizontal",
  align,
  justify,
  wrap = false,
  gap = 0,
  gapHorizontal,
  gapVertical,
  block = true,
  style,
}: FlexProps) {
  const horizontal = direction === "horizontal";
  const rowGap = gapVertical ?? gap;
  const columnGap = gapHorizontal ?? gap;

  return (
    <FlexContext.Provider value={{ direction }}>
      <View
        style={[
          {
            flexDirection: horizontal ? "row" : "column",
            flexWrap: wrap && horizontal ? "wrap" : "nowrap",
            alignItems: align ? ALIGN_MAP[align] : undefined,
            justifyContent: justify ? JUSTIFY_MAP[justify] : undefined,
            columnGap,
            rowGap,
            alignSelf: block || !horizontal ? "stretch" : "flex-start",
            width: block && horizontal ? "100%" : undefined,
          },
          style,
        ]}
      >
        {children}
      </View>
    </FlexContext.Provider>
  );
}

function FlexItem({ children, flex = 1, style }: FlexItemProps) {
  const { direction } = useContext(FlexContext);
  const horizontal = direction === "horizontal";

  return (
    <View
      style={[
        {
          flex,
          minWidth: horizontal ? 0 : undefined,
          minHeight: horizontal ? undefined : 0,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

/** Fixed edges + flexible center. Pair with `Flex.Item` for the growing slot. */
export const Flex = withStatics(FlexRoot, { Item: FlexItem });
