import Svg, { Path } from "react-native-svg";

import { useAppTheme } from "@/hooks/useAppTheme";

export function GoogleProviderIcon({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityElementsHidden>
      <Path
        fill="#4285f4"
        d="M22.6 12.2c0-.7-.1-1.3-.2-1.9H12v3.7h6c-.3 1.4-1 2.5-2.1 3.2v2.7h3.4c2-1.8 3.3-4.5 3.3-7.7Z"
      />
      <Path
        fill="#34a853"
        d="M12 23c3 0 5.5-1 7.3-3.1l-3.4-2.7c-1 .6-2.2 1-3.9 1-3 0-5.5-2-6.4-4.7H2.1v2.8C3.9 20.2 7.7 23 12 23Z"
      />
      <Path
        fill="#fbbc05"
        d="M5.6 13.5c-.2-.7-.4-1.4-.4-2.2s.1-1.5.4-2.2V6.3H2.1C1.4 7.8 1 9.5 1 11.3s.4 3.5 1.1 5l3.5-2.8Z"
      />
      <Path
        fill="#ea4335"
        d="M12 4.4c1.6 0 3.1.6 4.2 1.7l3.1-3.1C17.5 1.1 15 0 12 0 7.7 0 3.9 2.8 2.1 6.3l3.5 2.8C6.5 6.4 9 4.4 12 4.4Z"
      />
    </Svg>
  );
}

export function GitHubProviderIcon({ size = 20 }: { size?: number }) {
  const theme = useAppTheme();
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityElementsHidden>
      <Path
        fill={theme.text}
        d="M12 1.8a10.3 10.3 0 0 0-3.3 20c.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.2-3.4-1.2-.5-1.1-1.1-1.4-1.1-1.4-.9-.6.1-.6.1-.6 1 .1 1.6 1.1 1.6 1.1.9 1.6 2.4 1.1 2.9.8.1-.7.4-1.1.7-1.4-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.8-.1-.3-.5-1.3.1-2.8 0 0 .9-.3 2.8 1a9.7 9.7 0 0 1 5.1 0c2-1.3 2.8-1 2.8-1 .6 1.5.2 2.5.1 2.8.7.8 1 1.7 1 2.8 0 3.9-2.4 4.7-4.6 5 .4.3.8 1 .8 2v2.9c0 .3.2.6.8.5A10.3 10.3 0 0 0 12 1.8Z"
      />
    </Svg>
  );
}
