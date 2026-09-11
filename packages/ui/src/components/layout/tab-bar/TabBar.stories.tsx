import type { Meta, StoryObj } from "@storybook/react-native";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Home, MessageCircle, User } from "lucide-react-native";

import { Icon } from "../../foundation/icon";
import { TabBar } from "./TabBar";

function Demo() {
  const [tab, setTab] = useState("home");
  return (
    <View style={styles.page}>
      <View style={styles.body}>
        <Text style={styles.hint}>当前：{tab}</Text>
      </View>
      <TabBar
        value={tab}
        onChange={setTab}
        items={[
          {
            key: "home",
            label: "首页",
            icon: <Icon icon={Home} size={22} color="muted" />,
            activeIcon: <Icon icon={Home} size={22} color="primary" />,
          },
          {
            key: "chat",
            label: "消息",
            badge: 3,
            icon: <Icon icon={MessageCircle} size={22} color="muted" />,
            activeIcon: (
              <Icon icon={MessageCircle} size={22} color="primary" />
            ),
          },
          {
            key: "me",
            label: "我的",
            icon: <Icon icon={User} size={22} color="muted" />,
            activeIcon: <Icon icon={User} size={22} color="primary" />,
          },
        ]}
      />
    </View>
  );
}

const meta = {
  title: "UI/Layout 布局/TabBar",
  component: TabBar,
} satisfies Meta<typeof TabBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [],
  },
  render: () => <Demo />,
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    minHeight: 360,
  },
  body: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  hint: {
    fontSize: 15,
    color: "#666",
  },
});
