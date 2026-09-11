import type { Meta, StoryObj } from "@storybook/react-native";
import { useState, type ComponentProps, type ReactNode } from "react";
import { Modal, StyleSheet, Text, View } from "react-native";

import { Button } from "../../controls/button";
import { Space } from "../../foundation/space";
import { Backdrop } from "./Backdrop";

function DemoBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.block}>
      <Text style={styles.blockTitle}>{title}</Text>
      {children}
    </View>
  );
}

/** Full-screen host — mirrors Mask portal-to-body. */
function MaskHost({
  visible,
  onClose,
  children,
  ...backdropProps
}: {
  visible: boolean;
  onClose: () => void;
  children?: ReactNode;
  opacity?: ComponentProps<typeof Backdrop>["opacity"];
  color?: ComponentProps<typeof Backdrop>["color"];
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalRoot}>
        <Backdrop visible onPress={onClose} {...backdropProps}>
          {children}
        </Backdrop>
      </View>
    </Modal>
  );
}

function BackdropGallery() {
  const [basic, setBasic] = useState(false);
  const [thin, setThin] = useState(false);
  const [thick, setThick] = useState(false);
  const [customOpacity, setCustomOpacity] = useState(false);
  const [white, setWhite] = useState(false);
  const [customColor, setCustomColor] = useState(false);
  const [withContent, setWithContent] = useState(false);

  return (
    <View style={styles.page}>
      <DemoBlock title="基础用法">
        <Button onPress={() => setBasic(true)}>显示背景蒙层</Button>
        <MaskHost visible={basic} onClose={() => setBasic(false)} />
      </DemoBlock>

      <DemoBlock title="背景蒙层的颜色深度">
        <Space wrap>
          <Button onPress={() => setThin(true)}>显示浅一些的背景蒙层</Button>
          <Button onPress={() => setThick(true)}>显示深一些的背景蒙层</Button>
          <Button onPress={() => setCustomOpacity(true)}>
            显示自定义透明度的背景蒙层
          </Button>
        </Space>
        <MaskHost
          visible={thin}
          onClose={() => setThin(false)}
          opacity="thin"
        />
        <MaskHost
          visible={thick}
          onClose={() => setThick(false)}
          opacity="thick"
        />
        <MaskHost
          visible={customOpacity}
          onClose={() => setCustomOpacity(false)}
          opacity={1}
        />
      </DemoBlock>

      <DemoBlock title="背景蒙层的颜色">
        <Space wrap>
          <Button onPress={() => setWhite(true)}>显示白色的背景蒙层</Button>
          <Button onPress={() => setCustomColor(true)}>
            显示自定义颜色的背景蒙层
          </Button>
        </Space>
        <MaskHost
          visible={white}
          onClose={() => setWhite(false)}
          color="white"
        />
        <MaskHost
          visible={customColor}
          onClose={() => setCustomColor(false)}
          color="rgba(219, 10, 10, 0.5)"
        />
      </DemoBlock>

      <DemoBlock title="自定义内容">
        <Button onPress={() => setWithContent(true)}>
          显示带内容的背景蒙层
        </Button>
        <MaskHost visible={withContent} onClose={() => setWithContent(false)}>
          <View style={styles.overlayContent}>
            <Text style={styles.overlayText}>内容</Text>
          </View>
        </MaskHost>
      </DemoBlock>
    </View>
  );
}

const meta = {
  title: "UI/Overlays 浮层/Backdrop",
  component: Backdrop,
} satisfies Meta<typeof Backdrop>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    visible: true,
    onPress: () => {},
  },
  render: () => <BackdropGallery />,
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
  modalRoot: {
    flex: 1,
  },
  overlayContent: {
    width: 120,
    height: 120,
    borderRadius: 8,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  overlayText: {
    fontSize: 16,
    color: "#333",
  },
});
