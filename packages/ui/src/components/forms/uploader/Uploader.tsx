import type { ReactNode } from "react";
import {
  Pressable,
  Text,
  View,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { Plus, X } from "lucide-react-native";

import { Icon } from "../../foundation/icon";
import { Image } from "../../foundation/image";
import { useResolvedTheme } from "../../../theme/ThemeProvider";
import type { UiTheme } from "../../../theme/types";

export type UploaderFile = {
  id: string;
  /** Remote or local uri for preview. */
  uri?: string;
  /** Upload progress 0–1; omit when idle/done. */
  progress?: number;
  status?: "uploading" | "done" | "error";
  name?: string;
};

export type UploaderProps = {
  files: UploaderFile[];
  /** Max count. @default 9 */
  maxCount?: number;
  /**
   * Called when user taps the add tile.
   * App should open image picker / camera and append via controlled `files`.
   */
  onAdd?: () => void;
  onRemove?: (id: string) => void;
  onPressFile?: (file: UploaderFile, index: number) => void;
  /** Tile size. @default 80 */
  size?: number;
  addLabel?: string;
  theme?: Partial<UiTheme>;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
};

/**
 * Controlled multi-image uploader grid.
 * Does not depend on expo-image-picker — wire `onAdd` in the app.
 */
export function Uploader({
  files,
  maxCount = 9,
  onAdd,
  onRemove,
  onPressFile,
  size = 80,
  addLabel = "添加",
  theme: themeOverride,
  style,
}: UploaderProps) {
  const palette = useResolvedTheme(themeOverride);
  const canAdd = files.length < maxCount && onAdd != null;

  return (
    <View style={[styles.wrap, style]}>
      {files.map((file, index) => (
        <Pressable
          key={file.id}
          onPress={() => onPressFile?.(file, index)}
          style={[
            styles.tile,
            {
              width: size,
              height: size,
              borderColor: palette.border,
              backgroundColor: palette.surface,
            },
          ]}
        >
          {file.uri ? (
            <Image
              source={{ uri: file.uri }}
              width={size}
              height={size}
              radius={8}
            />
          ) : (
            <Text style={{ color: palette.muted, fontSize: 12 }} numberOfLines={2}>
              {file.name ?? "文件"}
            </Text>
          )}
          {file.status === "uploading" && file.progress != null ? (
            <View style={styles.progressMask}>
              <Text style={styles.progressText}>
                {Math.round(file.progress * 100)}%
              </Text>
            </View>
          ) : null}
          {file.status === "error" ? (
            <View style={[styles.progressMask, { backgroundColor: "rgba(180,0,0,0.55)" }]}>
              <Text style={styles.progressText}>失败</Text>
            </View>
          ) : null}
          {onRemove ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Remove"
              hitSlop={6}
              onPress={() => onRemove(file.id)}
              style={[styles.remove, { backgroundColor: "rgba(0,0,0,0.55)" }]}
            >
              <Icon icon={X} size={12} color="#ffffff" />
            </Pressable>
          ) : null}
        </Pressable>
      ))}
      {canAdd ? (
        <Pressable
          accessibilityRole="button"
          onPress={onAdd}
          style={[
            styles.tile,
            styles.add,
            {
              width: size,
              height: size,
              borderColor: palette.border,
              backgroundColor: palette.surface,
            },
          ]}
        >
          <Icon icon={Plus} size={22} color="muted" />
          <Text style={[styles.addLabel, { color: palette.muted }]}>
            {addLabel}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  tile: {
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  add: {
    gap: 4,
  },
  addLabel: {
    fontSize: 12,
  },
  remove: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  progressMask: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },
  progressText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
});
