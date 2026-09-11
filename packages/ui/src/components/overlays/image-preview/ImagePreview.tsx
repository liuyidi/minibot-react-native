import { useEffect, useState } from "react";
import {
  Dimensions,
  Image as RNImage,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ImageSourcePropType,
} from "react-native";

import { OverlayStack } from "../../../overlay";
import { useResolvedTheme } from "../../../theme/ThemeProvider";
import type { UiTheme } from "../../../theme/types";
import { withStatics } from "../../../utils/withStatics";

export type ImagePreviewItem = {
  uri?: string;
  source?: ImageSourcePropType;
};

export type ImagePreviewOpenOptions = {
  images: ImagePreviewItem[];
  index?: number;
  onClose?: () => void;
  onIndexChange?: (index: number) => void;
  theme?: Partial<UiTheme>;
};

function resolveSource(item: ImagePreviewItem): ImageSourcePropType | null {
  if (item.source) return item.source;
  if (item.uri) return { uri: item.uri };
  return null;
}

function PreviewBody({
  images,
  initialIndex,
  onClose,
  onIndexChange,
}: {
  images: ImagePreviewItem[];
  initialIndex: number;
  onClose: () => void;
  onIndexChange?: (index: number) => void;
}) {
  useResolvedTheme();
  const [index, setIndex] = useState(
    Math.min(Math.max(0, initialIndex), Math.max(0, images.length - 1)),
  );
  const { width, height } = Dimensions.get("window");
  const item = images[index];
  const source = item ? resolveSource(item) : null;

  const go = (delta: number) => {
    const next = Math.min(images.length - 1, Math.max(0, index + delta));
    setIndex(next);
    onIndexChange?.(next);
  };

  return (
    <View style={styles.root} pointerEvents="auto">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Close"
        onPress={onClose}
        style={styles.close}
        hitSlop={12}
      >
        <Text style={styles.closeText}>✕</Text>
      </Pressable>
      <Text style={styles.counter}>
        {images.length ? `${index + 1} / ${images.length}` : "0 / 0"}
      </Text>
      <View style={[styles.stage, { width }]}>
        {source ? (
          <RNImage
            source={source}
            style={{ width, height: height * 0.7 }}
            resizeMode="contain"
          />
        ) : (
          <Text style={styles.missing}>无图片</Text>
        )}
      </View>
      {images.length > 1 ? (
        <View style={styles.nav}>
          <Pressable
            disabled={index <= 0}
            onPress={() => go(-1)}
            style={[styles.navBtn, index <= 0 && styles.navDisabled]}
          >
            <Text style={styles.navText}>上一张</Text>
          </Pressable>
          <Pressable
            disabled={index >= images.length - 1}
            onPress={() => go(1)}
            style={[
              styles.navBtn,
              index >= images.length - 1 && styles.navDisabled,
            ]}
          >
            <Text style={styles.navText}>下一张</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

const PREVIEW_ID = "minibot_ui_image_preview";

function openPreview(options: ImagePreviewOpenOptions) {
  const { images, index = 0, onClose, onIndexChange } = options;
  const close = () => {
    OverlayStack.dismiss(PREVIEW_ID);
    onClose?.();
  };
  OverlayStack.show(
    <PreviewBody
      images={images}
      initialIndex={index}
      onClose={close}
      onIndexChange={onIndexChange}
    />,
    {
      id: PREVIEW_ID,
      type: "System",
      hasMask: true,
      maskColor: "rgba(0,0,0,0.92)",
      closeOnMask: true,
      dismissOnBack: true,
      pointerEvents: "auto",
      onDismiss: onClose,
    },
  );
}

export type ImagePreviewProps = {
  visible: boolean;
  images: ImagePreviewItem[];
  index?: number;
  onClose?: () => void;
  onIndexChange?: (index: number) => void;
};

/** Declarative wrapper around `ImagePreview.open`. */
function ImagePreviewRoot({
  visible,
  images,
  index = 0,
  onClose,
  onIndexChange,
}: ImagePreviewProps) {
  useEffect(() => {
    if (!visible) {
      OverlayStack.dismiss(PREVIEW_ID);
      return;
    }
    openPreview({ images, index, onClose, onIndexChange });
    return () => {
      OverlayStack.dismiss(PREVIEW_ID);
    };
  }, [visible]); // eslint-disable-line react-hooks/exhaustive-deps -- open once per visible

  return null;
}

export const ImagePreview = withStatics(ImagePreviewRoot, {
  open: openPreview,
  close: () => OverlayStack.dismiss(PREVIEW_ID),
});

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",
  },
  close: {
    position: "absolute",
    top: 56,
    right: 20,
    zIndex: 2,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  closeText: {
    color: "#fff",
    fontSize: 18,
  },
  counter: {
    position: "absolute",
    top: 64,
    alignSelf: "center",
    color: "#fff",
    fontSize: 14,
    zIndex: 2,
  },
  stage: {
    alignItems: "center",
    justifyContent: "center",
  },
  missing: {
    color: "#999",
  },
  nav: {
    position: "absolute",
    bottom: 48,
    flexDirection: "row",
    gap: 24,
  },
  navBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  navDisabled: {
    opacity: 0.35,
  },
  navText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
