import type { LucideIcon } from "lucide-react-native";
import { Globe, Laptop, Smartphone } from "lucide-react-native";

import type { SecurityDeviceKind } from "@/lib/auth/security";

export const DEVICE_ARTWORK = {
  phone: Smartphone,
  laptop: Laptop,
  browser: Globe,
} as const satisfies Record<"phone" | "laptop" | "browser", LucideIcon>;

export type DeviceArtworkInput = {
  name: string;
  system: string;
  kind: SecurityDeviceKind;
};

export function resolveDeviceArtwork(input: DeviceArtworkInput): LucideIcon {
  const lower = `${input.name} ${input.system}`.toLowerCase();

  if (/iphone|ipad|android|pixel/.test(lower)) {
    return DEVICE_ARTWORK.phone;
  }
  if (/macbook|imac|windows|desktop|electron|电脑|客户端/.test(lower)) {
    return DEVICE_ARTWORK.laptop;
  }
  if (/chrome|safari|firefox|edge|browser|浏览器/.test(lower)) {
    return DEVICE_ARTWORK.browser;
  }
  if (input.kind === "mobile") {
    return DEVICE_ARTWORK.phone;
  }
  if (input.kind === "desktop") {
    return DEVICE_ARTWORK.laptop;
  }
  return DEVICE_ARTWORK.browser;
}
