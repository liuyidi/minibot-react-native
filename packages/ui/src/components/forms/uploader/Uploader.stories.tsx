import type { Meta, StoryObj } from "@storybook/react-native";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { ImagePreview } from "../../overlays/image-preview";
import { Uploader, type UploaderFile } from "./Uploader";

function Demo() {
  const [files, setFiles] = useState<UploaderFile[]>([
    {
      id: "1",
      uri: "https://picsum.photos/seed/up1/200",
      status: "done",
    },
  ]);

  return (
    <View style={styles.page}>
      <Uploader
        files={files}
        maxCount={6}
        onAdd={() => {
          const id = String(Date.now());
          setFiles((prev) => [
            ...prev,
            {
              id,
              uri: `https://picsum.photos/seed/${id}/200`,
              status: "uploading",
              progress: 0.4,
            },
          ]);
          setTimeout(() => {
            setFiles((prev) =>
              prev.map((f) =>
                f.id === id ? { ...f, status: "done", progress: undefined } : f,
              ),
            );
          }, 800);
        }}
        onRemove={(id) => setFiles((prev) => prev.filter((f) => f.id !== id))}
        onPressFile={(file, index) => {
          ImagePreview.open({
            images: files
              .filter((f) => f.uri)
              .map((f) => ({ uri: f.uri! })),
            index,
          });
        }}
      />
    </View>
  );
}

const meta = {
  title: "UI/Forms 表单/Uploader",
  component: Uploader,
} satisfies Meta<typeof Uploader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { files: [] },
  render: () => <Demo />,
};

const styles = StyleSheet.create({
  page: { padding: 16 },
});
