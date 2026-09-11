import type { Meta, StoryObj } from "@storybook/react-native";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { useConfig } from "../config";
import { useUiTheme } from "./ThemeProvider";
import type { UiTheme } from "./types";

const TOKEN_META: {
  key: keyof UiTheme;
  zh: string;
  en: string;
}[] = [
  { key: "primary", zh: "主色", en: "Primary" },
  { key: "onPrimary", zh: "主色上的文字", en: "On primary" },
  { key: "background", zh: "页面背景", en: "Background" },
  { key: "card", zh: "卡片背景", en: "Card" },
  { key: "surface", zh: "次级填充", en: "Surface" },
  { key: "border", zh: "边框", en: "Border" },
  { key: "text", zh: "正文", en: "Text" },
  { key: "textSecondary", zh: "次要文字", en: "Secondary text" },
  { key: "heading", zh: "标题", en: "Heading" },
  { key: "muted", zh: "弱化文字", en: "Muted" },
  { key: "red", zh: "危险 / 强调红", en: "Danger / red" },
  { key: "green", zh: "成功", en: "Success" },
  { key: "yellow", zh: "警告", en: "Warning" },
  { key: "focus", zh: "焦点环", en: "Focus" },
];

function Swatch({
  name,
  label,
  value,
  textColor,
  mutedColor,
}: {
  name: string;
  label: string;
  value: string;
  textColor: string;
  mutedColor: string;
}) {
  const isLight =
    value.toLowerCase() === "#ffffff" ||
    value.toLowerCase() === "#fff" ||
    value.toLowerCase().startsWith("#f");
  return (
    <View style={styles.swatchRow}>
      <View
        style={[
          styles.swatch,
          {
            backgroundColor: value,
            borderColor: isLight ? "#ddd" : "transparent",
          },
        ]}
      />
      <View style={styles.swatchMeta}>
        <Text style={[styles.swatchName, { color: textColor }]}>{name}</Text>
        <Text style={[styles.swatchLabel, { color: mutedColor }]}>{label}</Text>
        <Text style={[styles.swatchValue, { color: mutedColor }]}>{value}</Text>
      </View>
    </View>
  );
}

function ThemeGuide() {
  const theme = useUiTheme();
  const { locale, mode } = useConfig();
  const zh = locale === "zh";

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <Text style={[styles.h1, { color: theme.heading }]}>
        {zh ? "Theme 主题色板" : "Theme palette"}
      </Text>
      <Text style={[styles.lead, { color: theme.textSecondary }]}>
        {zh
          ? "组件通过 ConfigProvider / ThemeProvider 读取 UiTheme。应用层负责主题注册与深浅切换，kit 只消费最终色板。"
          : "Components read UiTheme via ConfigProvider / ThemeProvider. The app owns theme registry and light/dark; the kit consumes the resolved palette."}
      </Text>

      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.h2, { color: theme.heading }]}>
          {zh ? "当前配置" : "Current config"}
        </Text>
        <Text style={[styles.mono, { color: theme.text }]}>
          mode: {mode}
          {"\n"}
          locale: {locale}
        </Text>
      </View>

      <Text style={[styles.h2, { color: theme.heading }]}>
        {zh ? "色板 Token" : "Color tokens"}
      </Text>
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        {TOKEN_META.map((t) => (
          <Swatch
            key={t.key}
            name={t.key}
            label={zh ? t.zh : t.en}
            value={theme[t.key]}
            textColor={theme.text}
            mutedColor={theme.muted}
          />
        ))}
      </View>

      <Text style={[styles.h2, { color: theme.heading }]}>
        {zh ? "用法" : "Usage"}
      </Text>
      <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Text style={[styles.code, { color: theme.text }]}>
          {`<ConfigProvider
  theme={uiTheme}
  locale="zh"
  mode="light"
>
  {children}
</ConfigProvider>`}
        </Text>
      </View>
      <Text style={[styles.footnote, { color: theme.muted }]}>
        {zh
          ? "局部覆盖：组件 props.theme 可传 Partial<UiTheme>，由 useResolvedTheme 合并。"
          : "Local override: pass theme?: Partial<UiTheme> on components; useResolvedTheme merges it."}
      </Text>
    </ScrollView>
  );
}

const meta = {
  title: "UI/Design 设计规范/Theme",
  component: ThemeGuide,
} satisfies Meta<typeof ThemeGuide>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <ThemeGuide />,
};

const styles = StyleSheet.create({
  page: {
    padding: 16,
    paddingBottom: 48,
    gap: 12,
  },
  h1: {
    fontSize: 22,
    fontWeight: "700",
  },
  lead: {
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 4,
  },
  h2: {
    fontSize: 15,
    fontWeight: "600",
    marginTop: 8,
  },
  card: {
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 14,
    gap: 10,
  },
  mono: {
    fontSize: 13,
    lineHeight: 20,
  },
  code: {
    fontSize: 12,
    lineHeight: 18,
  },
  swatchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  swatch: {
    width: 44,
    height: 44,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
  },
  swatchMeta: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  swatchName: {
    fontSize: 14,
    fontWeight: "600",
  },
  swatchLabel: {
    fontSize: 12,
  },
  swatchValue: {
    fontSize: 12,
  },
  footnote: {
    fontSize: 12,
    lineHeight: 18,
  },
});
