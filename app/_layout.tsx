import { Stack } from 'expo-router';
import { View } from 'react-native';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

import { theme } from '../src/theme/colors';

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
    </ThemeProvider>
  );
}
