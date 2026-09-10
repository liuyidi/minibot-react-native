import {
  DEVICE_ARTWORK,
  resolveDeviceArtwork,
} from "@/lib/auth/deviceArtwork";

describe("resolveDeviceArtwork", () => {
  test("maps iPhone name to phone artwork", () => {
    expect(
      resolveDeviceArtwork({ name: "iPhone 14 Plus", system: "iOS", kind: "mobile" })
    ).toBe(DEVICE_ARTWORK.phone);
  });

  test("maps MacBook name to laptop artwork", () => {
    expect(
      resolveDeviceArtwork({ name: "MacBook Pro", system: "macOS", kind: "desktop" })
    ).toBe(DEVICE_ARTWORK.laptop);
  });

  test("maps unknown browser kind to browser artwork", () => {
    expect(
      resolveDeviceArtwork({ name: "Safari", system: "Web", kind: "browser" })
    ).toBe(DEVICE_ARTWORK.browser);
  });

  test("prefers name heuristics over kind", () => {
    expect(
      resolveDeviceArtwork({ name: "iPhone", system: "iOS", kind: "desktop" })
    ).toBe(DEVICE_ARTWORK.phone);
  });

  test("falls back to kind when name does not match", () => {
    expect(
      resolveDeviceArtwork({ name: "Unknown device", system: "", kind: "mobile" })
    ).toBe(DEVICE_ARTWORK.phone);
    expect(
      resolveDeviceArtwork({ name: "Unknown device", system: "", kind: "desktop" })
    ).toBe(DEVICE_ARTWORK.laptop);
  });
});
