/**
 * App entry (package.json "main": "./index.tsx")
 * gesture-handler MUST be imported before any other RN screens/gestures.
 */
import "react-native-gesture-handler";

import { registerRootComponent } from "expo";
import { createElement } from "react";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ExpoRoot } from "expo-router";

// Metro context for Expo Router (app lives under src/app).
const ctx = require.context("./src/app");

function Root() {
  return (
    <GestureHandlerRootView style={styles.root}>
      {createElement(ExpoRoot, { context: ctx })}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

registerRootComponent(Root);
