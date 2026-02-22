import { router } from 'expo-router';
import { useMemo } from 'react';

import { NotificationsScreen } from '../../src/screens/NotificationsScreen';
import { useAuth } from '../../src/features/auth/AuthContext';
import { useNotifications } from '../../src/features/notifications/useNotifications';
import { useTasks } from '../../src/features/tasks/useTasks';

export default function NotificationsRoute() {
  const { user } = useAuth();
  const { notifications, status, error, markRead } = useNotifications(user?.id);
  const { tasks } = useTasks(user?.id);
  const tasksById = useMemo(
    () =>
      tasks.reduce<Record<string, typeof tasks[number]>>((acc, task) => {
        acc[task.id] = task;
        return acc;
      }, {}),
    [tasks],
  );

  return (
    <NotificationsScreen
      notifications={notifications}
      tasksById={tasksById}
      status={status}
      error={error}
      onMarkRead={markRead}
      onBack={() => router.back()}
    />
  );
}
