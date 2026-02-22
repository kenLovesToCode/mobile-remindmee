import { router, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';

import { NewTaskModalScreen } from '../../src/screens/NewTaskModalScreen';
import { useAuth } from '../../src/features/auth/AuthContext';
import { createTask, updateTask } from '../../src/data/tasks/repository';
import { createId } from '../../src/features/auth/ids';
import { useTasks } from '../../src/features/tasks/useTasks';
import { syncNotificationsForUser } from '../../src/features/notifications/syncNotifications';

export default function NewTaskRoute() {
  const { user } = useAuth();
  const params = useLocalSearchParams<{ taskId?: string; mode?: string }>();
  const taskId = useMemo(() => (params.taskId ? String(params.taskId) : undefined), [params.taskId]);
  const isEditMode = params.mode === 'edit' && !!taskId;
  const { tasks, refresh } = useTasks(user?.id);
  const editTask = useMemo(() => {
    if (!taskId) {
      return undefined;
    }
    return tasks.find((task) => task.id === taskId);
  }, [taskId, tasks]);

  const handleSave = async (payload: {
    title: string;
    description: string | null;
    scheduledAt: string;
    priority: 'Low' | 'Medium' | 'High';
  }) => {
    if (!user) {
      return;
    }
    if (isEditMode && taskId) {
      await updateTask({
        id: taskId,
        title: payload.title,
        description: payload.description,
        priority: payload.priority,
        scheduledAt: payload.scheduledAt,
      });
    } else {
      await createTask({
        id: await createId(),
        userId: user.id,
        title: payload.title,
        description: payload.description,
        priority: payload.priority,
        scheduledAt: payload.scheduledAt,
      });
    }
    refresh();
    await syncNotificationsForUser(user.id);
    router.back();
  };

  return (
    <NewTaskModalScreen
      onClose={() => router.back()}
      onSave={handleSave}
      mode={isEditMode ? 'edit' : 'create'}
      initialValues={
        editTask
          ? {
              title: editTask.title,
              description: editTask.description,
              scheduledAt: editTask.scheduledAt,
              priority: editTask.priority,
            }
          : undefined
      }
      primaryLabel={isEditMode ? 'Update Task' : 'Save Task'}
    />
  );
}
