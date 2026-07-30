import { Redirect, Tabs, router } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Platform, StyleSheet, View } from 'react-native';
import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { BookOpen, Compass, MessageCircle, User } from 'lucide-react-native';

import { HapticTab } from '@/components/HapticTab';
import { AppIcon } from '@/components/ui/AppIcon';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useAppTheme } from '@/hooks/useAppTheme';

export default function TabLayout() {
  const theme = useAppTheme();
  const { t } = useLanguage();
  const { canAccessApp, isReady } = useAuth();

  const settingsTabOptions = {
    title: t('tabs.me'),
    unmountOnBlur: true,
    tabBarIcon: ({ color }: { color: string }) => (
      <AppIcon icon={User} size={26} color={color} />
    ),
  } as BottomTabNavigationOptions;

  if (!isReady) {
    return (
      <View style={[styles.loading, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.text} />
      </View>
    );
  }

  if (!canAccessApp) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.tabIconDefault,
        tabBarLabelStyle: styles.tabLabel,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
            borderTopWidth: StyleSheet.hairlineWidth,
            borderTopColor: theme.border,
            elevation: 0,
          },
          default: {
            backgroundColor: theme.card,
            borderTopWidth: StyleSheet.hairlineWidth,
            borderTopColor: theme.border,
          },
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.chat'),
          tabBarIcon: ({ color }) => (
            <AppIcon icon={MessageCircle} size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="knowledge"
        options={{
          title: t('tabs.knowledge'),
          tabBarIcon: ({ color }) => (
            <AppIcon icon={BookOpen} size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          title: t('tabs.discover'),
          tabBarIcon: ({ color }) => (
            <AppIcon icon={Compass} size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={settingsTabOptions}
        listeners={({ navigation }) => ({
          tabPress: () => {
            const state = navigation.getState();
            const focusedRoute = state.routes[state.index];
            if (focusedRoute.name === 'settings') {
              router.replace('/(tabs)/settings');
            }
          },
        })}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
});
