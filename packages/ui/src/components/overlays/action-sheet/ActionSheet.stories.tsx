import type { Meta, StoryObj } from "@storybook/react-native";
import { useState } from "react";
import { View } from "react-native";

import { ActionSheet } from "./ActionSheet";
import { Button } from "../../controls/button";

const meta = {
  title: "UI/Overlays 浮层/ActionSheet",
  component: ActionSheet,
} satisfies Meta<typeof ActionSheet>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    visible: true,
    onClose: () => {},
    title: "Choose an action",
    options: [
      { label: "Edit", onPress: () => {} },
      { label: "Share", onPress: () => {} },
      { label: "Delete", onPress: () => {}, destructive: true },
    ],
  },
  render: function ActionSheetStory(args) {
    const [open, setOpen] = useState(true);
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <Button  onPress={() => setOpen(true)} >Open ActionSheet</Button>
        <ActionSheet
          {...args}
          visible={open}
          onClose={() => setOpen(false)}
          options={args.options.map((opt) => ({
            ...opt,
            onPress: () => {
              opt.onPress();
              setOpen(false);
            },
          }))}
        />
      </View>
    );
  },
};
