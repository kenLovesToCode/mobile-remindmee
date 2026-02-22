import { router } from 'expo-router';

import { HomeDashboardScreen } from '../../src/screens/HomeDashboardScreen';
import { ScreenKey } from '../../src/data/mockData';
import { useAuth } from '../../src/features/auth/AuthContext';
import { useTasks } from '../../src/features/tasks/useTasks';

export default function HomeRoute() {
  const { user } = useAuth();
  const { upcoming, stats } = useTasks(user?.id);

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

  return (
    <HomeDashboardScreen
      onAddTask={() => router.push('/(app)/new-task')}
      onNavigate={handleNavigate}
      upcomingTasks={upcoming}
      upcomingLimit={10}
      stats={stats}
    />
  );
}
