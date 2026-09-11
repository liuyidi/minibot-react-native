import {
  ActivityIndicator,
  type ActivityIndicatorProps,
} from "react-native";

import { useResolvedTheme } from "../../../theme/ThemeProvider";
import type { UiTheme } from "../../../theme/types";

export type SpinnerProps = ActivityIndicatorProps & {
  theme?: Partial<UiTheme>;
};

export function Spinner({ theme: themeOverride, color, ...rest }: SpinnerProps) {
  const palette = useResolvedTheme(themeOverride);

  return <ActivityIndicator color={color ?? palette.primary} {...rest} />;
}
