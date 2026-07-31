/**
 * @deprecated Prefer AppIcon + lucide-react-native.
 * Thin stub kept so accidental imports fail loudly toward AppIcon.
 */
export type IconSymbolName = string;

export function IconSymbol(_props: {
  name: IconSymbolName;
  size?: number;
  color?: string;
  style?: unknown;
}): null {
  if (__DEV__) {
    console.warn("IconSymbol is deprecated; use AppIcon from @/components/ui/AppIcon");
  }
  return null;
}
