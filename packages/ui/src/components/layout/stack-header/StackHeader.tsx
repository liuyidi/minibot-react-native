import type { ReactNode } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { ChevronLeft } from "lucide-react-native";

import { Icon } from "../../foundation/icon";
import { useResolvedTheme } from "../../../theme/ThemeProvider";
import type { UiTheme } from "../../../theme/types";

export type StackHeaderProps = {
  title?: ReactNode;
  /** Secondary line under the title. */
  subtitle?: ReactNode;
  /** Custom center block; wins over title/subtitle. */
  center?: ReactNode;
  onBack?: () => void;
  /** Custom back control; defaults to chevron when `onBack` is set. */
  back?: ReactNode;
  /** @deprecated Prefer `back`. Kept for call sites using glyph text. */
  backLabel?: string;
  /** Left slot after back (e.g. close). */
  leading?: ReactNode;
  /** Right actions (icons / text buttons). */
  trailing?: ReactNode;
  /**
   * Transparent / immersive header (no card fill, no bottom border).
   * @default false
   */
  transparent?: boolean;
  theme?: Partial<UiTheme>;
  style?: StyleProp<ViewStyle>;
};

/**
 * Stack navigation header: back + title (+ optional trailing).
 */
export function StackHeader({
  title,
  subtitle,
  center,
  onBack,
  back,
  backLabel,
  leading,
  trailing,
  transparent = false,
  theme: themeOverride,
  style,
}: StackHeaderProps) {
  const palette = useResolvedTheme(themeOverride);

  const backControl =
    back ??
    (onBack ? (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Back"
        onPress={onBack}
        hitSlop={8}
        style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}
      >
        {backLabel != null ? (
          <Text style={[styles.backLabel, { color: palette.primary }]}>
            {backLabel}
          </Text>
        ) : (
          <Icon icon={ChevronLeft} size={28} color="primary" />
        )}
      </Pressable>
    ) : null);

  const titleBlock =
    center ??
    (title != null || subtitle != null ? (
      <View style={styles.titleBlock}>
        {typeof title === "string" || typeof title === "number" ? (
          <Text
            numberOfLines={1}
            style={[styles.title, { color: palette.heading }]}
          >
            {title}
          </Text>
        ) : (
          title
        )}
        {subtitle == null || subtitle === false ? null : typeof subtitle ===
            "string" || typeof subtitle === "number" ? (
          <Text
            numberOfLines={1}
            style={[styles.subtitle, { color: palette.textSecondary }]}
          >
            {subtitle}
          </Text>
        ) : (
          subtitle
        )}
      </View>
    ) : null);

  return (
    <View
      style={[
        styles.row,
        transparent
          ? styles.transparent
          : {
              borderBottomColor: palette.border,
              backgroundColor: palette.card,
              borderBottomWidth: StyleSheet.hairlineWidth,
            },
        style,
      ]}
    >
      <View style={styles.side}>
        <View style={styles.sideRow}>
          {backControl}
          {leading}
        </View>
      </View>
      <View style={styles.center}>{titleBlock}</View>
      <View style={[styles.side, styles.trailing]}>{trailing}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  transparent: {
    backgroundColor: "transparent",
    borderBottomWidth: 0,
  },
  side: {
    minWidth: 72,
    justifyContent: "center",
  },
  sideRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  trailing: {
    alignItems: "flex-end",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  titleBlock: {
    alignItems: "center",
    justifyContent: "center",
  },
  backBtn: {
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  backLabel: {
    fontSize: 28,
    lineHeight: 32,
    fontWeight: "300",
  },
  title: {
    textAlign: "center",
    fontSize: 17,
    fontWeight: "600",
  },
  subtitle: {
    marginTop: 2,
    fontSize: 12,
    lineHeight: 16,
    textAlign: "center",
  },
  pressed: {
    opacity: 0.7,
  },
});
