import type { Meta, StoryObj } from "@storybook/react-native";
import { Children, useState, type ReactNode } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

import { Button } from "../../controls/button";
import { SafeArea } from "../../layout/safe-area";
import { ListRow } from "../../lists/list-row";
import { Popup } from "./Popup";

/** Strip whitespace text nodes — RN View cannot host raw strings. */
function asViewChildren(children: ReactNode) {
  return Children.toArray(children).filter(
    (child) => typeof child !== "string" && typeof child !== "number",
  );
}

function DemoBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.block}>
      {asViewChildren([
        <Text key="title" style={styles.blockTitle}>
          {title}
        </Text>,
        <View key="card" style={styles.card}>
          {asViewChildren(children)}
        </View>,
      ])}
    </View>
  );
}

function PositionCell({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.posCell, pressed && { opacity: 0.7 }]}
    >
      <Text style={styles.posLabel}>{label}</Text>
    </Pressable>
  );
}

function PopupGallery() {
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();
  const edgeH = Math.round(windowHeight * 0.3);
  const sideW = Math.round(windowWidth * 0.3);

  const [basic, setBasic] = useState(false);
  const [top, setTop] = useState(false);
  const [bottom, setBottom] = useState(false);
  const [left, setLeft] = useState(false);
  const [right, setRight] = useState(false);
  const [closeIcon, setCloseIcon] = useState(false);
  const [closeIconLeft, setCloseIconLeft] = useState(false);
  const [roundCenter, setRoundCenter] = useState(false);
  const [roundBottom, setRoundBottom] = useState(false);
  const [clickEvents, setClickEvents] = useState(false);
  const [lastEvent, setLastEvent] = useState("");

  return (
    <View style={styles.page}>
      {asViewChildren([
        lastEvent ? (
          <Text key="event" style={styles.eventBanner}>
            事件：{lastEvent}
          </Text>
        ) : null,
        <DemoBlock key="basic" title="基础用法">
          <ListRow
            title="展示弹出层"
            onPress={() => setBasic(true)}
            trailing={<Text style={styles.chevron}>›</Text>}
          />
        </DemoBlock>,
        <Popup key="basic-popup" visible={basic} onClose={() => setBasic(false)}>
          <View style={styles.basicBody}>
            <Text style={styles.content}>内容</Text>
          </View>
        </Popup>,
        <DemoBlock key="position" title="弹出位置">
          <View style={styles.posGrid}>
            {asViewChildren([
              <PositionCell
                key="t"
                label="顶部弹出"
                onPress={() => setTop(true)}
              />,
              <PositionCell
                key="b"
                label="底部弹出"
                onPress={() => setBottom(true)}
              />,
              <PositionCell
                key="l"
                label="左侧弹出"
                onPress={() => setLeft(true)}
              />,
              <PositionCell
                key="r"
                label="右侧弹出"
                onPress={() => setRight(true)}
              />,
            ])}
          </View>
        </DemoBlock>,
        <Popup
          key="top-popup"
          visible={top}
          position="top"
          onClose={() => setTop(false)}
        >
          <View style={styles.sheetBody}>
            {asViewChildren([
              <Text key="t" style={styles.sheetTitle}>
                顶部 Popup
              </Text>,
              <Button key="c" onPress={() => setTop(false)}>
                关闭
              </Button>,
            ])}
          </View>
        </Popup>,
        <Popup
          key="bottom-popup"
          visible={bottom}
          position="bottom"
          animation="slide-up"
          onClose={() => setBottom(false)}
        >
          <View style={styles.sheetBody}>
            {asViewChildren([
              <Text key="t" style={styles.sheetTitle}>
                底部 Popup
              </Text>,
              <Button key="c" onPress={() => setBottom(false)}>
                关闭
              </Button>,
            ])}
          </View>
        </Popup>,
        <Popup
          key="left-popup"
          visible={left}
          position="left"
          onClose={() => setLeft(false)}
          style={{ width: sideW }}
        >
          <SafeArea position="top">
            <View style={styles.sheetBody}>
              <Text style={styles.sheetTitle}>左侧 Popup</Text>
            </View>
          </SafeArea>
        </Popup>,
        <Popup
          key="right-popup"
          visible={right}
          position="right"
          onClose={() => setRight(false)}
          style={{ width: sideW }}
        >
          <SafeArea position="top">
            <View style={styles.sheetBody}>
              <Text style={styles.sheetTitle}>右侧 Popup</Text>
            </View>
          </SafeArea>
        </Popup>,
        <DemoBlock key="close" title="关闭图标">
          <ListRow
            title="关闭图标"
            onPress={() => setCloseIcon(true)}
            showDivider
            trailing={<Text style={styles.chevron}>›</Text>}
          />
          <ListRow
            title="图标位置"
            onPress={() => setCloseIconLeft(true)}
            trailing={<Text style={styles.chevron}>›</Text>}
          />
        </DemoBlock>,
        <Popup
          key="close-popup"
          visible={closeIcon}
          position="bottom"
          animation="slide-up"
          closeable
          onClose={() => setCloseIcon(false)}
          style={{ height: edgeH }}
        />,
        <Popup
          key="close-left-popup"
          visible={closeIconLeft}
          position="bottom"
          animation="slide-up"
          closeable
          closeIconPosition="top-left"
          onClose={() => setCloseIconLeft(false)}
          style={{ height: edgeH }}
        />,
        <DemoBlock key="round" title="圆角弹窗">
          <ListRow
            title="圆角弹窗（居中）"
            onPress={() => setRoundCenter(true)}
            showDivider
            trailing={<Text style={styles.chevron}>›</Text>}
          />
          <ListRow
            title="圆角弹窗（底部）"
            onPress={() => setRoundBottom(true)}
            trailing={<Text style={styles.chevron}>›</Text>}
          />
        </DemoBlock>,
        <Popup
          key="round-center-popup"
          visible={roundCenter}
          round
          onClose={() => setRoundCenter(false)}
        >
          <View style={styles.basicBody}>
            <Text style={styles.content}>内容</Text>
          </View>
        </Popup>,
        <Popup
          key="round-bottom-popup"
          visible={roundBottom}
          position="bottom"
          animation="slide-up"
          round
          onClose={() => setRoundBottom(false)}
          style={{ height: edgeH }}
        />,
        <DemoBlock key="events" title="监听事件">
          <ListRow
            title="监听点击事件"
            onPress={() => setClickEvents(true)}
            trailing={<Text style={styles.chevron}>›</Text>}
          />
        </DemoBlock>,
        <Popup
          key="events-popup"
          visible={clickEvents}
          position="bottom"
          animation="slide-up"
          closeable
          onClose={() => {
            setLastEvent("close / click-close-icon");
            setClickEvents(false);
          }}
          closeOnMaskPress
          style={{ height: edgeH }}
        >
          <View style={styles.eventHint}>
            <Text style={styles.eventHintText}>点遮罩或 × 关闭</Text>
          </View>
        </Popup>,
      ])}
    </View>
  );
}

const meta = {
  title: "UI/Overlays 浮层/Popup",
  component: Popup,
} satisfies Meta<typeof Popup>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    visible: false,
    onClose: () => {},
  },
  render: () => <PopupGallery />,
};

const styles = StyleSheet.create({
  page: {
    paddingBottom: 40,
  },
  eventBanner: {
    marginHorizontal: 16,
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
    fontSize: 13,
    color: "#666",
  },
  block: {
    paddingTop: 16,
    gap: 8,
  },
  blockTitle: {
    paddingHorizontal: 16,
    fontSize: 13,
    fontWeight: "600",
    color: "#666",
  },
  card: {
    backgroundColor: "#fff",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#eee",
  },
  chevron: {
    fontSize: 18,
    color: "#ccc",
  },
  basicBody: {
    paddingVertical: 64,
    paddingHorizontal: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  sheetBody: {
    padding: 20,
    gap: 12,
  },
  sheetTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#111",
  },
  content: {
    fontSize: 15,
    color: "#333",
  },
  posGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  posCell: {
    width: "50%",
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#eee",
  },
  posLabel: {
    fontSize: 14,
    color: "#333",
  },
  eventHint: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  eventHintText: {
    fontSize: 14,
    color: "#999",
  },
});
