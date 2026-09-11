import type { Meta, StoryObj } from "@storybook/react-native";
import { useState, type ReactNode } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { Button } from "../../controls/button";
import { TextField } from "../../forms/text-field";
import { Space } from "../../foundation/space";
import {
  Alert,
  Confirm,
  Dialog,
  DialogProvider,
  useDialog,
} from "./index";

function DemoBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.block}>
      <Text style={styles.blockTitle}>{title}</Text>
      {children}
    </View>
  );
}

function DialogGallery() {
  const { alert, confirm } = useDialog();
  const [alertOpen, setAlertOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [basicOpen, setBasicOpen] = useState(false);
  const [promptOpen, setPromptOpen] = useState(false);
  const [code, setCode] = useState("");
  const [lastResult, setLastResult] = useState<string>("—");

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <DemoBlock title="基础用法">
        <Button
          
          size="small"
          onPress={() => setBasicOpen(true)}
        >打开 Dialog</Button>
        <Dialog
          visible={basicOpen}
          onClose={() => setBasicOpen(false)}
          title="提示"
          primaryAction={{
            label: "确认",
            onPress: () => setBasicOpen(false),
          }}
          secondaryAction={{
            label: "取消",
            onPress: () => setBasicOpen(false),
          }}
        >
          <Text style={styles.bodyText}>自定义内容的对话框。</Text>
        </Dialog>
      </DemoBlock>

      <DemoBlock title="Prompt（关闭钮 + 输入）">
        <Button
          
          size="small"
          onPress={() => setPromptOpen(true)}
        >兑换码</Button>
        <Dialog
          visible={promptOpen}
          onClose={() => setPromptOpen(false)}
          title="兑换码"
          showCloseButton
          primaryAction={{
            label: "立即兑换",
            onPress: () => {
              setLastResult(code ? `兑换: ${code}` : "兑换: 空");
              setPromptOpen(false);
            },
          }}
        >
          <TextField
            value={code}
            onChangeText={setCode}
            placeholder="请输入兑换码"
          />
        </Dialog>
      </DemoBlock>

      <DemoBlock title="Alert">
        <Button
          
          size="small"
          onPress={() => setAlertOpen(true)}
        >打开 Alert</Button>
        <Alert
          visible={alertOpen}
          onClose={() => setAlertOpen(false)}
          title="操作成功"
          content="你的更改已保存。"
        />
      </DemoBlock>

      <DemoBlock title="Confirm">
        <Button
          
          size="small"
          onPress={() => setConfirmOpen(true)}
        >打开 Confirm</Button>
        <Confirm
          visible={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          title="确认删除？"
          content="删除后无法恢复，是否继续？"
          confirmText="删除"
          onConfirm={() => setLastResult("declarative: 确认")}
          onCancel={() => setLastResult("declarative: 取消")}
        />
      </DemoBlock>

      <DemoBlock title="命令式">
        <Space wrap gap={8}>
          <Button
            
            size="small"
            onPress={async () => {
              await alert({
                title: "提示",
                content: "这是一条命令式 Alert。",
              });
              setLastResult("alert: 已关闭");
            }}
          >alert()</Button>
          <Button
            
            size="small"
            variant="secondary"
            onPress={async () => {
              const ok = await confirm({
                title: "提交订单",
                content: "确认提交当前订单吗？",
              });
              setLastResult(ok ? "confirm: true" : "confirm: false");
            }}
          >confirm()</Button>
        </Space>
        <Text style={styles.result}>结果：{lastResult}</Text>
      </DemoBlock>
    </ScrollView>
  );
}

const meta = {
  title: "UI/Overlays 浮层/Dialog",
  component: Dialog,
} satisfies Meta<typeof Dialog>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    visible: false,
    onClose: () => {},
  },
  render: () => (
    <DialogProvider>
      <DialogGallery />
    </DialogProvider>
  ),
};

const styles = StyleSheet.create({
  page: {
    padding: 16,
    paddingBottom: 40,
  },
  block: {
    marginBottom: 20,
    gap: 10,
  },
  blockTitle: {
    fontSize: 14,
    color: "#999",
  },
  bodyText: {
    fontSize: 15,
    color: "#666",
    lineHeight: 22,
  },
  result: {
    marginTop: 8,
    fontSize: 13,
    color: "#999",
  },
});
