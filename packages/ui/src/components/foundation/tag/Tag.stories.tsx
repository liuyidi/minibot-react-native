import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";

import { Space } from "../space";
import { Tag } from "./Tag";

const meta = {
  title: "UI/Foundation 基础/Tag",
  component: Tag,
} satisfies Meta<typeof Tag>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: "默认" },
  render: () => (
    <View style={{ gap: 16, padding: 8 }}>
      <Space wrap gap={8}>
        <Tag label="默认" />
        <Tag label="主要" variant="primary" />
        <Tag label="成功" variant="success" />
        <Tag label="警告" variant="warning" />
        <Tag label="危险" variant="danger" />
      </Space>
      <Space wrap gap={8}>
        <Tag label="明天过期" variant="danger" fill="soft" />
        <Tag label="品类" variant="primary" fill="solid" />
        <Tag label="描边" variant="danger" fill="outline" />
      </Space>
    </View>
  ),
};
