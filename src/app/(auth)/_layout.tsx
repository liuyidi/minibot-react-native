import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen
        name="legal"
        options={{
          headerShown: true,
          headerBackTitle: "",
          headerTintColor: "#080808",
          headerStyle: { backgroundColor: "#ffffff" },
          headerShadowVisible: false,
        }}
      />
    </Stack>
  );
}
