import type { Meta, StoryObj } from "@storybook/react-native";
import { useState, type ReactNode } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { Button } from "../../controls/button";
import { Picker } from "./Picker";
import { PickerGroup } from "./PickerGroup";
import { PickerRow } from "./PickerRow";
import { PickerView, type PickerOption } from "./PickerView";
import { TimePickerView } from "../time-picker/TimePickerView";

const cities: PickerOption[] = [
  { label: "北京", value: "bj" },
  { label: "上海", value: "sh" },
  { label: "广州", value: "gz" },
  { label: "深圳", value: "sz" },
  { label: "杭州", value: "hz" },
];

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.block}>
      <Text style={styles.blockTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Gallery() {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState(["sh"]);
  const [start, setStart] = useState("11:00");
  const [end, setEnd] = useState("10:00");

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <Block title="PickerRow（触发行）">
        <PickerRow
          label="城市"
          value={cities.find((c) => c.value === values[0])?.label}
          onPress={() => setOpen(true)}
        />
        <PickerRow label="时区" placeholder="请选择" onPress={() => {}} />
      </Block>

      <Block title="PickerView（无弹层）">
        <PickerView columns={[cities]} value={values} onChange={setValues} />
      </Block>

      <Block title="PickerGroup（并排面板）">
        <PickerGroup
          items={[
            {
              title: "取车时间",
              children: (
                <TimePickerView
                  value={start}
                  minuteStep={30}
                  onChange={setStart}
                />
              ),
            },
            {
              title: "还车时间",
              children: (
                <TimePickerView value={end} minuteStep={30} onChange={setEnd} />
              ),
            },
          ]}
        />
      </Block>

      <Block title="Picker（带弹层）">
        <Button onPress={() => setOpen(true)}>
          打开 · {values.join(", ")}
        </Button>
        <Picker
          visible={open}
          onClose={() => setOpen(false)}
          columns={[cities]}
          value={values}
          onConfirm={(v) => setValues(v)}
        />
      </Block>
    </ScrollView>
  );
}

const meta = {
  title: "UI/Forms 表单/Picker",
  component: Picker,
} satisfies Meta<typeof Picker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Family: Story = {
  args: {
    visible: false,
    onClose: () => {},
    columns: [cities],
  },
  render: () => <Gallery />,
};

const styles = StyleSheet.create({
  page: { paddingBottom: 40 },
  block: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    gap: 12,
  },
  blockTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
});
