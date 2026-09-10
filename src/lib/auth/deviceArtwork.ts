import type { ImageSourcePropType } from "react-native";

import type { SecurityDeviceKind } from "@/lib/auth/security";

export const DEVICE_ARTWORK = {
  phone: require("../../../assets/devices/phone.png") as ImageSourcePropType,
  laptop: require("../../../assets/devices/laptop.png") as ImageSourcePropType,
  browser: require("../../../assets/devices/browser.png") as ImageSourcePropType,
} as const;

export type DeviceArtworkInput = {
  name: string;
  system: string;
  kind: SecurityDeviceKind;
};

export function resolveDeviceArtwork(input: DeviceArtworkInput): ImageSourcePropType {
  const lower = `${input.name} ${input.system}`.toLowerCase();

  if (/iphone|ipad|android|pixel/.test(lower)) {
    return DEVICE_ARTWORK.phone;
  }
  if (/macbook|imac|windows|desktop|electron/.test(lower)) {
    return DEVICE_ARTWORK.laptop;
  }
  if (input.kind === "mobile") {
    return DEVICE_ARTWORK.phone;
  }
  if (input.kind === "desktop") {
    return DEVICE_ARTWORK.laptop;
  }
  return DEVICE_ARTWORK.browser;
}
