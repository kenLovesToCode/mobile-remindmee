import { router } from 'expo-router';

import { TaskListScreen } from '../../src/screens/TaskListScreen';
import { ScreenKey } from '../../src/data/mockData';
import { useAuth } from '../../src/features/auth/AuthContext';
import { useTasks } from '../../src/features/tasks/useTasks';

export default function TasksRoute() {
  const { user } = useAuth();
  const { sections, upcomingTasks } = useTasks(user?.id);

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
      sections={sections}
      upcomingTasks={upcomingTasks}
    />
  );
}
