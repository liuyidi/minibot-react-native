import type { LucideIcon, LucideProps } from "lucide-react-native";

export type AppIconProps = LucideProps & {
  icon: LucideIcon;
};

/** Unified Lucide icon wrapper (aligns with minibot webui lucide-react). */
export function AppIcon({
  icon: Icon,
  size = 24,
  color,
  strokeWidth = 2,
  ...rest
}: AppIconProps) {
  return <Icon size={size} color={color} strokeWidth={strokeWidth} {...rest} />;
}
