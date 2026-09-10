/**
 * Storybook entry (swapped in when STORYBOOK_ENABLED=true).
 * gesture-handler / reanimated MUST load before Storybook UI / bottom-sheet.
 */
import "react-native-gesture-handler";
import "react-native-reanimated";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { registerRootComponent } from "expo";

import { view } from "./storybook.requires";

const StorybookUIRoot = view.getStorybookUI({
  shouldPersistSelection: true,
  storage: {
    getItem: AsyncStorage.getItem,
    setItem: AsyncStorage.setItem,
  },
});

registerRootComponent(StorybookUIRoot);
