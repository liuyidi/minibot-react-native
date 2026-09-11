import type { Meta, StoryObj } from "@storybook/react-native";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { Button } from "../../controls/button";
import { TimePicker } from "./TimePicker";

function Demo() {
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState("14:30");

  return (
    <View style={styles.page}>
      <Button onPress={() => setOpen(true)}>{`时间 · ${time}`}</Button>
      <TimePicker
        visible={open}
        onClose={() => setOpen(false)}
        value={time}
        minuteStep={5}
        onConfirm={setTime}
      />
    </View>
  );
}

const meta = {
  title: "UI/Forms 表单/TimePicker",
  component: TimePicker,
} satisfies Meta<typeof TimePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    visible: false,
    onClose: () => {},
  },
  render: () => <Demo />,
};

const styles = StyleSheet.create({
  page: { flex: 1, padding: 16, justifyContent: "center", gap: 12 },
});
