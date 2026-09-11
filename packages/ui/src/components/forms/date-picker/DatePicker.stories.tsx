import type { Meta, StoryObj } from "@storybook/react-native";
import { useState, type ReactNode } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { Button } from "../../controls/button";
import { DatePicker } from "./DatePicker";
import { DateTimePicker } from "./DateTimePicker";

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.block}>
      <Text style={styles.blockTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Gallery() {
  const [dateOpen, setDateOpen] = useState(false);
  const [dtOpen, setDtOpen] = useState(false);
  const [date, setDate] = useState("2026-09-11");
  const [dt, setDt] = useState("2026-09-12T04:55");

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <Block title="年月日滚轮">
        <Button onPress={() => setDateOpen(true)}>{date}</Button>
        <DatePicker
          visible={dateOpen}
          onClose={() => setDateOpen(false)}
          value={date}
          onConfirm={setDate}
        />
      </Block>

      <Block title="日期 + 时分">
        <Button onPress={() => setDtOpen(true)}>{dt}</Button>
        <DateTimePicker
          visible={dtOpen}
          onClose={() => setDtOpen(false)}
          value={dt}
          title="选择日期时间"
          minuteStep={5}
          onConfirm={setDt}
        />
      </Block>
    </ScrollView>
  );
}

const meta = {
  title: "UI/Forms 表单/DatePicker",
  component: DatePicker,
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Family: Story = {
  args: {
    visible: false,
    onClose: () => {},
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
