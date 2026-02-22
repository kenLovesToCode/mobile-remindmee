import { Stack } from 'expo-router';
import { View } from 'react-native';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';
import { useEffect } from 'react';

import { theme } from '../src/theme/colors';
import { AuthProvider } from '../src/features/auth/AuthContext';
import { AuthGate } from '../src/features/auth/AuthGate';
import { useNotificationSync } from '../src/features/notifications/useNotificationSync';
import { useAuth } from '../src/features/auth/AuthContext';

const useNotificationHandler = () => {
  useEffect(() => {
    if (Constants.appOwnership === 'expo') {
      return;
    }
    let mounted = true;
    const setup = async () => {
      const Notifications = await import('expo-notifications');
      if (!mounted) {
        return;
      }
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldShowBanner: true,
          shouldShowList: true,
          shouldPlaySound: false,
          shouldSetBadge: false,
        }),
      });
    };
    setup();
    return () => {
      mounted = false;
    };
  }, []);
};

const NotificationBootstrapper = () => {
  const { user } = useAuth();
  useNotificationHandler();
  useNotificationSync(user?.id);
  return null;
};

export default function RootLayout() {
  const navigationTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      primary: theme.colors.primary,
      background: theme.colors.background,
      card: theme.colors.background,
      text: theme.colors.textPrimary,
      border: theme.colors.border,
      notification: theme.colors.primary,
    },
  } as const;

  return (
    <ThemeProvider value={navigationTheme}>
      <StatusBar style="light" />
      <AuthProvider>
        <AuthGate />
        <NotificationBootstrapper />
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: theme.colors.background },
              animation: 'fade',
            }}
          >
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(app)" options={{ headerShown: false }} />
          </Stack>
        </View>
      </AuthProvider>
    </ThemeProvider>
  );
}
