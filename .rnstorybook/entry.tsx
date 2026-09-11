/**
 * Storybook root UI (JSX). Loaded by `./index.ts`.
 * gesture-handler / reanimated MUST load before Storybook UI / bottom-sheet.
 */
import "react-native-gesture-handler";
import "react-native-reanimated";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { registerRootComponent } from "expo";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { GalleryStorybookUI } from "./GalleryUI";
import { view } from "./storybook.requires";

const StorybookUIRoot = view.getStorybookUI({
  shouldPersistSelection: false,
  storage: {
    getItem: AsyncStorage.getItem,
    setItem: AsyncStorage.setItem,
  },
  CustomUIComponent: GalleryStorybookUI,
});

function Root() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <StorybookUIRoot />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

registerRootComponent(Root);
