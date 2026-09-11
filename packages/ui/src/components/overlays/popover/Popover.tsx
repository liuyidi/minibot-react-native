import {
  cloneElement,
  isValidElement,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import {
  Pressable,
  Text,
  View,
  StyleSheet,
  useWindowDimensions,
  type LayoutChangeEvent,
  type LayoutRectangle,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { OverlayPortal } from "../../../overlay";
import { useResolvedTheme } from "../../../theme/ThemeProvider";
import type { UiTheme } from "../../../theme/types";

/** Aligns with Vant / Ant Design Mobile placement set. */
export type PopoverPlacement =
  | "top"
  | "top-start"
  | "top-end"
  | "bottom"
  | "bottom-start"
  | "bottom-end"
  | "left"
  | "left-start"
  | "left-end"
  | "right"
  | "right-start"
  | "right-end";

export type PopoverMode = "light" | "dark";
export type PopoverActionsDirection = "vertical" | "horizontal";

export type PopoverAction = {
  text: string;
  icon?: ReactNode;
  disabled?: boolean;
  /** Override label color (e.g. danger). */
  color?: string;
  onPress?: () => void;
};

export type PopoverProps = {
  children: ReactNode;
  /** Free-form body when `actions` is empty. */
  content?: ReactNode;
  /** Action menu (Vant / antd-mobile style). Takes precedence over `content`. */
  actions?: PopoverAction[];
  actionsDirection?: PopoverActionsDirection;
  /** Close after selecting an action. @default true */
  closeOnClickAction?: boolean;
  visible?: boolean;
  defaultVisible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
  placement?: PopoverPlacement;
  /** Light / dark bubble (antd-mobile `mode` / Vant `theme`). @default light */
  mode?: PopoverMode;
  /** Show caret arrow. @default true */
  showArrow?: boolean;
  /** Gap between anchor and bubble edge (arrow sits in this gap). @default 8 */
  offset?: number;
  theme?: Partial<UiTheme>;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
};

type PressableChildProps = {
  onPress?: (...args: unknown[]) => void;
};

type Side = "top" | "bottom" | "left" | "right";
type Align = "start" | "center" | "end";

const ARROW = 7;
const SCREEN_PAD = 12;
const DARK_BG = "#4a4a4a";
const DARK_FG = "#ffffff";

function parsePlacement(placement: PopoverPlacement): {
  side: Side;
  align: Align;
} {
  const [side, align] = placement.split("-") as [Side, Align | undefined];
  return { side, align: align ?? "center" };
}

function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
}

/** Merge toggle into a pressable child; fall back to wrapping Pressable. */
function renderTrigger(children: ReactNode, onToggle: () => void): ReactNode {
  if (isValidElement(children)) {
    const child = children as ReactElement<PressableChildProps>;
    return cloneElement(child, {
      onPress: (...args: unknown[]) => {
        child.props.onPress?.(...args);
        onToggle();
      },
    });
  }
  return <Pressable onPress={onToggle}>{children}</Pressable>;
}

function Arrow({
  side,
  color,
  borderColor,
  offset,
  pin = "start",
}: {
  side: Side;
  color: string;
  borderColor: string;
  offset: number;
  pin?: "start" | "end";
}) {
  const outer = ARROW + 1;
  const inner = ARROW;
  const box = outer * 2;

  const pinStyle =
    pin === "end"
      ? side === "bottom" || side === "top"
        ? { right: Math.max(0, offset - 1) }
        : { bottom: Math.max(0, offset - 1) }
      : side === "bottom" || side === "top"
        ? { left: Math.max(0, offset - 1) }
        : { top: Math.max(0, offset - 1) };

  const triangle = (
    fill: string,
    size: number,
    shift: { top?: number; left?: number; right?: number; bottom?: number },
  ) => {
    const common = {
      position: "absolute" as const,
      width: 0,
      height: 0,
      borderStyle: "solid" as const,
      ...shift,
    };
    if (side === "bottom") {
      return (
        <View
          style={{
            ...common,
            borderLeftWidth: size,
            borderRightWidth: size,
            borderBottomWidth: size,
            borderLeftColor: "transparent",
            borderRightColor: "transparent",
            borderBottomColor: fill,
          }}
        />
      );
    }
    if (side === "top") {
      return (
        <View
          style={{
            ...common,
            borderLeftWidth: size,
            borderRightWidth: size,
            borderTopWidth: size,
            borderLeftColor: "transparent",
            borderRightColor: "transparent",
            borderTopColor: fill,
          }}
        />
      );
    }
    if (side === "right") {
      return (
        <View
          style={{
            ...common,
            borderTopWidth: size,
            borderBottomWidth: size,
            borderRightWidth: size,
            borderTopColor: "transparent",
            borderBottomColor: "transparent",
            borderRightColor: fill,
          }}
        />
      );
    }
    return (
      <View
        style={{
          ...common,
          borderTopWidth: size,
          borderBottomWidth: size,
          borderLeftWidth: size,
          borderTopColor: "transparent",
          borderBottomColor: "transparent",
          borderLeftColor: fill,
        }}
      />
    );
  };

  if (side === "bottom") {
    return (
      <View
        pointerEvents="none"
        style={[
          {
            position: "absolute",
            top: -outer,
            width: box,
            height: outer,
          },
          pinStyle,
        ]}
      >
        {triangle(borderColor, outer, { top: 0, left: 0 })}
        {triangle(color, inner, { top: 1, left: 1 })}
      </View>
    );
  }
  if (side === "top") {
    return (
      <View
        pointerEvents="none"
        style={[
          {
            position: "absolute",
            bottom: -outer,
            width: box,
            height: outer,
          },
          pinStyle,
        ]}
      >
        {triangle(borderColor, outer, { bottom: 0, left: 0 })}
        {triangle(color, inner, { bottom: 1, left: 1 })}
      </View>
    );
  }
  if (side === "right") {
    return (
      <View
        pointerEvents="none"
        style={[
          {
            position: "absolute",
            left: -outer,
            width: outer,
            height: box,
          },
          pinStyle,
        ]}
      >
        {triangle(borderColor, outer, { top: 0, left: 0 })}
        {triangle(color, inner, { top: 1, left: 1 })}
      </View>
    );
  }
  return (
    <View
      pointerEvents="none"
      style={[
        {
          position: "absolute",
          right: -outer,
          width: outer,
          height: box,
        },
        pinStyle,
      ]}
    >
      {triangle(borderColor, outer, { top: 0, right: 0 })}
      {triangle(color, inner, { top: 1, right: 1 })}
    </View>
  );
}

type BubblePos = {
  style: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  };
  arrowOffset: number;
  arrowPin: "start" | "end";
};

/**
 * Prefer left/right/top/bottom edge pins for start/end so we do not need
 * measured bubble size (actions / custom content are unknown until laid out).
 * Center still uses measured size when available.
 */
function computePosition({
  anchor,
  bubbleW,
  bubbleH,
  side,
  align,
  offset,
  frameW,
  frameH,
  showArrow,
}: {
  anchor: LayoutRectangle;
  bubbleW: number;
  bubbleH: number;
  side: Side;
  align: Align;
  offset: number;
  frameW: number;
  frameH: number;
  showArrow: boolean;
}): BubblePos {
  const gap = offset + (showArrow ? ARROW : 0);
  const aw = Math.max(bubbleW, 1);
  const ah = Math.max(bubbleH, 1);
  const maxL = Math.max(SCREEN_PAD, frameW - SCREEN_PAD);
  const maxT = Math.max(SCREEN_PAD, frameH - SCREEN_PAD);

  const arrowFromStart = (span: number) =>
    clamp(span / 2 - ARROW, 8, Math.max(8, (bubbleW || span) - ARROW * 2 - 8));

  if (side === "bottom" || side === "top") {
    const main =
      side === "bottom"
        ? { top: clamp(anchor.y + anchor.height + gap, SCREEN_PAD, maxT) }
        : {
            // Pin bottom edge to anchor top — height can grow upward without measure.
            bottom: clamp(frameH - anchor.y + gap, SCREEN_PAD, maxT),
          };

    if (align === "start") {
      return {
        style: {
          ...main,
          left: clamp(anchor.x, SCREEN_PAD, maxL),
        },
        arrowOffset: arrowFromStart(anchor.width),
        arrowPin: "start",
      };
    }
    if (align === "end") {
      return {
        style: {
          ...main,
          right: clamp(frameW - (anchor.x + anchor.width), SCREEN_PAD, maxL),
        },
        arrowOffset: arrowFromStart(anchor.width),
        arrowPin: "end",
      };
    }
    // center
    if (bubbleW > 0) {
      return {
        style: {
          ...main,
          left: clamp(
            anchor.x + anchor.width / 2 - aw / 2,
            SCREEN_PAD,
            Math.max(SCREEN_PAD, frameW - aw - SCREEN_PAD),
          ),
        },
        arrowOffset: clamp(aw / 2 - ARROW, 8, Math.max(8, aw - ARROW * 2 - 8)),
        arrowPin: "start",
      };
    }
    return {
      style: {
        ...main,
        left: clamp(anchor.x + anchor.width / 2, SCREEN_PAD, maxL),
      },
      arrowOffset: 0,
      arrowPin: "start",
    };
  }

  // left / right
  const main =
    side === "right"
      ? { left: clamp(anchor.x + anchor.width + gap, SCREEN_PAD, maxL) }
      : {
          // Pin right edge to anchor left — width grows leftward without measure.
          right: clamp(frameW - anchor.x + gap, SCREEN_PAD, maxL),
        };

  if (align === "start") {
    return {
      style: {
        ...main,
        top: clamp(anchor.y, SCREEN_PAD, maxT),
      },
      arrowOffset: arrowFromStart(anchor.height),
      arrowPin: "start",
    };
  }
  if (align === "end") {
    return {
      style: {
        ...main,
        bottom: clamp(frameH - (anchor.y + anchor.height), SCREEN_PAD, maxT),
      },
      arrowOffset: arrowFromStart(anchor.height),
      arrowPin: "end",
    };
  }
  if (bubbleH > 0) {
    return {
      style: {
        ...main,
        top: clamp(
          anchor.y + anchor.height / 2 - ah / 2,
          SCREEN_PAD,
          Math.max(SCREEN_PAD, frameH - ah - SCREEN_PAD),
        ),
      },
      arrowOffset: clamp(ah / 2 - ARROW, 8, Math.max(8, ah - ARROW * 2 - 8)),
      arrowPin: "start",
    };
  }
  return {
    style: {
      ...main,
      top: clamp(anchor.y + anchor.height / 2, SCREEN_PAD, maxT),
    },
    arrowOffset: 0,
    arrowPin: "start",
  };
}

type LayerProps = {
  anchor: LayoutRectangle;
  placement: PopoverPlacement;
  showArrow: boolean;
  offset: number;
  bg: string;
  fg: string;
  border: string;
  divider: string;
  muted: string;
  content?: ReactNode;
  actions?: PopoverAction[];
  actionsDirection: PopoverActionsDirection;
  contentStyle?: StyleProp<ViewStyle>;
  onRequestClose: () => void;
  closeOnClickAction: boolean;
};

/**
 * Lives inside OverlayHost so onLayout / size state re-renders the bubble
 * (OverlayPortal does not re-emit when parent children change).
 *
 * `anchor` is window coords (`measureInWindow`). OverlayHost may sit inside a
 * nested RootSiblingParent (Gallery header + Story decorator), so subtract
 * this layer's window origin before absolute positioning.
 */
function PopoverLayer({
  anchor: anchorInWindow,
  placement,
  showArrow,
  offset,
  bg,
  fg,
  border,
  divider,
  muted,
  content,
  actions,
  actionsDirection,
  contentStyle,
  onRequestClose,
  closeOnClickAction,
}: LayerProps) {
  const { width: windowW, height: windowH } = useWindowDimensions();
  const frameRef = useRef<View>(null);
  const [frameOrigin, setFrameOrigin] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [frameSize, setFrameSize] = useState<{ w: number; h: number } | null>(
    null,
  );
  const [bubbleSize, setBubbleSize] = useState({ w: 0, h: 0 });
  const { side, align } = useMemo(() => parsePlacement(placement), [placement]);

  const syncOrigin = () => {
    frameRef.current?.measureInWindow((x, y) => {
      setFrameOrigin((prev) =>
        prev && prev.x === x && prev.y === y ? prev : { x, y },
      );
    });
  };

  useLayoutEffect(() => {
    syncOrigin();
  }, [
    anchorInWindow.x,
    anchorInWindow.y,
    anchorInWindow.width,
    anchorInWindow.height,
  ]);

  const onFrameLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setFrameSize((prev) =>
      prev && prev.w === width && prev.h === height ? prev : { w: width, h: height },
    );
    syncOrigin();
  };

  const onBubbleLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setBubbleSize((prev) =>
      prev.w === width && prev.h === height ? prev : { w: width, h: height },
    );
  };

  const frameW = frameSize && frameSize.w > 0 ? frameSize.w : windowW;
  const frameH = frameSize && frameSize.h > 0 ? frameSize.h : windowH;

  const localAnchor: LayoutRectangle | null = frameOrigin
    ? {
        x: anchorInWindow.x - frameOrigin.x,
        y: anchorInWindow.y - frameOrigin.y,
        width: anchorInWindow.width,
        height: anchorInWindow.height,
      }
    : null;

  const pos =
    localAnchor == null
      ? null
      : computePosition({
          anchor: localAnchor,
          bubbleW: bubbleSize.w,
          bubbleH: bubbleSize.h,
          side,
          align,
          offset,
          frameW,
          frameH,
          showArrow,
        });

  const hasActions = Boolean(actions && actions.length > 0);

  const body = hasActions ? (
    <View
      style={[
        styles.actions,
        actionsDirection === "horizontal" ? styles.actionsRow : styles.actionsCol,
      ]}
    >
      {actions!.map((action, index) => {
        const isLast = index === actions!.length - 1;
        return (
          <Pressable
            key={`${action.text}-${index}`}
            disabled={action.disabled}
            onPress={() => {
              if (action.disabled) return;
              action.onPress?.();
              if (closeOnClickAction) onRequestClose();
            }}
            style={({ pressed }) => [
              actionsDirection === "horizontal" ? styles.actionH : styles.actionV,
              actionsDirection === "vertical" && !isLast
                ? {
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderBottomColor: divider,
                  }
                : null,
              actionsDirection === "horizontal" && !isLast
                ? {
                    borderRightWidth: StyleSheet.hairlineWidth,
                    borderRightColor: divider,
                  }
                : null,
              { opacity: action.disabled ? 0.4 : pressed ? 0.75 : 1 },
            ]}
          >
            {action.icon ? (
              <View style={styles.actionIcon}>{action.icon}</View>
            ) : null}
            <Text
              style={[
                styles.actionText,
                { color: action.disabled ? muted : action.color ?? fg },
              ]}
              numberOfLines={1}
            >
              {action.text}
            </Text>
          </Pressable>
        );
      })}
    </View>
  ) : typeof content === "string" || typeof content === "number" ? (
    <Text style={[styles.text, { color: fg }]}>{content}</Text>
  ) : (
    content
  );

  return (
    <View
      ref={frameRef}
      collapsable={false}
      onLayout={onFrameLayout}
      style={styles.layer}
      pointerEvents="box-none"
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Dismiss popover"
        onPress={onRequestClose}
        style={styles.mask}
      />
      {pos ? (
        <View
          onLayout={onBubbleLayout}
          collapsable={false}
          pointerEvents="box-none"
          style={[styles.bubbleWrap, pos.style]}
        >
          {showArrow && (align !== "center" || bubbleSize.w > 0) ? (
            <Arrow
              side={side}
              color={bg}
              borderColor={border}
              offset={pos.arrowOffset}
              pin={pos.arrowPin}
            />
          ) : null}
          <View
            style={[
              styles.bubble,
              hasActions ? styles.bubbleActions : null,
              {
                backgroundColor: bg,
                borderColor: border,
              },
              contentStyle,
            ]}
          >
            {body}
          </View>
        </View>
      ) : null}
    </View>
  );
}

/**
 * Anchored popover (Vant / Ant Design Mobile style).
 * Tap trigger to toggle; tap mask to dismiss.
 */
export function Popover({
  children,
  content,
  actions,
  actionsDirection = "vertical",
  closeOnClickAction = true,
  visible: visibleProp,
  defaultVisible = false,
  onVisibleChange,
  placement = "bottom",
  mode = "light",
  showArrow = true,
  offset = 8,
  theme: themeOverride,
  style,
  contentStyle,
}: PopoverProps) {
  const palette = useResolvedTheme(themeOverride);
  const controlled = visibleProp !== undefined;
  const [inner, setInner] = useState(defaultVisible);
  const visible = controlled ? Boolean(visibleProp) : inner;
  const setVisible = (v: boolean) => {
    if (!controlled) setInner(v);
    onVisibleChange?.(v);
  };

  const anchorRef = useRef<View>(null);
  const [anchor, setAnchor] = useState<LayoutRectangle | null>(null);

  const dark = mode === "dark";
  const bg = dark ? DARK_BG : palette.card;
  const fg = dark ? DARK_FG : palette.text;
  const border = dark ? DARK_BG : palette.border;
  const divider = dark ? "rgba(255,255,255,0.12)" : palette.border;
  const muted = dark ? "rgba(255,255,255,0.45)" : palette.textSecondary;

  const toggle = () => {
    if (visible) {
      setVisible(false);
      return;
    }
    const measureAndOpen = () => {
      const node = anchorRef.current;
      if (!node) {
        setAnchor({ x: 24, y: 120, width: 80, height: 36 });
        setVisible(true);
        return;
      }
      node.measureInWindow((x, y, width, height) => {
        setAnchor({
          x: Number.isFinite(x) ? x : 24,
          y: Number.isFinite(y) ? y : 120,
          width: width > 0 ? width : 80,
          height: height > 0 ? height : 36,
        });
        setVisible(true);
      });
    };
    // Let press settle / layout flush before measuring (esp. in ScrollView).
    requestAnimationFrame(measureAndOpen);
  };

  return (
    <>
      <View ref={anchorRef} collapsable={false} style={style}>
        {renderTrigger(children, toggle)}
      </View>
      <OverlayPortal
        visible={visible && anchor != null}
        options={{
          type: "Popup",
          hasMask: false,
          closeOnMask: false,
          dismissOnBack: true,
          pointerEvents: "box-none",
        }}
        onDismiss={() => setVisible(false)}
      >
        {anchor ? (
          <PopoverLayer
            anchor={anchor}
            placement={placement}
            showArrow={showArrow}
            offset={offset}
            bg={bg}
            fg={fg}
            border={border}
            divider={divider}
            muted={muted}
            content={content}
            actions={actions}
            actionsDirection={actionsDirection}
            contentStyle={contentStyle}
            closeOnClickAction={closeOnClickAction}
            onRequestClose={() => setVisible(false)}
          />
        ) : null}
      </OverlayPortal>
    </>
  );
}

export type TooltipProps = Omit<PopoverProps, "content" | "actions"> & {
  title: string;
};

export function Tooltip({ title, mode = "dark", ...rest }: TooltipProps) {
  return <Popover {...rest} mode={mode} content={title} />;
}

const styles = StyleSheet.create({
  layer: {
    ...StyleSheet.absoluteFill,
  },
  mask: {
    ...StyleSheet.absoluteFill,
  },
  bubbleWrap: {
    position: "absolute",
    maxWidth: 280,
    zIndex: 2,
  },
  bubble: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  bubbleActions: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    overflow: "hidden",
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
  },
  actions: {},
  actionsCol: {
    minWidth: 128,
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "stretch",
  },
  actionV: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minWidth: 128,
  },
  actionH: {
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minWidth: 72,
  },
  actionIcon: {
    alignItems: "center",
    justifyContent: "center",
  },
  actionText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
