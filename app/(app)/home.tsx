import { router } from 'expo-router';

import { HomeDashboardScreen } from '../../src/screens/HomeDashboardScreen';
import { ScreenKey } from '../../src/data/mockData';
import { useAuth } from '../../src/features/auth/AuthContext';
import { useTasks } from '../../src/features/tasks/useTasks';
import { useNotifications } from '../../src/features/notifications/useNotifications';

export default function HomeRoute() {
  const { user } = useAuth();
  const { upcoming, stats } = useTasks(user?.id);
  const { unreadCount } = useNotifications(user?.id);

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
      onOpenNotifications={() => router.push('/(app)/notifications')}
      unreadNotifications={unreadCount}
      upcomingTasks={upcoming}
      upcomingLimit={10}
      stats={stats}
    />
  );
}
