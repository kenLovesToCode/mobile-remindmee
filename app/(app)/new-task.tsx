import { router } from 'expo-router';

import { NewTaskModalScreen } from '../../src/screens/NewTaskModalScreen';
import { useAuth } from '../../src/features/auth/AuthContext';
import { createTask } from '../../src/data/tasks/repository';
import { createId } from '../../src/features/auth/ids';

export default function NewTaskRoute() {
  const { user } = useAuth();

  const handleSave = async (payload: {
    title: string;
    description: string | null;
    scheduledAt: string;
    priority: 'Low' | 'Medium' | 'High';
  }) => {
    if (!user) {
      return;
    }
    await createTask({
      id: await createId(),
      userId: user.id,
      title: payload.title,
      description: payload.description,
      priority: payload.priority,
      scheduledAt: payload.scheduledAt,
    });
    router.back();
  };

  return <NewTaskModalScreen onClose={() => router.back()} onSave={handleSave} />;
}
