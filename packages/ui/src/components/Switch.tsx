import {
  Switch as RNSwitch,
  type SwitchProps as RNSwitchProps,
} from "react-native";

import { useResolvedTheme } from "../theme/ThemeProvider";
import type { UiTheme } from "../theme/types";

export type SwitchProps = RNSwitchProps & {
  theme?: Partial<UiTheme>;
};

export function Switch({ theme: themeOverride, ...rest }: SwitchProps) {
  const palette = useResolvedTheme(themeOverride);

  return (
    <RNSwitch
      trackColor={{ false: palette.border, true: palette.primary }}
      thumbColor={palette.card}
      ios_backgroundColor={palette.border}
      {...rest}
    />
  );
}
