import type { Meta, StoryObj } from "@storybook/react-native";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { Button } from "../../controls/button";
import { Image } from "../../foundation/image";
import { ImagePreview } from "./ImagePreview";

const SAMPLE = [
  {
    uri: "https://picsum.photos/seed/minibot1/800/600",
  },
  {
    uri: "https://picsum.photos/seed/minibot2/800/600",
  },
];

function Demo() {
  return (
    <View style={styles.page}>
      <View style={styles.row}>
        {SAMPLE.map((img, i) => (
          <Button
            key={img.uri}
            size="small"
            onPress={() => ImagePreview.open({ images: SAMPLE, index: i })}
          >
            预览 {i + 1}
          </Button>
        ))}
      </View>
      <Image
        source={{ uri: SAMPLE[0].uri }}
        width={160}
        height={100}
        onLoad={() => {}}
      />
    </View>
  );
}

const meta = {
  title: "UI/Overlays 浮层/ImagePreview",
  component: ImagePreview,
} satisfies Meta<typeof ImagePreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    visible: false,
    images: SAMPLE,
  },
  render: () => <Demo />,
};

const styles = StyleSheet.create({
  page: { padding: 16, gap: 16 },
  row: { flexDirection: "row", gap: 8 },
});
