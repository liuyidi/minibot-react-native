import type { ReactNode } from "react";
import {
  Image as RNImage,
  View,
  StyleSheet,
  type ImageProps as RNImageProps,
  type ImageSourcePropType,
  type StyleProp,
  type ViewStyle,
  type ImageStyle,
} from "react-native";

import { useResolvedTheme } from "../../../theme/ThemeProvider";
import type { UiTheme } from "../../../theme/types";

export type UiImageProps = Omit<RNImageProps, "source" | "style"> & {
  source: ImageSourcePropType;
  /** @default cover */
  contentFit?: "cover" | "contain" | "stretch" | "center";
  width?: number | string;
  height?: number | string;
  radius?: number;
  /** Show border using theme. @default false */
  bordered?: boolean;
  placeholder?: ReactNode;
  theme?: Partial<UiTheme>;
  style?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
};

const RESIZE = {
  cover: "cover",
  contain: "contain",
  stretch: "stretch",
  center: "center",
} as const;

/**
 * Themed image shell (radius / border). Uses RN Image.
 */
export function Image({
  source,
  contentFit = "cover",
  width,
  height,
  radius = 8,
  bordered = false,
  placeholder,
  theme: themeOverride,
  style,
  imageStyle,
  ...rest
}: UiImageProps) {
  const palette = useResolvedTheme(themeOverride);

  return (
    <View
      style={[
        {
          width: width as number | undefined,
          height: height as number | undefined,
          borderRadius: radius,
          overflow: "hidden",
          backgroundColor: palette.surface,
          borderWidth: bordered ? StyleSheet.hairlineWidth : 0,
          borderColor: palette.border,
        },
        style,
      ]}
    >
      {placeholder}
      <RNImage
        source={source}
        resizeMode={RESIZE[contentFit]}
        style={[styles.fill, imageStyle]}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    ...StyleSheet.absoluteFill,
  },
});
