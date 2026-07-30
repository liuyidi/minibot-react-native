/**
 * App entry (package.json "main": "./index.tsx")
 * gesture-handler MUST be imported before any other RN screens/gestures.
 */
import "react-native-gesture-handler";

import { registerRootComponent } from "expo";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import App from "./app";

function Root() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <App />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

registerRootComponent(Root);
