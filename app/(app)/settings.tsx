import { router } from 'expo-router';

import { AppSettingsScreen } from '../../src/screens/AppSettingsScreen';
import { ScreenKey } from '../../src/data/mockData';
import { useAuth } from '../../src/features/auth/AuthContext';

export default function SettingsRoute() {
  const { user, logout } = useAuth();
  const handleNavigate = (screen: ScreenKey) => {
    if (screen === 'settings') {
      return;
    }
    if (screen === 'home') {
      router.replace('/(app)/home');
    } else if (screen === 'tasks') {
      router.replace('/(app)/tasks');
    }
  };

  return (
    <AppSettingsScreen
      onNavigate={handleNavigate}
      onLogout={logout}
      profile={
        user
          ? {
              name: user.fullName,
              email: user.email,
              planLabel: 'Local Member',
              appVersion: 'RemindMee App v1.0.0',
              appTagline: 'Offline-first productivity',
            }
          : undefined
      }
    />
  );
}
