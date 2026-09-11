import type { Meta, StoryObj } from "@storybook/react-native";
import { useState, type ReactNode } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { Button } from "../components/controls/button";
import { Toast, useToast } from "../components/feedback/toast";
import { Space } from "../components/foundation/space";
import { ActionSheet } from "../components/overlays/action-sheet";
import { BottomSheet } from "../components/overlays/bottom-sheet";
import { Dialog, useDialog } from "../components/overlays/dialog";
import { OverlayStack } from "./controller";

function DemoBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.block}>
      <Text style={styles.blockTitle}>{title}</Text>
      {children}
    </View>
  );
}

/**
 * Manual QA for nested OverlayStack entries (same RootSiblings host).
 * Preview already wraps ConfigProvider + RootSiblingParent.
 */
function OverlayStackGallery() {
  const { show: toastShow, success } = useToast();
  const { alert, confirm } = useDialog();

  const [sheetA, setSheetA] = useState(false);
  const [sheetB, setSheetB] = useState(false);
  const [actions, setActions] = useState(false);
  const [log, setLog] = useState("—");

  return (
    <ScrollView
      contentContainerStyle={styles.page}
      keyboardShouldPersistTaps="handled"
    >
      <DemoBlock title="嵌套 Sheet（A → B）">
        <Text style={styles.hint}>
          打开 A 后在 Sheet 内再开 B；蒙层 / 返回应只关栈顶。
        </Text>
        <Button onPress={() => setSheetA(true)}>打开 Sheet A</Button>
      </DemoBlock>

      <DemoBlock title="命令式叠在浮层上">
        <Space wrap gap={8}>
          <Button
            size="small"
            onPress={() => {
              setSheetA(true);
              setTimeout(() => {
                void alert({
                  title: "盖在 Sheet 上",
                  content: "这是 Dialog.alert，应高于 Sheet A。",
                }).then(() => setLog("alert: 已关，Sheet A 应仍在"));
              }, 400);
            }}
          >
            Sheet + alert
          </Button>
          <Button
            size="small"
            variant="secondary"
            onPress={() => {
              setSheetA(true);
              setTimeout(() => {
                success("Toast 应盖在 Sheet 之上");
                setLog("toast: 已 show");
              }, 400);
            }}
          >
            Sheet + Toast
          </Button>
          <Button
            size="small"
            fill="outline"
            onPress={() => {
              void confirm({
                title: "确认？",
                content: "确认后可再弹 Toast。",
              }).then((ok) => {
                if (ok) {
                  toastShow("已确认");
                  setLog("confirm: true");
                } else {
                  setLog("confirm: false");
                }
              });
            }}
          >
            confirm → Toast
          </Button>
        </Space>
      </DemoBlock>

      <DemoBlock title="调试">
        <Space wrap gap={8}>
          <Button
            size="small"
            variant="secondary"
            onPress={() => {
              const snap = OverlayStack.getSnapshot();
              setLog(
                `entries: ${snap.length} · ${snap.map((e) => e.type).join(" > ") || "(empty)"}`,
              );
            }}
          >
            打印栈
          </Button>
          <Button
            size="small"
            fill="outline"
            onPress={() => {
              OverlayStack.dismissAll();
              setSheetA(false);
              setSheetB(false);
              setActions(false);
              setLog("dismissAll");
            }}
          >
            清空栈
          </Button>
        </Space>
        <Text style={styles.result}>日志：{log}</Text>
      </DemoBlock>

      <BottomSheet
        visible={sheetA}
        onClose={() => {
          setSheetA(false);
          setSheetB(false);
          setActions(false);
        }}
        title="Sheet A"
        showCloseButton
        heightRatio={0.55}
      >
        <Text style={styles.body}>
          第一层 BottomSheet。可再开 B / ActionSheet / Toast / Dialog。
        </Text>
        <View style={styles.actionsCol}>
          <Button size="small" onPress={() => setSheetB(true)}>
            再开 Sheet B
          </Button>
          <Button
            size="small"
            variant="secondary"
            onPress={() => setActions(true)}
          >
            再开 ActionSheet
          </Button>
          <Button
            size="small"
            fill="outline"
            onPress={() => Toast.show("盖在 Sheet A 上的 Toast")}
          >
            Toast.show
          </Button>
          <Button
            size="small"
            fill="outline"
            onPress={() => {
              void Dialog.alert({
                title: "Sheet 内 Dialog",
                content: "应叠在 A 之上；关闭后 A 仍在。",
              });
            }}
          >
            Dialog.alert
          </Button>
        </View>
      </BottomSheet>

      <BottomSheet
        visible={sheetB}
        onClose={() => setSheetB(false)}
        title="Sheet B"
        showCloseButton
        heightRatio={0.4}
      >
        <Text style={styles.body}>
          第二层 Sheet。关蒙层 / 返回应先关 B，A 保留。
        </Text>
        <Button
          size="small"
          onPress={() => Toast.success("Toast 在 B 之上")}
        >
          Toast.success
        </Button>
      </BottomSheet>

      <ActionSheet
        visible={actions}
        onClose={() => setActions(false)}
        title="叠在 A 上的操作"
        options={[
          {
            label: "成功 Toast",
            onPress: () => {
              setActions(false);
              Toast.success("来自 ActionSheet");
            },
          },
          {
            label: "打开 Sheet B",
            onPress: () => {
              setActions(false);
              setSheetB(true);
            },
          },
          {
            label: "取消",
            onPress: () => setActions(false),
          },
        ]}
      />
    </ScrollView>
  );
}

const meta = {
  title: "UI/Overlays 浮层/OverlayStack",
  component: OverlayStackGallery,
} satisfies Meta<typeof OverlayStackGallery>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "嵌套叠层",
  render: () => <OverlayStackGallery />,
};

const styles = StyleSheet.create({
  page: {
    padding: 16,
    paddingBottom: 48,
  },
  block: {
    marginBottom: 16,
    gap: 10,
  },
  blockTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  hint: {
    fontSize: 13,
    lineHeight: 20,
    color: "#888",
  },
  body: {
    fontSize: 14,
    lineHeight: 22,
    color: "#333",
    marginBottom: 12,
  },
  actionsCol: {
    gap: 8,
  },
  result: {
    marginTop: 8,
    fontSize: 13,
    color: "#999",
  },
});
