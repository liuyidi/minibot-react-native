import 'react-native-gesture-handler';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

import { AppearanceProvider, useAppearance } from '@/context/AppearanceContext';
import { AuthProvider } from '@/context/AuthContext';
import { ChatPreferencesProvider } from '@/context/ChatPreferencesContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { MinibotProvider } from '@/context/MinibotClientContext';
import { useColorScheme } from '@/hooks/useColorScheme';

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { palette } = useAppearance();
  const navTheme = useMemo(() => {
    const dark = colorScheme === 'dark';
    const base = dark ? DarkTheme : DefaultTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        primary: palette.primary,
        background: palette.background,
        card: palette.card,
        text: palette.text,
        border: palette.border,
        notification: palette.primary,
      },
    };
  }, [colorScheme, palette]);

  return (
    <ThemeProvider value={navTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="settings"
          options={{ headerShown: false, animation: 'slide_from_right' }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  return (
    <GestureHandlerRootView style={styles.root}>
      <AppearanceProvider>
        <LanguageProvider>
          <AuthProvider>
            <MinibotProvider>
              <ChatPreferencesProvider>
                {loaded ? <RootLayoutNav /> : null}
              </ChatPreferencesProvider>
            </MinibotProvider>
          </AuthProvider>
        </LanguageProvider>
      </AppearanceProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
