import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import {
  Animated,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { useResolvedTheme } from "../../../theme/ThemeProvider";
import type { UiTheme } from "../../../theme/types";
import { withStatics } from "../../../utils/withStatics";

export type SkeletonDim = number | `${number}%`;

export type SkeletonAvatarShape = "round" | "square";

type PulseCtx = {
  opacity: Animated.Value | number;
  animate: boolean;
  color: string;
  round: boolean;
};

const SkeletonPulseContext = createContext<PulseCtx | null>(null);

function usePulse(): PulseCtx {
  const ctx = useContext(SkeletonPulseContext);
  if (!ctx) {
    throw new Error("Skeleton subcomponents must be used within Skeleton");
  }
  return ctx;
}

function useStandalonePulse(
  animate: boolean,
  color: string,
  round: boolean,
): PulseCtx {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    if (!animate) {
      opacity.setValue(1);
      return;
    }
    opacity.setValue(0.4);
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [animate, opacity]);

  return { opacity: animate ? opacity : 1, animate, color, round };
}

function Bone({
  width,
  height,
  borderRadius,
  style,
}: {
  width: SkeletonDim | "100%";
  height: number;
  borderRadius: number;
  style?: StyleProp<ViewStyle>;
}) {
  const { opacity, color } = usePulse();
  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: color,
          opacity,
        },
        style,
      ]}
    />
  );
}

// —— Subcomponents ——

export type SkeletonAvatarProps = {
  size?: number;
  shape?: SkeletonAvatarShape;
  style?: StyleProp<ViewStyle>;
};

export function SkeletonAvatar({
  size = 32,
  shape = "round",
  style,
}: SkeletonAvatarProps) {
  return (
    <Bone
      width={size}
      height={size}
      borderRadius={shape === "round" ? size / 2 : 4}
      style={style}
    />
  );
}

export type SkeletonTitleProps = {
  width?: SkeletonDim;
  style?: StyleProp<ViewStyle>;
};

export function SkeletonTitle({
  width = "40%",
  style,
}: SkeletonTitleProps) {
  const { round } = usePulse();
  return (
    <Bone
      width={width}
      height={16}
      borderRadius={round ? 999 : 4}
      style={style}
    />
  );
}

export type SkeletonParagraphProps = {
  width?: SkeletonDim;
  style?: StyleProp<ViewStyle>;
};

export function SkeletonParagraph({
  width = "100%",
  style,
}: SkeletonParagraphProps) {
  const { round } = usePulse();
  return (
    <Bone
      width={width}
      height={16}
      borderRadius={round ? 999 : 4}
      style={style}
    />
  );
}

export type SkeletonImageProps = {
  width?: number;
  height?: number;
  radius?: number;
  style?: StyleProp<ViewStyle>;
};

export function SkeletonImage({
  width = 96,
  height = 96,
  radius = 8,
  style,
}: SkeletonImageProps) {
  return (
    <Bone width={width} height={height} borderRadius={radius} style={style} />
  );
}

// —— Main ——

export type SkeletonProps = {
  title?: boolean;
  titleWidth?: SkeletonDim;
  avatar?: boolean;
  avatarSize?: number;
  avatarShape?: SkeletonAvatarShape;
  /** Paragraph row count. @default 0 */
  row?: number;
  /**
   * Paragraph width(s). When default `"100%"` and `row > 1`, last row uses `60%`.
   */
  rowWidth?: SkeletonDim | SkeletonDim[];
  /** Rounded title / paragraph ends. @default false */
  round?: boolean;
  /** Opacity pulse. @default true */
  animate?: boolean;
  /**
   * When `false`, skeleton hides and `children` are shown.
   * @default true
   */
  loading?: boolean;
  children?: ReactNode;
  /** Custom skeleton body (replaces avatar/title/rows layout). */
  template?: ReactNode;
  theme?: Partial<UiTheme>;
  style?: StyleProp<ViewStyle>;
};

const DEFAULT_ROW_WIDTH: SkeletonDim = "100%";
const DEFAULT_LAST_ROW_WIDTH: SkeletonDim = "60%";

function resolveRowWidth(
  index: number,
  row: number,
  rowWidth: SkeletonDim | SkeletonDim[] | undefined,
): SkeletonDim {
  if (Array.isArray(rowWidth)) {
    return rowWidth[index] ?? DEFAULT_ROW_WIDTH;
  }
  if (rowWidth != null && rowWidth !== DEFAULT_ROW_WIDTH) {
    return rowWidth;
  }
  if (row > 1 && index === row - 1) {
    return DEFAULT_LAST_ROW_WIDTH;
  }
  return rowWidth ?? DEFAULT_ROW_WIDTH;
}

function SkeletonRoot({
  title = false,
  titleWidth = "40%",
  avatar = false,
  avatarSize = 32,
  avatarShape = "round",
  row = 0,
  rowWidth,
  round = false,
  animate = true,
  loading = true,
  children,
  template,
  theme: themeOverride,
  style,
}: SkeletonProps) {
  const palette = useResolvedTheme(themeOverride);
  const pulse = useStandalonePulse(animate, palette.surface, round);

  if (!loading) {
    return <>{children}</>;
  }

  const content =
    template != null ? (
      template
    ) : (
      <View style={styles.row}>
        {avatar ? (
          <SkeletonAvatar size={avatarSize} shape={avatarShape} />
        ) : null}
        <View style={[styles.content, avatar ? styles.contentWithAvatar : null]}>
          {title ? <SkeletonTitle width={titleWidth} /> : null}
          {Array.from({ length: Math.max(0, row) }, (_, i) => (
            <SkeletonParagraph
              key={i}
              width={resolveRowWidth(i, row, rowWidth)}
            />
          ))}
        </View>
      </View>
    );

  return (
    <SkeletonPulseContext.Provider value={pulse}>
      <View style={[styles.root, style]}>{content}</View>
    </SkeletonPulseContext.Provider>
  );
}

export const Skeleton = withStatics(SkeletonRoot, {
  Avatar: SkeletonAvatar,
  Title: SkeletonTitle,
  Paragraph: SkeletonParagraph,
  Image: SkeletonImage,
});

const styles = StyleSheet.create({
  root: {
    width: "100%",
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  content: {
    flex: 1,
    minWidth: 0,
    gap: 12,
  },
  contentWithAvatar: {
    marginLeft: 12,
  },
});
