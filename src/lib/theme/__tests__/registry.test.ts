import {
  DEFAULT_THEME_ID,
  isThemeId,
  resolveThemePalette,
} from "@/lib/theme/registry";

describe("theme registry", () => {
  test("default theme is brand", () => {
    expect(DEFAULT_THEME_ID).toBe("brand");
  });

  test("brand light uses white canvas and black primary", () => {
    const p = resolveThemePalette("brand", "light");
    expect(p.background).toBe("#ffffff");
    expect(p.primary).toBe("#080808");
    expect(p.onPrimary).toBe("#ffffff");
  });

  test("brand dark inverts canvas/ink", () => {
    const p = resolveThemePalette("brand", "dark");
    expect(p.background).toBe("#080808");
    expect(p.text).toBe("#f5f5f5");
  });

  test("isThemeId accepts brand", () => {
    expect(isThemeId("brand")).toBe(true);
  });
});
