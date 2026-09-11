import type { Meta, StoryObj } from "@storybook/react-native";
import { useState, type ComponentProps, type ReactNode } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { useResolvedTheme } from "../../../theme/ThemeProvider";
import { Slider } from "./Slider";

const meta = {
  title: "UI/Controls 控件/Slider",
  component: Slider,
} satisfies Meta<typeof Slider>;
export default meta;
type Story = StoryObj<typeof meta>;

const MARKS: Record<number, string> = {
  0: "0",
  20: "20",
  40: "40",
  60: "60",
  80: "80",
  100: "100",
};

function DemoBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.block}>
      <Text style={styles.blockTitle}>{title}</Text>
      <View style={styles.blockBody}>{children}</View>
    </View>
  );
}

function MarksRow({
  marks,
  min,
  max,
}: {
  marks: Record<number, string>;
  min: number;
  max: number;
}) {
  const palette = useResolvedTheme();
  const keys = Object.keys(marks)
    .map(Number)
    .sort((a, b) => a - b);
  return (
    <View style={styles.marksRow}>
      {keys.map((k) => {
        const pct = max === min ? 0 : ((k - min) / (max - min)) * 100;
        return (
          <Text
            key={k}
            style={[
              styles.markLabel,
              {
                left: `${pct}%`,
                color: palette.textSecondary,
                transform: [{ translateX: -10 }],
              },
            ]}
          >
            {marks[k]}
          </Text>
        );
      })}
    </View>
  );
}

type ControlledProps = Omit<
  ComponentProps<typeof Slider>,
  "value" | "onValueChange"
> & {
  initial: number;
  showValue?: boolean;
  popover?: boolean;
};

function ControlledSlider({
  initial,
  showValue,
  popover,
  ...rest
}: ControlledProps) {
  const [value, setValue] = useState(initial);
  const [dragging, setDragging] = useState(false);
  const palette = useResolvedTheme();
  const min = rest.min ?? 0;
  const max = rest.max ?? 1;
  const ratio = max === min ? 0 : (value - min) / (max - min);
  const display =
    Number.isInteger(value) || Math.abs(value) >= 10
      ? Math.round(value)
      : Math.round(value * 1000) / 1000;

  return (
    <View style={[styles.sliderWrap, popover ? styles.sliderWrapPopover : null]}>
      {popover && dragging ? (
        <View
          pointerEvents="none"
          style={[
            styles.tooltip,
            {
              left: `${Math.min(100, Math.max(0, ratio * 100))}%`,
            },
          ]}
        >
          <View
            style={[styles.tooltipBubble, { backgroundColor: palette.heading }]}
          >
            <Text style={[styles.tooltipText, { color: palette.onPrimary }]}>
              {display}
            </Text>
          </View>
          <View
            style={[styles.tooltipArrow, { borderTopColor: palette.heading }]}
          />
        </View>
      ) : null}

      {showValue && !popover ? (
        <Text style={[styles.valueHint, { color: palette.textSecondary }]}>
          {display}
        </Text>
      ) : null}

      <Slider
        {...rest}
        value={value}
        onValueChange={setValue}
        onSlidingStart={(v) => {
          setDragging(true);
          rest.onSlidingStart?.(v);
        }}
        onSlidingComplete={(v) => {
          setDragging(false);
          rest.onSlidingComplete?.(v);
        }}
      />
    </View>
  );
}

/** Slider gallery demos. */
function SliderGallery() {
  return (
    <ScrollView
      contentContainerStyle={styles.scroll}
      keyboardShouldPersistTaps="handled"
    >
      <DemoBlock title="基础用法">
        <ControlledSlider initial={0} min={0} max={100} />
      </DemoBlock>

      <DemoBlock title="显示刻度并指定步距">
        <ControlledSlider
          initial={40}
          min={0}
          max={100}
          step={10}
          ticks
        />
      </DemoBlock>

      <DemoBlock title="传入刻度标记">
        <ControlledSlider
          initial={40}
          min={0}
          max={100}
          step={20}
          ticks
        />
        <MarksRow marks={MARKS} min={0} max={100} />
      </DemoBlock>

      <DemoBlock title="最大/最小值">
        <ControlledSlider
          initial={400}
          min={100}
          max={1000}
          step={100}
          ticks
          showValue
        />
      </DemoBlock>

      <DemoBlock title="默认值">
        <ControlledSlider initial={40} min={0} max={100} step={20} />
      </DemoBlock>

      <DemoBlock title="在拖动时显示悬浮提示">
        <ControlledSlider initial={60} min={0} max={100} step={20} popover />
      </DemoBlock>

      <DemoBlock title="禁用">
        <ControlledSlider initial={30} min={0} max={100} disabled />
      </DemoBlock>

      <DemoBlock title="非受控">
        <Slider defaultValue={40} min={0} max={100} step={10} ticks />
      </DemoBlock>
    </ScrollView>
  );
}

export const Default: Story = {
  args: {
    defaultValue: 40,
    min: 0,
    max: 100,
  },
  render: () => <SliderGallery />,
};

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: 32,
    gap: 8,
  },
  block: {
    marginBottom: 20,
  },
  blockTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 10,
  },
  blockBody: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#E5E7EB",
    overflow: "visible",
  },
  sliderWrap: {
    position: "relative",
  },
  sliderWrapPopover: {
    paddingTop: 40,
  },
  marksRow: {
    position: "relative",
    height: 20,
    marginTop: 4,
    marginHorizontal: 8,
  },
  markLabel: {
    position: "absolute",
    top: 0,
    width: 28,
    fontSize: 11,
    textAlign: "center",
  },
  valueHint: {
    alignSelf: "center",
    fontSize: 13,
    marginBottom: 4,
  },
  tooltip: {
    position: "absolute",
    top: 0,
    width: 44,
    marginLeft: -22,
    alignItems: "center",
    zIndex: 20,
  },
  tooltipBubble: {
    minWidth: 36,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignItems: "center",
  },
  tooltipText: {
    fontSize: 13,
    fontWeight: "600",
  },
  tooltipArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 6,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
  },
});
