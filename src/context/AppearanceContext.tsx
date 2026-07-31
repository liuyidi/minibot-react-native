import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useColorScheme as useSystemColorScheme } from "react-native";

import {
  getAppearanceMode,
  setAppearanceMode as persistAppearanceMode,
  type AppearanceMode,
} from "@/lib/settings/appearanceConfig";
import { getThemeId, setThemeId as persistThemeId } from "@/lib/theme/config";
import {
  DEFAULT_THEME_ID,
  getThemeDefinition,
  resolveThemePalette,
} from "@/lib/theme/registry";
import type { AppColorScheme, ThemeDefinition, ThemeId, ThemePalette } from "@/lib/theme/types";

type AppearanceContextValue = {
  mode: AppearanceMode;
  setMode: (mode: AppearanceMode) => Promise<void>;
  colorScheme: AppColorScheme;
  themeId: ThemeId;
  setThemeId: (id: ThemeId) => Promise<void>;
  themeDefinition: ThemeDefinition;
  palette: ThemePalette;
  isReady: boolean;
};

const AppearanceContext = createContext<AppearanceContextValue | null>(null);

export function AppearanceProvider({ children }: { children: ReactNode }) {
  const systemScheme = useSystemColorScheme();
  const [mode, setModeState] = useState<AppearanceMode>("system");
  const [themeId, setThemeIdState] = useState<ThemeId>(DEFAULT_THEME_ID);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    void (async () => {
      const [savedMode, savedTheme] = await Promise.all([
        getAppearanceMode(),
        getThemeId(),
      ]);
      setModeState(savedMode);
      setThemeIdState(savedTheme);
      setIsReady(true);
    })();
  }, []);

  const setMode = useCallback(async (nextMode: AppearanceMode) => {
    setModeState(nextMode);
    await persistAppearanceMode(nextMode);
  }, []);

  const setThemeId = useCallback(async (nextId: ThemeId) => {
    setThemeIdState(nextId);
    await persistThemeId(nextId);
  }, []);

  const colorScheme: AppColorScheme =
    mode === "system" ? (systemScheme === "dark" ? "dark" : "light") : mode;

  const themeDefinition = useMemo(
    () => getThemeDefinition(themeId),
    [themeId]
  );

  const palette = useMemo(
    () => resolveThemePalette(themeId, colorScheme),
    [themeId, colorScheme]
  );

  const value = useMemo(
    () => ({
      mode,
      setMode,
      colorScheme,
      themeId,
      setThemeId,
      themeDefinition,
      palette,
      isReady,
    }),
    [
      mode,
      setMode,
      colorScheme,
      themeId,
      setThemeId,
      themeDefinition,
      palette,
      isReady,
    ]
  );

  return (
    <AppearanceContext.Provider value={value}>
      {children}
    </AppearanceContext.Provider>
  );
}

export function useAppearance() {
  const context = useContext(AppearanceContext);
  if (!context) {
    throw new Error("useAppearance must be used within AppearanceProvider");
  }
  return context;
}
