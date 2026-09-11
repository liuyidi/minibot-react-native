import { useCallback, useMemo, useState, type ReactNode } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import type { SBUI } from "@storybook/react-native-ui-common";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import {
  ConfigProvider,
  brandDark,
  brandLight,
  type UiLocale,
  type UiMode,
} from "@minibot/ui";

type GalleryItem = {
  id: string;
  name: string;
  group: string;
};

/** Story title group keys (as authored in stories). */
const GROUP_ORDER = [
  "Design 设计规范",
  "Foundation 基础",
  "Controls 控件",
  "Forms 表单",
  "Lists 列表",
  "Feedback 反馈",
  "Overlays 浮层",
  "Layout 布局",
  "Business 业务",
] as const;

const GROUP_LABEL: Record<UiLocale, Record<string, string>> = {
  zh: Object.fromEntries(GROUP_ORDER.map((g) => [g, g])),
  en: {
    "Design 设计规范": "Design",
    "Foundation 基础": "Foundation",
    "Controls 控件": "Controls",
    "Forms 表单": "Forms",
    "Lists 列表": "Lists",
    "Feedback 反馈": "Feedback",
    "Overlays 浮层": "Overlays",
    "Layout 布局": "Layout",
    "Business 业务": "Business",
  },
};

/** English component name → Chinese label. */
const COMPONENT_ZH: Record<string, string> = {
  Theme: "主题",
  Text: "文本",
  Icon: "图标",
  Card: "卡片",
  Divider: "分割线",
  Avatar: "头像",
  Badge: "徽标",
  Chip: "标签",
  Tag: "标记",
  Price: "价格",
  Collapse: "折叠面板",
  Space: "间距",
  Flex: "弹性布局",
  Button: "按钮",
  IconButton: "图标按钮",
  Switch: "开关",
  Stepper: "步进器",
  Checkbox: "复选框",
  Radio: "单选框",
  SegmentedControl: "分段控制器",
  Slider: "滑动输入条",
  Tabs: "标签页",
  TextField: "输入框",
  TextArea: "多行输入",
  PasswordField: "密码输入",
  OTPInput: "验证码输入",
  Form: "表单",
  SearchBar: "搜索栏",
  Picker: "选择器",
  PickerRow: "选择行",
  TimePicker: "时间选择",
  DatePicker: "日期选择",
  CalendarPicker: "日历选择",
  ListGroup: "列表分组",
  ListRow: "列表行",
  EmptyState: "空状态",
  MediaListItem: "媒资列表项",
  SwipeCell: "滑动单元格",
  Spinner: "加载中",
  Skeleton: "骨架屏",
  ProgressBar: "进度条",
  Toast: "轻提示",
  Banner: "横幅提示",
  Backdrop: "遮罩",
  Dialog: "对话框",
  BottomSheet: "底部弹层",
  ActionSheet: "动作面板",
  DropdownMenu: "下拉菜单",
  Popup: "弹出层",
  OverlayStack: "浮层栈",
  Screen: "页面容器",
  StackHeader: "导航栏",
  FAB: "悬浮按钮",
  SafeArea: "安全区",
  TabBar: "底部导航",
  PullRefresh: "下拉刷新",
  InfiniteList: "无限列表",
  Image: "图片",
  ImagePreview: "图片预览",
  Uploader: "上传",
  NoticeBar: "通知栏",
  Popover: "气泡",
  Rate: "评分",
  Steps: "步骤条",
  Ticket: "券票",
};

function displayName(name: string, locale: UiLocale): string {
  if (locale === "en") return name;
  const zh = COMPONENT_ZH[name];
  return zh ? `${name} ${zh}` : name;
}

function groupLabel(group: string, locale: UiLocale): string {
  return GROUP_LABEL[locale][group] ?? group;
}

function parseGroups(
  storyHash: Parameters<SBUI>[0]["storyHash"],
): { group: string; items: GalleryItem[] }[] {
  const byComponent = new Map<string, GalleryItem>();

  for (const entry of Object.values(storyHash ?? {})) {
    if (!entry || entry.type !== "story") continue;
    const title = entry.title ?? "";
    const parts = title.replace(/^UI\//, "").split("/");
    if (parts.length < 2) continue;
    const group = parts[0]!;
    const name = parts[parts.length - 1]!;
    const key = `${group}/${name}`;
    const existing = byComponent.get(key);
    const isDefault = entry.name === "Default";
    if (!existing || isDefault) {
      byComponent.set(key, { id: entry.id, name, group });
    }
  }

  const grouped = new Map<string, GalleryItem[]>();
  for (const item of byComponent.values()) {
    const list = grouped.get(item.group) ?? [];
    list.push(item);
    grouped.set(item.group, list);
  }

  for (const list of grouped.values()) {
    list.sort((a, b) => a.name.localeCompare(b.name));
  }

  const orderedGroups = [
    ...GROUP_ORDER.filter((g) => grouped.has(g)),
    ...[...grouped.keys()].filter((g) => !(GROUP_ORDER as readonly string[]).includes(g)).sort(),
  ];

  return orderedGroups.map((group) => ({
    group,
    items: grouped.get(group) ?? [],
  }));
}

function GalleryToggle({
  options,
  value,
  onChange,
  dark,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
  dark: boolean;
}) {
  return (
    <View
      style={[
        styles.toggle,
        {
          backgroundColor: dark ? "#2a2a2a" : "#E5E7EB",
        },
      ]}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            onPress={() => onChange(opt.value)}
            style={({ pressed }) => [
              styles.toggleItem,
              active && {
                backgroundColor: dark ? "#141414" : "#FFFFFF",
              },
              { opacity: pressed ? 0.75 : 1 },
            ]}
          >
            <Text
              style={[
                styles.toggleLabel,
                { color: dark ? "#f5f5f5" : "#111827" },
                active && styles.toggleLabelActive,
              ]}
            >
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function GalleryToolbar({
  locale,
  mode,
  onLocale,
  onMode,
}: {
  locale: UiLocale;
  mode: UiMode;
  onLocale: (l: UiLocale) => void;
  onMode: (m: UiMode) => void;
}) {
  const dark = mode === "dark";
  return (
    <View style={styles.toolbar}>
      <GalleryToggle
        dark={dark}
        value={locale}
        onChange={(v) => onLocale(v as UiLocale)}
        options={[
          { value: "zh", label: "中" },
          { value: "en", label: "EN" },
        ]}
      />
      <GalleryToggle
        dark={dark}
        value={mode}
        onChange={(v) => onMode(v as UiMode)}
        options={[
          { value: "light", label: locale === "zh" ? "浅" : "Light" },
          { value: "dark", label: locale === "zh" ? "深" : "Dark" },
        ]}
      />
    </View>
  );
}

export const GalleryStorybookUI: SBUI = ({
  story,
  storyHash,
  setStory,
  children,
}) => {
  const [browsing, setBrowsing] = useState(true);
  const [locale, setLocale] = useState<UiLocale>("zh");
  const [mode, setMode] = useState<UiMode>("light");
  const { width } = useWindowDimensions();
  const gap = 12;
  const pad = 16;
  const cardWidth = (width - pad * 2 - gap) / 2;
  const dark = mode === "dark";
  const theme = dark ? brandDark : brandLight;
  const colors = {
    page: dark ? "#080808" : "#F5F6F8",
    card: dark ? "#141414" : "#FFFFFF",
    border: dark ? "#2a2a2a" : "#E5E7EB",
    title: dark ? "#f5f5f5" : "#111827",
    muted: dark ? "#a3a3a3" : "#6B7280",
    link: dark ? "#818cf8" : "#2563EB",
  };

  const sections = useMemo(() => parseGroups(storyHash), [storyHash]);

  const openStory = useCallback(
    (id: string) => {
      setStory(id);
      setBrowsing(false);
    },
    [setStory],
  );

  const componentName =
    story?.title?.split("/").pop() ?? story?.name ?? "Component";
  const headerTitle = displayName(componentName, locale);

  const shell = (body: ReactNode) => (
    <GestureHandlerRootView style={[styles.safe, { backgroundColor: colors.page }]}>
      <SafeAreaProvider>
        <ConfigProvider theme={theme} locale={locale} mode={mode}>
          <SafeAreaView style={[styles.safe, { backgroundColor: colors.page }]}>
            {body}
          </SafeAreaView>
        </ConfigProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );

  if (!browsing) {
    return shell(
      <>
        <View
          style={[
            styles.detailHeader,
            { backgroundColor: colors.card, borderBottomColor: colors.border },
          ]}
        >
          <Pressable
            accessibilityRole="button"
            onPress={() => setBrowsing(true)}
            hitSlop={8}
            style={({ pressed }) => [
              styles.backBtn,
              { opacity: pressed ? 0.6 : 1 },
            ]}
          >
            <Text style={[styles.backLabel, { color: colors.link }]}>
              {locale === "zh" ? "← 组件库" : "← Library"}
            </Text>
          </Pressable>
          <Text
            style={[styles.detailTitle, { color: colors.title }]}
            numberOfLines={1}
          >
            {headerTitle}
          </Text>
          {/* Balance the back button so the title stays centered. */}
          <View style={styles.backBtnSpacer} pointerEvents="none">
            <Text style={[styles.backLabel, { opacity: 0 }]}>
              {locale === "zh" ? "← 组件库" : "← Library"}
            </Text>
          </View>
        </View>
        <View style={[styles.detailBody, { backgroundColor: colors.card }]}>
          {children}
        </View>
      </>,
    );
  }

  return shell(
    <>
      <View style={styles.homeHeader}>
        <View style={styles.homeHeaderRow}>
          <View style={styles.homeHeaderText}>
            <Text style={[styles.homeTitle, { color: colors.title }]}>
              minibot UI
            </Text>
            <Text style={[styles.homeSubtitle, { color: colors.muted }]}>
              {locale === "zh" ? "组件画廊" : "Component gallery"}
            </Text>
          </View>
          <GalleryToolbar
            locale={locale}
            mode={mode}
            onLocale={setLocale}
            onMode={setMode}
          />
        </View>
      </View>
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingHorizontal: pad }]}
        keyboardShouldPersistTaps="handled"
      >
        {sections.map(({ group, items }) => (
          <View key={group} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.muted }]}>
              {groupLabel(group, locale)}
            </Text>
            <View style={[styles.grid, { gap }]}>
              {items.map((item) => (
                <Pressable
                  key={item.id}
                  accessibilityRole="button"
                  onPress={() => openStory(item.id)}
                  style={({ pressed }) => [
                    styles.card,
                    {
                      width: cardWidth,
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                      opacity: pressed ? 0.75 : 1,
                    },
                  ]}
                >
                  <Text
                    style={[styles.cardName, { color: colors.title }]}
                    numberOfLines={2}
                  >
                    {displayName(item.name, locale)}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </>,
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  homeHeader: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  homeHeaderRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  homeHeaderText: {
    flex: 1,
    minWidth: 0,
  },
  homeTitle: {
    fontSize: 28,
    fontWeight: "700",
  },
  homeSubtitle: {
    marginTop: 4,
    fontSize: 15,
  },
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexShrink: 0,
  },
  toggle: {
    flexDirection: "row",
    borderRadius: 8,
    padding: 2,
    gap: 2,
  },
  toggleItem: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
    minWidth: 32,
    alignItems: "center",
  },
  toggleLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
  toggleLabelActive: {
    fontWeight: "700",
  },
  scroll: {
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 10,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  card: {
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 14,
    minHeight: 72,
    justifyContent: "center",
    borderWidth: StyleSheet.hairlineWidth,
  },
  cardName: {
    fontSize: 15,
    fontWeight: "600",
  },
  detailHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 8,
  },
  backBtn: {
    paddingVertical: 4,
    paddingHorizontal: 4,
    flexShrink: 0,
  },
  backBtnSpacer: {
    paddingVertical: 4,
    paddingHorizontal: 4,
    flexShrink: 0,
  },
  backLabel: {
    fontSize: 15,
    fontWeight: "500",
  },
  detailTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 15,
    fontWeight: "600",
    minWidth: 0,
  },
  detailBody: {
    flex: 1,
  },
});
