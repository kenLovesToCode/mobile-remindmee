import { router } from 'expo-router';

import { TaskListScreen } from '../../src/screens/TaskListScreen';
import { ScreenKey } from '../../src/data/mockData';
import { useAuth } from '../../src/features/auth/AuthContext';
import { useTasks } from '../../src/features/tasks/useTasks';
import { deleteTaskById } from '../../src/data/tasks/repository';
import { syncNotificationsForUser } from '../../src/features/notifications/syncNotifications';

export default function TasksRoute() {
  const { user } = useAuth();
  const { sections, upcomingTasks, refresh } = useTasks(user?.id);

  const handleNavigate = (screen: ScreenKey) => {
    if (screen === 'tasks') {
      return;
    }
    if (screen === 'home') {
      router.replace('/(app)/home');
    } else if (screen === 'settings') {
      router.replace('/(app)/settings');
    }
  };

  return (
    <TaskListScreen
      onAddTask={() => router.push('/(app)/new-task')}
      onNavigate={handleNavigate}
      onEditTask={(taskId) => router.push({ pathname: '/(app)/new-task', params: { taskId, mode: 'edit' } })}
      onDeleteTask={async (taskId) => {
        await deleteTaskById(taskId);
        refresh();
        if (user?.id) {
          await syncNotificationsForUser(user.id);
        }
      }}
      sections={sections}
      upcomingTasks={upcomingTasks}
    />
  );
}
