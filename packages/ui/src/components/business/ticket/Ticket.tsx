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
import { Collapse } from "../../foundation/collapse";
import { Tag } from "../../foundation/tag";

export type TicketProps = {
  /** Corner category label, e.g. 品类. */
  cornerTag?: string;
  /** Left value (amount / discount). */
  value: ReactNode;
  /** Condition under value, e.g. 满300元可用. */
  valueHint?: string;
  title: string;
  /** Status mark under title (Tag or custom). */
  status?: ReactNode;
  /** Meta line, e.g. validity. */
  meta?: string;
  /** Right action slot (e.g. 去使用). */
  action?: ReactNode;
  /**
   * Quantity mark on the right (e.g. package line items).
   * Numbers render as `x N张`.
   */
  quantity?: ReactNode;
  /**
   * Right-edge accent gradient strip.
   * @default true when `quantity` is set
   */
  accentBar?: boolean;
  /** Expandable rules / footnotes. */
  details?: ReactNode;
  detailsTitle?: string;
  defaultExpanded?: boolean;
  theme?: Partial<UiTheme>;
  style?: StyleProp<ViewStyle>;
};

/** Full-height right-edge strip; L→R soft fade without linear-gradient deps. */
function AccentBar({ from, to }: { from: string; to: string }) {
  return (
    <View style={styles.accentBar} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <View
          key={i}
          style={[
            styles.accentSlice,
            { backgroundColor: mixHex(from, to, i / 5) },
          ]}
        />
      ))}
    </View>
  );
}

/** Simple sRGB mix for a soft vertical-looking strip without linear-gradient deps. */
function mixHex(a: string | undefined, b: string | undefined, t: number): string {
  const pa = parseHex(a);
  const pb = parseHex(b);
  if (!pa || !pb) return a && a.startsWith("#") ? a : "#FFC9D2";
  const r = Math.round(pa.r + (pb.r - pa.r) * t);
  const g = Math.round(pa.g + (pb.g - pa.g) * t);
  const bch = Math.round(pa.b + (pb.b - pa.b) * t);
  return `rgb(${r},${g},${bch})`;
}

function parseHex(hex: string | undefined): { r: number; g: number; b: number } | null {
  if (!hex || typeof hex !== "string") return null;
  const raw = hex.replace("#", "").trim();
  if (raw.length === 3) {
    return {
      r: parseInt(raw[0] + raw[0], 16),
      g: parseInt(raw[1] + raw[1], 16),
      b: parseInt(raw[2] + raw[2], 16),
    };
  }
  if (raw.length === 6) {
    return {
      r: parseInt(raw.slice(0, 2), 16),
      g: parseInt(raw.slice(2, 4), 16),
      b: parseInt(raw.slice(4, 6), 16),
    };
  }
  return null;
}

function formatQuantity(quantity: ReactNode): ReactNode {
  if (typeof quantity === "number") {
    return `x ${quantity}张`;
  }
  return quantity;
}

/**
 * Business ticket / coupon face: value | info | action/quantity (+ optional collapse).
 */
export function Ticket({
  cornerTag,
  value,
  valueHint,
  title,
  status,
  meta,
  action,
  quantity,
  accentBar,
  details,
  detailsTitle = "使用说明",
  defaultExpanded = false,
  theme: themeOverride,
  style,
}: TicketProps) {
  const palette = useResolvedTheme(themeOverride);
  const showAccent =
    accentBar ?? (quantity !== undefined && quantity !== null);
  const quantityNode =
    quantity !== undefined && quantity !== null
      ? formatQuantity(quantity)
      : null;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: palette.card,
          borderColor: palette.border,
        },
        style,
      ]}
    >
      {cornerTag ? (
        <View style={styles.corner}>
          <Tag label={cornerTag} variant="primary" fill="solid" />
        </View>
      ) : null}

      <View style={styles.body}>
        <View
          style={[
            styles.row,
            showAccent ? styles.rowWithAccent : styles.rowPaddedEnd,
          ]}
        >
          <View style={styles.valueCol}>
            {typeof value === "string" || typeof value === "number" ? (
              <Text style={[styles.valueText, { color: palette.red }]}>
                {value}
              </Text>
            ) : (
              value
            )}
            {valueHint ? (
              <Text style={[styles.valueHint, { color: palette.red }]}>
                {valueHint}
              </Text>
            ) : null}
          </View>

          <View style={[styles.dash, { borderColor: palette.border }]} />

          <View style={styles.infoCol}>
            <Text
              style={[styles.title, { color: palette.heading }]}
              numberOfLines={2}
            >
              {title}
            </Text>
            {status ? <View style={styles.status}>{status}</View> : null}
            {meta ? (
              <Text style={[styles.meta, { color: palette.muted }]}>{meta}</Text>
            ) : null}
          </View>

          {action ? <View style={styles.actionCol}>{action}</View> : null}

          {quantityNode != null ? (
            <View style={styles.quantityCol}>
              {typeof quantityNode === "string" ||
              typeof quantityNode === "number" ? (
                <Text style={[styles.quantityText, { color: palette.muted }]}>
                  {quantityNode}
                </Text>
              ) : (
                quantityNode
              )}
            </View>
          ) : null}
        </View>

        {showAccent ? (
          <AccentBar from={palette.red ?? "#b42318"} to="#FFC9D2" />
        ) : null}
      </View>

      {details != null && details !== false ? (
        <View style={[styles.footer, { borderTopColor: palette.border }]}>
          <Collapse
            title={detailsTitle}
            defaultExpanded={defaultExpanded}
            theme={themeOverride}
          >
            {typeof details === "string" ? (
              <Text style={[styles.detailsText, { color: palette.muted }]}>
                {details}
              </Text>
            ) : (
              details
            )}
          </Collapse>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
  corner: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 1,
  },
  body: {
    position: "relative",
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingLeft: 12,
    gap: 10,
    minHeight: 88,
  },
  rowPaddedEnd: {
    paddingRight: 12,
  },
  rowWithAccent: {
    paddingRight: 18,
  },
  valueCol: {
    width: 88,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 8,
    paddingLeft: 0,
  },
  valueText: {
    fontSize: 26,
    fontWeight: "700",
    lineHeight: 32,
  },
  valueHint: {
    marginTop: 4,
    fontSize: 11,
    lineHeight: 14,
  },
  dash: {
    width: 0,
    alignSelf: "stretch",
    borderStyle: "dashed",
    borderLeftWidth: StyleSheet.hairlineWidth,
  },
  infoCol: {
    flex: 1,
    minWidth: 0,
    gap: 6,
    paddingRight: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 20,
  },
  status: {
    alignSelf: "flex-start",
  },
  meta: {
    fontSize: 12,
    lineHeight: 16,
  },
  actionCol: {
    flexShrink: 0,
  },
  quantityCol: {
    flexShrink: 0,
    justifyContent: "center",
  },
  quantityText: {
    fontSize: 13,
    fontWeight: "500",
  },
  accentBar: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    width: 8,
    flexDirection: "row",
  },
  accentSlice: {
    flex: 1,
  },
  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderStyle: "dashed",
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  detailsText: {
    fontSize: 12,
    lineHeight: 18,
  },
});
