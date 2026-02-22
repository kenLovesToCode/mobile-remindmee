import { Stack } from 'expo-router';

import { theme } from '../../src/theme/colors';

export default function AppLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.background },
        animation: 'fade',
      }}
    >
      <Stack.Screen name="new-task" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
