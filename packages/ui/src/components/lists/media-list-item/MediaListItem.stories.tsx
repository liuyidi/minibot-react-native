import type { Meta, StoryObj } from "@storybook/react-native";
import { Text, View } from "react-native";

import { Button } from "../../controls/button";
import { Price } from "../../foundation/price";
import { Tag } from "../../foundation/tag";
import { MediaListItem } from "./MediaListItem";

const meta = {
  title: "UI/Lists 列表/MediaListItem",
  component: MediaListItem,
} satisfies Meta<typeof MediaListItem>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "新人100元券包",
  },
  render: () => (
    <View style={{ gap: 12, padding: 8 }}>
      <MediaListItem
        prefix={
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 8,
              backgroundColor: "#3B82F6",
              padding: 6,
              justifyContent: "space-between",
            }}
          >
            <Tag label="配送" fill="solid" variant="primary" />
            <Text style={{ color: "#fff", fontSize: 11 }}>📦</Text>
          </View>
        }
        title="新人100元券包"
        description={
          <View style={{ gap: 2 }}>
            <Text style={{ fontSize: 12, color: "#999" }}>
              10元优惠券-新客专享*1
            </Text>
            <Text style={{ fontSize: 12, color: "#999" }}>5元优惠券*3</Text>
          </View>
        }
        extra={
          <View style={{ alignItems: "flex-end", gap: 8 }}>
            <Price value={0.9} original={100} />
            <Button size="mini" onPress={() => {}}>
              购买
            </Button>
          </View>
        }
      />
    </View>
  ),
};
