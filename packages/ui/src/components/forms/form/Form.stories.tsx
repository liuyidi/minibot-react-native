import type { Meta, StoryObj } from "@storybook/react-native";
import { useState, type ReactNode } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { Button } from "../../controls/button";
import { Switch } from "../../controls/switch";
import { TextField } from "../text-field";
import { Form, useForm } from "./Form";

function DemoBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.block}>
      <Text style={styles.blockTitle}>{title}</Text>
      {children}
    </View>
  );
}

function FormGallery() {
  const [basic] = useForm();
  const [rulesForm] = useForm();
  const [asyncForm] = useForm();
  const [methodsForm] = useForm();
  const [switchForm] = useForm();
  const [last, setLast] = useState("—");

  return (
    <ScrollView
      contentContainerStyle={styles.page}
      keyboardShouldPersistTaps="handled"
    >
      <DemoBlock title="基础用法">
        <Form
          form={basic}
          initialValues={{ name: "", email: "" }}
          onFinish={(values) => setLast(`onFinish: ${JSON.stringify(values)}`)}
          footer={
            <Button block onPress={() => basic.submit()}>
              提交
            </Button>
          }
        >
          <Form.Header>账号</Form.Header>
          <Form.Item name="name" label="姓名" rules={[{ required: true, message: "请输入姓名" }]}>
            <TextField placeholder="请输入姓名" />
          </Form.Item>
          <Form.Item name="email" label="邮箱">
            <TextField placeholder="name@example.com" keyboardType="email-address" />
          </Form.Item>
        </Form>
      </DemoBlock>

      <DemoBlock title="校验规则">
        <Form
          form={rulesForm}
          onFinish={(values) => setLast(`rules ok: ${JSON.stringify(values)}`)}
          onFinishFailed={() => setLast("rules: 校验失败")}
          footer={
            <Button block onPress={() => rulesForm.submit()}>
              校验并提交
            </Button>
          }
        >
          <Form.Item
            name="phone"
            label="手机号"
            rules={[
              { required: true, message: "请输入手机号" },
              { pattern: /^1\d{10}$/, message: "手机号格式不正确" },
            ]}
          >
            <TextField placeholder="11 位手机号" keyboardType="phone-pad" />
          </Form.Item>
          <Form.Item
            name="password"
            label="密码"
            rules={[
              { required: true, message: "请输入密码" },
              { min: 6, message: "至少 6 位" },
            ]}
          >
            <TextField placeholder="至少 6 位" secureTextEntry />
          </Form.Item>
        </Form>
      </DemoBlock>

      <DemoBlock title="自定义 validator">
        <Form
          form={asyncForm}
          onFinish={() => setLast("async validator: ok")}
          footer={
            <Button block onPress={() => asyncForm.submit()}>
              提交
            </Button>
          }
        >
          <Form.Item
            name="code"
            label="邀请码"
            rules={[
              { required: true, message: "请输入邀请码" },
              {
                validator: async (_: unknown, value: unknown) => {
                  await new Promise((r) => setTimeout(r, 400));
                  if (value !== "minibot") {
                    return Promise.reject(new Error("邀请码错误（试试 minibot）"));
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <TextField placeholder="输入 minibot" autoCapitalize="none" />
          </Form.Item>
        </Form>
      </DemoBlock>

      <DemoBlock title="表单方法">
        <Form form={methodsForm} initialValues={{ nickname: "游客" }}>
          <Form.Item name="nickname" label="昵称" rules={[{ required: true }]}>
            <TextField placeholder="昵称" />
          </Form.Item>
        </Form>
        <View style={styles.row}>
          <Button
            onPress={() => {
              methodsForm.setFieldsValue({ nickname: "minibot" });
              setLast("setFieldsValue");
            }}
          >
            赋值
          </Button>
          <Button
            onPress={() => {
              methodsForm.resetFields();
              setLast("resetFields");
            }}
          >
            重置
          </Button>
          <Button
            onPress={async () => {
              try {
                const v = await methodsForm.validateFields();
                setLast(`validate: ${JSON.stringify(v)}`);
              } catch {
                setLast("validate: failed");
              }
            }}
          >
            校验
          </Button>
        </View>
      </DemoBlock>

      <DemoBlock title="Switch">
        <Form
          form={switchForm}
          layout="horizontal"
          initialValues={{ notify: true }}
          onFinish={(values) => setLast(`switch: ${JSON.stringify(values)}`)}
          footer={
            <Button block onPress={() => switchForm.submit()}>
              提交
            </Button>
          }
        >
          <Form.Item
            name="notify"
            label="消息通知"
            valuePropName="checked"
            trigger="onChange"
            childElementPosition="right"
          >
            <Switch />
          </Form.Item>
        </Form>
      </DemoBlock>

      <DemoBlock title="事件日志">
        <Text style={styles.log}>{last}</Text>
      </DemoBlock>
    </ScrollView>
  );
}

const meta = {
  title: "UI/Forms 表单/Form",
  component: Form,
} satisfies Meta<typeof Form>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <FormGallery />,
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
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  log: {
    fontSize: 13,
    color: "#333",
  },
});
