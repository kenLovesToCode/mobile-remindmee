import { router } from 'expo-router';

import { AppSettingsScreen } from '../../src/screens/AppSettingsScreen';
import { ScreenKey } from '../../src/data/mockData';

export default function SettingsRoute() {
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

  return <AppSettingsScreen onNavigate={handleNavigate} onLogout={() => router.replace('/(auth)/login')} />;
}
