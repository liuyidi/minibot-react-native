import AsyncStorage from "@react-native-async-storage/async-storage";

import { DEFAULT_THEME_ID, isThemeId } from "@/lib/theme/registry";
import type { ThemeId } from "@/lib/theme/types";

const THEME_STORAGE_KEY = "@minibot/themeId";

export async function getThemeId(): Promise<ThemeId> {
  const value = await AsyncStorage.getItem(THEME_STORAGE_KEY);
  if (isThemeId(value)) {
    return value;
  }
  return DEFAULT_THEME_ID;
}

export async function setThemeId(id: ThemeId): Promise<void> {
  await AsyncStorage.setItem(THEME_STORAGE_KEY, id);
}
