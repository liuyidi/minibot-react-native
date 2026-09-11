import type { Meta, StoryObj } from "@storybook/react-native";
import type { ReactNode } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import {
  Bell,
  Check,
  ChevronRight,
  Heart,
  Home,
  Mail,
  Menu,
  Search,
  Settings,
  Star,
  Trash2,
  User,
  X,
  type LucideIcon,
} from "lucide-react-native";

import { useUiTheme } from "../../../theme/ThemeProvider";
import { Icon } from "./Icon";

function DemoBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.block}>
      <Text style={styles.blockTitle}>{title}</Text>
      {children}
    </View>
  );
}

const SAMPLES: { icon: LucideIcon; label: string }[] = [
  { icon: Home, label: "Home" },
  { icon: Search, label: "Search" },
  { icon: Bell, label: "Bell" },
  { icon: User, label: "User" },
  { icon: Settings, label: "Settings" },
  { icon: Mail, label: "Mail" },
  { icon: Star, label: "Star" },
  { icon: Menu, label: "Menu" },
  { icon: Check, label: "Check" },
  { icon: X, label: "X" },
  { icon: Trash2, label: "Trash2" },
  { icon: ChevronRight, label: "ChevronRight" },
];

function IconGallery() {
  const theme = useUiTheme();

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <DemoBlock title="常用图标">
        <View style={styles.grid}>
          {SAMPLES.map((item) => (
            <View key={item.label} style={styles.cell}>
              <Icon icon={item.icon} size={24} color="text" />
              <Text style={[styles.cellLabel, { color: theme.muted }]}>
                {item.label}
              </Text>
            </View>
          ))}
        </View>
      </DemoBlock>

      <DemoBlock title="尺寸">
        <View style={styles.row}>
          {[16, 20, 24, 32, 40].map((size) => (
            <View key={size} style={styles.sizeItem}>
              <Icon icon={Star} size={size} color="primary" />
              <Text style={[styles.cellLabel, { color: theme.muted }]}>
                {size}
              </Text>
            </View>
          ))}
        </View>
      </DemoBlock>

      <DemoBlock title="主题色 Token">
        <View style={styles.rowWrap}>
          {(
            [
              "text",
              "muted",
              "primary",
              "red",
              "green",
              "yellow",
              "focus",
            ] as const
          ).map((token) => (
            <View key={token} style={styles.colorItem}>
              <Icon icon={Check} size={22} color={token} />
              <Text style={[styles.cellLabel, { color: theme.muted }]}>
                {token}
              </Text>
            </View>
          ))}
        </View>
      </DemoBlock>

      <DemoBlock title="自定义色值">
        <View style={styles.row}>
          <Icon icon={Bell} size={24} color="#1677ff" />
          <Icon icon={Star} size={24} color="#f59e0b" />
          <Icon icon={Heart} size={24} color="#ec4899" />
        </View>
      </DemoBlock>
    </ScrollView>
  );
}

const meta = {
  title: "UI/Foundation 基础/Icon",
  component: Icon,
} satisfies Meta<typeof Icon>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    icon: Home,
    size: 24,
    color: "text",
  },
  render: () => <IconGallery />,
};

const styles = StyleSheet.create({
  page: {
    paddingBottom: 40,
  },
  block: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    gap: 12,
  },
  blockTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#666",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  cell: {
    width: "23%",
    minWidth: 72,
    alignItems: "center",
    gap: 6,
    paddingVertical: 10,
  },
  cellLabel: {
    fontSize: 11,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 16,
  },
  rowWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  sizeItem: {
    alignItems: "center",
    gap: 6,
  },
  colorItem: {
    alignItems: "center",
    gap: 6,
    minWidth: 56,
  },
});
