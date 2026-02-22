import { router } from 'expo-router';

import { TaskListScreen } from '../../src/screens/TaskListScreen';
import { ScreenKey } from '../../src/data/mockData';

export default function TasksRoute() {
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

  return <TaskListScreen onAddTask={() => router.push('/(app)/new-task')} onNavigate={handleNavigate} />;
}
