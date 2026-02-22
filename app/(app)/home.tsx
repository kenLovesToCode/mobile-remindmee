import { router } from 'expo-router';

import { HomeDashboardScreen } from '../../src/screens/HomeDashboardScreen';
import { ScreenKey } from '../../src/data/mockData';

export default function HomeRoute() {
  const handleNavigate = (screen: ScreenKey) => {
    if (screen === 'home') {
      return;
    }
    if (screen === 'tasks') {
      router.replace('/(app)/tasks');
    } else if (screen === 'settings') {
      router.replace('/(app)/settings');
    }
  };

  return <HomeDashboardScreen onAddTask={() => router.push('/(app)/new-task')} onNavigate={handleNavigate} />;
}
