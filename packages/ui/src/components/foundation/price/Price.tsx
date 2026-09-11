import { Text, StyleSheet, type StyleProp, type TextStyle, type ViewStyle, View } from "react-native";

import { useResolvedTheme } from "../../../theme/ThemeProvider";
import type { UiTheme } from "../../../theme/types";

export type PriceProps = {
  /** Current price number or preformatted string. */
  value: number | string;
  /** Strikethrough original price. */
  original?: number | string;
  currency?: string;
  /** @default true */
  emphasize?: boolean;
  theme?: Partial<UiTheme>;
  style?: StyleProp<ViewStyle>;
  valueStyle?: StyleProp<TextStyle>;
};

function formatAmount(v: number | string, currency: string) {
  if (typeof v === "string") {
    return v.startsWith(currency) || v.includes(currency) ? v : `${currency}${v}`;
  }
  const n = Number.isInteger(v) ? String(v) : v.toFixed(2).replace(/\.?0+$/, "");
  return `${currency}${n}`;
}

/** Current + optional original (strikethrough) price. */
export function Price({
  value,
  original,
  currency = "¥",
  emphasize = true,
  theme: themeOverride,
  style,
  valueStyle,
}: PriceProps) {
  const palette = useResolvedTheme(themeOverride);

  return (
    <View style={[styles.wrap, style]}>
      <Text
        style={[
          styles.value,
          {
            color: emphasize ? palette.red : palette.heading,
            fontWeight: emphasize ? "700" : "600",
          },
          valueStyle,
        ]}
      >
        {formatAmount(value, currency)}
      </Text>
      {original != null && original !== "" ? (
        <Text style={[styles.original, { color: palette.muted }]}>
          {formatAmount(original, currency)}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "flex-end",
    gap: 2,
  },
  value: {
    fontSize: 18,
    lineHeight: 22,
  },
  original: {
    fontSize: 12,
    lineHeight: 16,
    textDecorationLine: "line-through",
  },
});
