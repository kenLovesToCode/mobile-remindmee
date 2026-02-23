import { router } from 'expo-router';
import { useMemo } from 'react';

import { HomeDashboardScreen } from '../../src/screens/HomeDashboardScreen';
import { ScreenKey } from '../../src/data/mockData';
import { useAuth } from '../../src/features/auth/AuthContext';
import { useTasks } from '../../src/features/tasks/useTasks';
import { useNotifications } from '../../src/features/notifications/useNotifications';

export default function HomeRoute() {
  const { user } = useAuth();
  const { tasks, upcomingTasks, stats } = useTasks(user?.id);
  const { notifications, unreadCount } = useNotifications(user?.id);

  const missedReminderTasks = useMemo(() => {
    const now = new Date();
    const tasksById = tasks.reduce<Record<string, typeof tasks[number]>>((acc, task) => {
      acc[task.id] = task;
      return acc;
    }, {});

    return notifications
      .filter((notification) => !notification.readAt)
      .map((notification) => tasksById[notification.taskId])
      .filter((task): task is NonNullable<typeof task> => !!task)
      .filter((task) => new Date(task.scheduledAt).getTime() <= now.getTime());
  }, [notifications, tasks]);

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
      userName={user?.fullName ?? undefined}
      missedReminderTasks={missedReminderTasks}
      upcomingTasks={upcomingTasks}
      upcomingLimit={10}
      stats={stats}
    />
  );
}
