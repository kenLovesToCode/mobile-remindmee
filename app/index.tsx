import { Redirect } from 'expo-router';
import { View } from 'react-native';

import { useAuth } from '../src/features/auth/AuthContext';
import { theme } from '../src/theme/colors';

export default function Index() {
  const { user, isReady } = useAuth();

  if (!isReady) {
    return <View style={{ flex: 1, backgroundColor: theme.colors.background }} />;
  }

  return <Redirect href={user ? '/(app)/home' : '/(auth)/login'} />;
}
