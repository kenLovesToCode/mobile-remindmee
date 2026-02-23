import Constants from 'expo-constants';
import { Platform } from 'react-native';

import { getTasksByUserId } from '../../data/tasks/repository';
import { Task } from '../../data/tasks/models';

const ONE_HOUR_MS = 60 * 60 * 1000;
const REQUEST_TIMEOUT_MS = 8000;

interface ReminderTaskPayload {
  readonly taskId: string;
  readonly title: string;
  readonly scheduledAt: string;
  readonly notifyAt: string;
  readonly updatedAt: string;
  readonly isCompleted: boolean;
}

const getApiBaseUrl = () => {
  const envUrl = process.env.EXPO_PUBLIC_API_BASE_URL?.trim();
  if (envUrl) {
    return envUrl.replace(/\/+$/, '');
  }
  const extra = (Constants.expoConfig?.extra ?? {}) as { apiBaseUrl?: unknown };
  const extraUrl = typeof extra.apiBaseUrl === 'string' ? extra.apiBaseUrl.trim() : '';
  return extraUrl ? extraUrl.replace(/\/+$/, '') : null;
};

const postJson = async (path: string, body: Record<string, unknown>) => {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) {
    return { ok: false as const, skipped: true as const };
  }

  const controller = typeof AbortController === 'function' ? new AbortController() : null;
  const timeoutId =
    controller && typeof setTimeout === 'function'
      ? setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
      : null;

  try {
    const response = await fetch(`${baseUrl}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller?.signal,
    });
    return { ok: response.ok as boolean, skipped: false as const };
  } catch {
    return { ok: false as const, skipped: false as const };
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
};

const toReminderTaskPayload = (task: Task): ReminderTaskPayload => ({
  taskId: task.id,
  title: task.title,
  scheduledAt: task.scheduledAt,
  notifyAt: new Date(new Date(task.scheduledAt).getTime() - ONE_HOUR_MS).toISOString(),
  updatedAt: task.updatedAt,
  isCompleted: task.isCompleted,
});

export const syncPushJobsForUser = async (userId: string) => {
  const tasks = await getTasksByUserId(userId);
  const payload = tasks.map(toReminderTaskPayload);
  return postJson('/api/reminders/sync-user', { userId, tasks: payload });
};

export const registerPushTokenForUser = async (userId: string) => {
  if (Platform.OS === 'web') {
    return { ok: false as const, skipped: true as const };
  }
  if (Constants.appOwnership === 'expo') {
    return { ok: false as const, skipped: true as const };
  }

  const Notifications = await import('expo-notifications');
  const permissions = await Notifications.getPermissionsAsync();
  const finalStatus =
    permissions.status === 'granted'
      ? permissions.status
      : (await Notifications.requestPermissionsAsync()).status;

  if (finalStatus !== 'granted') {
    return { ok: false as const, skipped: true as const };
  }

  const easProjectId =
    ((Constants.expoConfig?.extra ?? {}) as { eas?: { projectId?: string } }).eas?.projectId ?? undefined;
  const tokenResponse = await Notifications.getExpoPushTokenAsync(
    easProjectId ? { projectId: easProjectId } : undefined,
  );

  return postJson('/api/push/register-token', {
    userId,
    expoPushToken: tokenResponse.data,
    platform: Platform.OS,
    deviceId: Constants.sessionId ?? null,
  });
};

