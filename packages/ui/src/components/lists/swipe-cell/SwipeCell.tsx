import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  type ReactNode,
} from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import type { SwipeableMethods } from "react-native-gesture-handler/ReanimatedSwipeable";

import { useResolvedTheme } from "../../../theme/ThemeProvider";
import type { UiTheme } from "../../../theme/types";

export type SwipeCellActionColor =
  | "light"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | (string & {});

export type SwipeCellAction = {
  key: string | number;
  text: ReactNode;
  /** Preset or any CSS/RN color string. @default light */
  color?: SwipeCellActionColor;
  onPress?: () => void;
};

export type SwipeCellSide = "left" | "right";

export type SwipeCellProps = {
  children: ReactNode;
  /** Actions revealed by swiping right (appear on the left). */
  leftActions?: SwipeCellAction[];
  /** Actions revealed by swiping left (appear on the right). */
  rightActions?: SwipeCellAction[];
  /** Close after tapping an action. @default true */
  closeOnAction?: boolean;
  disabled?: boolean;
  onAction?: (action: SwipeCellAction, side: SwipeCellSide) => void;
  onOpen?: (side: SwipeCellSide) => void;
  onClose?: () => void;
  theme?: Partial<UiTheme>;
  style?: StyleProp<ViewStyle>;
};

export type SwipeCellRef = {
  close: () => void;
  open: (side?: SwipeCellSide) => void;
};

type ActionPalette = {
  bg: string;
  fg: string;
};

function resolveActionColors(
  color: SwipeCellActionColor | undefined,
  palette: UiTheme,
): ActionPalette {
  switch (color ?? "light") {
    case "light":
      return { bg: palette.surface, fg: palette.text };
    case "primary":
      return { bg: palette.primary, fg: palette.onPrimary };
    case "success":
      return { bg: palette.green, fg: "#ffffff" };
    case "warning":
      return { bg: palette.yellow, fg: "#ffffff" };
    case "danger":
      return { bg: palette.red, fg: "#ffffff" };
    default:
      return { bg: color as string, fg: "#ffffff" };
  }
}

function ActionButtons({
  actions,
  side,
  palette,
  onPressAction,
}: {
  actions: SwipeCellAction[];
  side: SwipeCellSide;
  palette: UiTheme;
  onPressAction: (action: SwipeCellAction, side: SwipeCellSide) => void;
}) {
  return (
    <View
      style={[
        styles.actionsRow,
        side === "left" ? styles.actionsLeft : styles.actionsRight,
      ]}
    >
      {actions.map((action) => {
        const colors = resolveActionColors(action.color, palette);
        return (
          <Pressable
            key={String(action.key)}
            accessibilityRole="button"
            onPress={() => onPressAction(action, side)}
            style={({ pressed }) => [
              styles.actionBtn,
              { backgroundColor: colors.bg, opacity: pressed ? 0.85 : 1 },
            ]}
          >
            {typeof action.text === "string" ||
            typeof action.text === "number" ? (
              <Text style={[styles.actionText, { color: colors.fg }]}>
                {action.text}
              </Text>
            ) : (
              action.text
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

/**
 * Swipeable list cell with left/right action buttons.
 */
export const SwipeCell = forwardRef<SwipeCellRef, SwipeCellProps>(
  function SwipeCell(
    {
      children,
      leftActions = [],
      rightActions = [],
      closeOnAction = true,
      disabled = false,
      onAction,
      onOpen,
      onClose,
      theme: themeOverride,
      style,
    },
    ref,
  ) {
    const palette = useResolvedTheme(themeOverride);
    const swipeableRef = useRef<SwipeableMethods>(null);

    useImperativeHandle(ref, () => ({
      close: () => swipeableRef.current?.close(),
      open: (side: SwipeCellSide = "right") => {
        if (side === "left") swipeableRef.current?.openLeft();
        else swipeableRef.current?.openRight();
      },
    }));

    const handleAction = useCallback(
      (action: SwipeCellAction, side: SwipeCellSide) => {
        onAction?.(action, side);
        action.onPress?.();
        if (closeOnAction) {
          swipeableRef.current?.close();
        }
      },
      [closeOnAction, onAction],
    );

    const renderLeft = useCallback(() => {
      if (!leftActions.length) return null;
      return (
        <ActionButtons
          actions={leftActions}
          side="left"
          palette={palette}
          onPressAction={handleAction}
        />
      );
    }, [handleAction, leftActions, palette]);

    const renderRight = useCallback(() => {
      if (!rightActions.length) return null;
      return (
        <ActionButtons
          actions={rightActions}
          side="right"
          palette={palette}
          onPressAction={handleAction}
        />
      );
    }, [handleAction, palette, rightActions]);

    return (
      <GestureHandlerRootView style={styles.root}>
        <Swipeable
          ref={swipeableRef}
          enabled={!disabled}
          overshootLeft={false}
          overshootRight={false}
          friction={1.5}
          containerStyle={[styles.container, style]}
          childrenContainerStyle={[
            styles.children,
            { backgroundColor: palette.card },
          ]}
          renderLeftActions={leftActions.length ? renderLeft : undefined}
          renderRightActions={rightActions.length ? renderRight : undefined}
          onSwipeableOpen={(direction) => {
            // RNGH: LEFT means user swiped left → right actions revealed
            onOpen?.(direction === "left" ? "right" : "left");
          }}
          onSwipeableClose={() => {
            onClose?.();
          }}
        >
          {children}
        </Swipeable>
      </GestureHandlerRootView>
    );
  },
);

const styles = StyleSheet.create({
  root: {
    width: "100%",
  },
  container: {
    overflow: "hidden",
  },
  children: {
    backgroundColor: "transparent",
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "stretch",
  },
  actionsLeft: {
    justifyContent: "flex-start",
  },
  actionsRight: {
    justifyContent: "flex-end",
  },
  actionBtn: {
    minWidth: 72,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  actionText: {
    fontSize: 15,
    fontWeight: "600",
  },
});
