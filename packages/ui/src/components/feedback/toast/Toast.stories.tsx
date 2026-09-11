import type { Meta, StoryObj } from "@storybook/react-native";
import { useState, type ReactNode } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  type LayoutChangeEvent,
} from "react-native";

import { Button } from "../../controls/button";
import { Space } from "../../foundation/space";
import { ToastProvider, useToast } from "./Toast";

const PAGE_PAD = 16;
const GAP = 8;
const COLS = 3;

function DemoBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.block}>
      <Text style={styles.blockTitle}>{title}</Text>
      {children}
    </View>
  );
}

function ToastDemo() {
  const { show, loading, success, fail, hide } = useToast();
  // Measure real content width (Storybook decorator padding ≠ window width).
  const [rowWidth, setRowWidth] = useState(0);
  const slotWidth =
    rowWidth > 0
      ? Math.floor((rowWidth - GAP * (COLS - 1)) / COLS)
      : 0;

  const onRowLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w > 0 && Math.abs(w - rowWidth) > 0.5) setRowWidth(w);
  };

  const Btn = ({ children }: { children: ReactNode }) => (
    <View style={slotWidth > 0 ? { width: slotWidth } : styles.btnFallback}>
      {children}
    </View>
  );

  return (
    <ScrollView
      contentContainerStyle={styles.page}
      keyboardShouldPersistTaps="handled"
    >
      <View onLayout={onRowLayout} style={styles.measure}>
        <DemoBlock title="基础用法">
          <Space wrap block gap={GAP}>
            <Btn>
              <Button
                
                size="small"
                block
                onPress={() => show("提示内容")}
              >文字提示</Button>
            </Btn>
            <Btn>
              <Button
                
                size="small"
                block
                variant="secondary"
                onPress={() => show("Hello World, This is a long text")}
              >长文字</Button>
            </Btn>
            <Btn>
              <Button
                
                size="small"
                block
                fill="outline"
                onPress={() =>
                  show({ message: "居中提示", position: "center" })
                }
              >居中提示</Button>
            </Btn>
          </Space>
        </DemoBlock>

        <DemoBlock title="加载提示">
          <Space wrap block gap={GAP}>
            <Btn>
              <Button
                
                size="small"
                block
                onPress={() => loading("加载中...")}
              >加载中</Button>
            </Btn>
            <Btn>
              <Button
                
                size="small"
                block
                variant="secondary"
                onPress={() => loading("加载中...", 5000)}
              >5 秒</Button>
            </Btn>
            <Btn>
              <Button
                
                size="small"
                block
                onPress={() =>
                  loading({
                    message: "请耐心等待...",
                    durationMs: 0,
                    maskClickable: true,
                  })
                }
              >手动打开</Button>
            </Btn>
            <Btn>
              <Button size="small"
                block
                variant="secondary"
                onPress={hide}>手动关闭</Button>
            </Btn>
          </Space>
        </DemoBlock>

        <DemoBlock title="图标功能">
          <Space wrap block gap={GAP}>
            <Btn>
              <Button
                
                size="small"
                block
                onPress={() => success("保存成功")}
              >成功</Button>
            </Btn>
            <Btn>
              <Button
                
                size="small"
                block
                variant="destructive"
                onPress={() => fail("名称已存在")}
              >失败</Button>
            </Btn>
            <Btn>
              <Button
                
                size="small"
                block
                variant="secondary"
                onPress={() =>
                  show({ message: "加载中…", icon: "loading" })
                }
              >加载</Button>
            </Btn>
            <Btn>
              <Button
                
                size="small"
                block
                fill="outline"
                onPress={() =>
                  show({
                    message: "上传中",
                    icon: <Text style={styles.customIcon}>↑</Text>,
                  })
                }
              >自定义</Button>
            </Btn>
          </Space>
        </DemoBlock>

        <DemoBlock title="自定义位置">
          <Space wrap block gap={GAP}>
            <Btn>
              <Button
                
                size="small"
                block
                variant="secondary"
                onPress={() =>
                  show({ message: "顶部提示", position: "top" })
                }
              >顶部</Button>
            </Btn>
            <Btn>
              <Button
                
                size="small"
                block
                onPress={() =>
                  show({ message: "居中提示", position: "center" })
                }
              >居中</Button>
            </Btn>
            <Btn>
              <Button
                
                size="small"
                block
                variant="secondary"
                onPress={() =>
                  show({ message: "底部提示", position: "bottom" })
                }
              >底部</Button>
            </Btn>
          </Space>
        </DemoBlock>

        <DemoBlock title="背景可点击">
          <Space wrap block gap={GAP}>
            <Btn>
              <Button
                
                size="small"
                block
                onPress={() =>
                  loading({
                    message: "背景可点穿",
                    durationMs: 0,
                    maskClickable: true,
                  })
                }
              >允许点击</Button>
            </Btn>
            <Btn>
              <Button
                
                size="small"
                block
                variant="secondary"
                onPress={() =>
                  loading({
                    message: "请耐心等待，不要退出",
                    maskClickable: false,
                  })
                }
              >禁止点击</Button>
            </Btn>
            <Btn>
              <Button size="small"
                block
                fill="outline"
                onPress={hide}>关闭</Button>
            </Btn>
          </Space>
        </DemoBlock>
      </View>
    </ScrollView>
  );
}

const meta = {
  title: "UI/Feedback 反馈/Toast",
  component: ToastProvider,
} satisfies Meta<typeof ToastProvider>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: null,
  },
  render: () => (
    <ToastProvider>
      <ToastDemo />
    </ToastProvider>
  ),
};

const styles = StyleSheet.create({
  page: {
    padding: PAGE_PAD,
    paddingBottom: 40,
  },
  measure: {
    alignSelf: "stretch",
  },
  block: {
    marginBottom: 16,
  },
  blockTitle: {
    fontSize: 14,
    color: "#999",
    marginBottom: 10,
  },
  btnFallback: {
    flexBasis: "30%",
    flexGrow: 1,
    maxWidth: "33.33%",
  },
  customIcon: {
    fontSize: 28,
    color: "#ffffff",
    lineHeight: 32,
  },
});
