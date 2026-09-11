import type { ReactNode } from "react";
import {
  Pressable,
  View,
  Text,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  type LucideIcon,
} from "lucide-react-native";

import { Icon } from "../../foundation/icon";
import { useResolvedTheme } from "../../../theme/ThemeProvider";
import type { UiTheme } from "../../../theme/types";

export type ListRowSize = "middle" | "large";

export type ListRowArrowDirection = "right" | "left" | "up" | "down";

export type ListRowProps = {
  /** Left title. */
  title: ReactNode;
  /** Right-side value text. */
  value?: ReactNode;
  /** Description under the title (Vant Cell `label`). */
  label?: ReactNode;
  /** Press handler. With `isLink`, enables link-style feedback. */
  onPress?: () => void;
  /** Destructive title color (e.g. Sign out). */
  destructive?: boolean;
  /** Hairline under the row. @default false */
  showDivider?: boolean;
  /**
   * Show trailing chevron (and treat as tappable when `onPress` is set).
   * @default false
   */
  isLink?: boolean;
  /** Chevron direction when `isLink`. @default right */
  arrowDirection?: ListRowArrowDirection;
  /**
   * Leading Lucide icon. Ignored when `leading` is set.
   */
  icon?: LucideIcon;
  /** Custom leading node (avatar, icon, etc.). Wins over `icon`. */
  leading?: ReactNode;
  /** Custom trailing node. Rendered before the link chevron. */
  trailing?: ReactNode;
  /** @default middle */
  size?: ListRowSize;
  /**
   * Vertically center left/right columns (useful with multi-line label).
   * @default false — left block top-aligns with value when label present
   */
  center?: boolean;
  theme?: Partial<UiTheme>;
  style?: StyleProp<ViewStyle>;
};

const ARROW: Record<ListRowArrowDirection, LucideIcon> = {
  right: ChevronRight,
  left: ChevronLeft,
  up: ChevronUp,
  down: ChevronDown,
};

/**
 * Settings / list cell row (Vant Cell–inspired).
 * Pair with `ListGroup` for card sections.
 */
export function ListRow({
  title,
  value,
  label,
  onPress,
  destructive = false,
  showDivider = false,
  isLink = false,
  arrowDirection = "right",
  icon,
  leading,
  trailing,
  size = "middle",
  center = false,
  theme: themeOverride,
  style,
}: ListRowProps) {
  const palette = useResolvedTheme(themeOverride);
  const large = size === "large";
  const titleColor = destructive ? palette.red : palette.text;
  const clickable = Boolean(onPress);

  const leadingNode =
    leading ??
    (icon ? (
      <Icon icon={icon} size={large ? 22 : 20} color="text" />
    ) : null);

  const arrowNode = isLink ? (
    <Icon
      icon={ARROW[arrowDirection]}
      size={large ? 20 : 18}
      color="muted"
    />
  ) : null;

  const titleNode =
    typeof title === "string" || typeof title === "number" ? (
      <Text
        style={[
          styles.title,
          large && styles.titleLarge,
          { color: titleColor },
        ]}
        numberOfLines={1}
      >
        {title}
      </Text>
    ) : (
      title
    );

  const labelNode =
    label == null || label === false ? null : typeof label === "string" ||
      typeof label === "number" ? (
      <Text
        style={[
          styles.label,
          large && styles.labelLarge,
          { color: palette.textSecondary },
        ]}
        numberOfLines={3}
      >
        {label}
      </Text>
    ) : (
      label
    );

  const valueNode =
    value == null || value === false ? null : typeof value === "string" ||
      typeof value === "number" ? (
      <Text
        style={[
          styles.value,
          large && styles.valueLarge,
          { color: palette.textSecondary },
        ]}
        numberOfLines={1}
      >
        {value}
      </Text>
    ) : (
      value
    );

  const content = (
    <>
      <View
        style={[
          styles.row,
          large && styles.rowLarge,
          center && styles.rowCenter,
        ]}
      >
        {leadingNode ? (
          <View style={[styles.leading, !center && styles.leadingOffset]}>
            {leadingNode}
          </View>
        ) : null}

        <View style={styles.main}>
          {titleNode}
          {labelNode}
        </View>

        {valueNode ? <View style={styles.valueWrap}>{valueNode}</View> : null}
        {trailing ? <View style={styles.trailing}>{trailing}</View> : null}
        {arrowNode ? <View style={styles.arrow}>{arrowNode}</View> : null}
      </View>
      {showDivider ? (
        <View
          style={[
            styles.divider,
            {
              backgroundColor: palette.border,
              marginLeft: leadingNode ? 52 : 16,
            },
          ]}
        />
      ) : null}
    </>
  );

  if (clickable) {
    return (
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        style={({ pressed }) => [
          { opacity: pressed ? 0.7 : 1 },
          style,
        ]}
      >
        {content}
      </Pressable>
    );
  }

  return <View style={style}>{content}</View>;
}

const styles = StyleSheet.create({
  row: {
    minHeight: 48,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  rowLarge: {
    minHeight: 56,
    paddingVertical: 12,
  },
  rowCenter: {
    alignItems: "center",
  },
  leading: {},
  leadingOffset: {
    paddingTop: 2,
  },
  main: {
    flex: 1,
    minWidth: 0,
    gap: 2,
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    lineHeight: 22,
  },
  titleLarge: {
    fontSize: 17,
    lineHeight: 24,
  },
  label: {
    fontSize: 12,
    lineHeight: 18,
  },
  labelLarge: {
    fontSize: 14,
    lineHeight: 20,
  },
  valueWrap: {
    maxWidth: "42%",
    justifyContent: "center",
  },
  value: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: "right",
  },
  valueLarge: {
    fontSize: 16,
  },
  trailing: {
    justifyContent: "center",
  },
  arrow: {
    justifyContent: "center",
    marginLeft: -2,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
  },
});
