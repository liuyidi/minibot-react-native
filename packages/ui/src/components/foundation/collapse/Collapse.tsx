import { useState, type ReactNode } from "react";
import {
  Pressable,
  View,
  Text,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { ChevronDown, ChevronUp } from "lucide-react-native";

import { useResolvedTheme } from "../../../theme/ThemeProvider";
import type { UiTheme } from "../../../theme/types";
import { Icon } from "../icon";

export type CollapseProps = {
  /** Header title when not using `header`. */
  title?: string;
  header?: ReactNode;
  children?: ReactNode;
  /** Controlled expanded state. */
  expanded?: boolean;
  /** Uncontrolled initial state. @default false */
  defaultExpanded?: boolean;
  onChange?: (expanded: boolean) => void;
  /**
   * Custom expand icon. Node, or render fn receiving expanded.
   * Pass `false` to hide.
   */
  arrow?: ReactNode | false | ((expanded: boolean) => ReactNode);
  theme?: Partial<UiTheme>;
  style?: StyleProp<ViewStyle>;
};

/** Expand / collapse content block. */
export function Collapse({
  title,
  header,
  children,
  expanded: expandedProp,
  defaultExpanded = false,
  onChange,
  arrow,
  theme: themeOverride,
  style,
}: CollapseProps) {
  const palette = useResolvedTheme(themeOverride);
  const [inner, setInner] = useState(defaultExpanded);
  const controlled = expandedProp !== undefined;
  const expanded = controlled ? expandedProp : inner;

  const toggle = () => {
    const next = !expanded;
    if (!controlled) setInner(next);
    onChange?.(next);
  };

  return (
    <View style={style}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        onPress={toggle}
        style={({ pressed }) => [styles.header, pressed && { opacity: 0.7 }]}
      >
        <View style={styles.headerMain}>
          {header ?? (
            <Text style={[styles.title, { color: palette.textSecondary }]}>
              {title ?? (expanded ? "收起" : "展开")}
            </Text>
          )}
        </View>
        {arrow === false ? null : typeof arrow === "function" ? (
          arrow(expanded)
        ) : arrow != null ? (
          arrow
        ) : (
          <Icon
            icon={expanded ? ChevronUp : ChevronDown}
            size={16}
            color="muted"
            theme={themeOverride}
            accessibilityLabel={expanded ? "Collapse" : "Expand"}
          />
        )}
      </Pressable>
      {expanded ? <View style={styles.body}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 32,
    gap: 8,
  },
  headerMain: {
    flex: 1,
  },
  title: {
    fontSize: 13,
  },
  body: {
    paddingTop: 4,
    paddingBottom: 4,
  },
});
