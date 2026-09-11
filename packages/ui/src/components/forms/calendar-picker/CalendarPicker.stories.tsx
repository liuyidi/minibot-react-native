import type { Meta, StoryObj } from "@storybook/react-native";
import { useState, type ReactNode } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { Button } from "../../controls/button";
import { CalendarPicker } from "./CalendarPicker";
import type { CalendarRangeValue } from "./CalendarPickerView";
import {
  CalendarRangeWithTime,
  type CalendarRangeWithTimeValue,
} from "./CalendarRangeWithTime";

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.block}>
      <Text style={styles.blockTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Gallery() {
  const [calOpen, setCalOpen] = useState(false);
  const [rangeOpen, setRangeOpen] = useState(false);
  const [range, setRange] = useState<CalendarRangeValue>({
    start: "2026-09-11",
    end: "2026-09-12",
  });
  const [rent, setRent] = useState<CalendarRangeWithTimeValue>({
    startDate: "2026-09-12",
    endDate: "2026-09-14",
    startTime: "11:00",
    endTime: "10:00",
  });

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <Block title="入住离店（区间）">
        <Button onPress={() => setCalOpen(true)}>
          {range.start} → {range.end ?? "?"}
        </Button>
        <CalendarPicker
          visible={calOpen}
          onClose={() => setCalOpen(false)}
          mode="range"
          rangeValue={range}
          title="请选择入住离店日期"
          onConfirm={({ range: next }) => {
            if (next) setRange(next);
          }}
        />
      </Block>

      <Block title="取还车（区间 + 时间）">
        <Button onPress={() => setRangeOpen(true)}>
          {rent.startDate} {rent.startTime} → {rent.endDate} {rent.endTime}
        </Button>
        <CalendarRangeWithTime
          visible={rangeOpen}
          onClose={() => setRangeOpen(false)}
          value={rent}
          onConfirm={setRent}
          minuteStep={30}
        />
      </Block>
    </ScrollView>
  );
}

const meta = {
  title: "UI/Forms 表单/CalendarPicker",
  component: CalendarPicker,
} satisfies Meta<typeof CalendarPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Family: Story = {
  args: {
    visible: false,
    onClose: () => {},
    mode: "range",
  },
  render: () => <Gallery />,
};

const styles = StyleSheet.create({
  page: { paddingBottom: 40 },
  block: {
    paddingHorizontal: 16,
    paddingTop: 20,
    gap: 12,
  },
  blockTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
});
