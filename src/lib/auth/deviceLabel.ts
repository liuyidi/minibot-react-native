import * as Device from "expo-device";
import { Platform } from "react-native";

function isGenericModelName(name: string): boolean {
  const lower = name.trim().toLowerCase();
  return (
    lower === "iphone" ||
    lower === "ipad" ||
    lower === "ipod" ||
    lower === "android" ||
    lower === "sdk" ||
    lower.startsWith("sdk_")
  );
}

/**
 * Human-readable device title for mini-auth `X-Device-Label`
 * (e.g. "iPhone 14 Pro", "Yidi's iPhone", "Pixel 7").
 */
export function resolveLocalDeviceLabel(): string {
  const model = (Device.modelName || "").trim();
  const deviceName = (Device.deviceName || "").trim();

  if (model && !isGenericModelName(model)) {
    return model.slice(0, 255);
  }
  if (deviceName) {
    return deviceName.slice(0, 255);
  }
  if (model) {
    return model.slice(0, 255);
  }

  const brand = (Device.brand || "").trim();
  if (brand) {
    return brand.slice(0, 255);
  }

  if (Platform.OS === "ios") {
    return Device.deviceType === Device.DeviceType.TABLET ? "iPad" : "iPhone";
  }
  if (Platform.OS === "android") {
    return "Android";
  }
  return "Minibot App";
}

export function authDeviceHeaders(): Record<string, string> {
  return {
    "X-Device-Label": resolveLocalDeviceLabel(),
  };
}
