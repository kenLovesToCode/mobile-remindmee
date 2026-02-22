import { Platform } from 'react-native';
import Constants from 'expo-constants';

import { initializeAuthDb } from '../../data/auth/db';
import { getTasksByUserId } from '../../data/tasks/repository';
import {
  clearNotificationIdentifier,
  deleteNotificationByTaskId,
  getNotificationByTaskId,
  getNotificationsByUserId,
  markNotificationSent,
  resetNotificationStateByTaskId,
  setNotificationIdentifier,
  upsertNotificationForTask,
} from '../../data/notifications/repository';
import { createId } from '../auth/ids';
import { Task } from '../../data/tasks/models';

const ONE_HOUR_MS = 60 * 60 * 1000;

const buildNotificationContent = (task: Task) => ({
  title: 'Upcoming Task',
  body: `${task.title} starts in 1 hour.`,
  ...(Platform.OS === 'android' ? { channelId: 'tasks' as const } : {}),
  data: { taskId: task.id },
});

const getNotifyAt = (scheduledAt: string) => new Date(new Date(scheduledAt).getTime() - ONE_HOUR_MS);

type NotificationsModule = typeof import('expo-notifications');

const getNotificationsModule = async (): Promise<NotificationsModule> =>
  (await import('expo-notifications')) as unknown as NotificationsModule;

const ensurePermissions = async (Notifications: typeof import('expo-notifications')) => {
  const current = await Notifications.getPermissionsAsync();
  if (current.status === 'granted') {
    return true;
  }
  const request = await Notifications.requestPermissionsAsync();
  return request.status === 'granted';
};

const ensureChannel = async (Notifications: typeof import('expo-notifications')) => {
  if (Platform.OS !== 'android') {
    return;
  }
  await Notifications.setNotificationChannelAsync('tasks', {
    name: 'Task Reminders',
    importance: Notifications.AndroidImportance.DEFAULT,
  });
};

const shouldSchedulePush = Constants.appOwnership !== 'expo' && Platform.OS !== 'web';

const toMillis = (value: string) => new Date(value).getTime();

export const resetNotificationForTask = async (taskId: string) => {
  await initializeAuthDb();
  const existing = await getNotificationByTaskId(taskId);
  if (!existing) {
    return;
  }
  const Notifications = shouldSchedulePush ? await getNotificationsModule() : null;
  if (existing.notificationIdentifier && Notifications) {
    await Notifications.cancelScheduledNotificationAsync(existing.notificationIdentifier).catch(() => {
      return;
    });
  }
  await resetNotificationStateByTaskId(taskId);
};

export const syncNotificationsForUser = async (userId: string) => {
  const Notifications = shouldSchedulePush ? await getNotificationsModule() : null;
  const supportsPresentedNotifications =
    !!Notifications && typeof Notifications.getPresentedNotificationsAsync === 'function';
  await initializeAuthDb();
  if (Notifications) {
    await ensureChannel(Notifications);
  }
  const hasPermission = Notifications ? await ensurePermissions(Notifications) : false;
  const tasks = await getTasksByUserId(userId);
  const existingNotifications = await getNotificationsByUserId(userId);
  const notificationByTaskId = new Map(existingNotifications.map((item) => [item.taskId, item]));
  const taskIds = new Set(tasks.map((task) => task.id));
  const now = new Date();

  const delivered = Notifications && supportsPresentedNotifications
    ? await Notifications.getPresentedNotificationsAsync()
    : [];
  const deliveredTaskIds = new Set(
    delivered
      .map((entry) => (entry.request.content.data as { taskId?: string } | undefined)?.taskId)
      .filter((taskId: string | undefined): taskId is string => !!taskId),
  );

  for (const notification of existingNotifications) {
    if (!taskIds.has(notification.taskId)) {
      if (notification.notificationIdentifier && Notifications) {
        await Notifications.cancelScheduledNotificationAsync(notification.notificationIdentifier).catch(() => {
          return;
        });
      }
      await deleteNotificationByTaskId(notification.taskId);
    }
  }

  for (const task of tasks) {
    if (task.isCompleted) {
      const existing = notificationByTaskId.get(task.id);
      if (existing?.notificationIdentifier && Notifications) {
        await Notifications.cancelScheduledNotificationAsync(existing.notificationIdentifier).catch(() => {
          return;
        });
      }
      if (!existing) {
        continue;
      }

      const notifyAtReached = new Date(existing.notifyAt).getTime() <= now.getTime();
      if (!notifyAtReached) {
        await deleteNotificationByTaskId(task.id);
        continue;
      }

      if (existing.notificationIdentifier) {
        await clearNotificationIdentifier(existing.id);
      }
      continue;
    }

    const notifyAtDate = getNotifyAt(task.scheduledAt);
    const notifyAtIso = notifyAtDate.toISOString();
    const existing = notificationByTaskId.get(task.id);
    const notificationId = existing?.id ?? (await createId());
    const createdAt = existing?.createdAt ?? new Date().toISOString();
    const scheduleChanged = !existing || existing.notifyAt !== notifyAtIso;
    const taskChangedAfterNotification =
      !!existing && toMillis(task.updatedAt) > toMillis(existing.updatedAt);

    let currentSentAt = existing?.sentAt ?? null;
    let currentNotificationIdentifier = existing?.notificationIdentifier ?? null;

    // Any task update/reactivation should make it eligible to notify again and appear unread.
    if (existing && (taskChangedAfterNotification || scheduleChanged)) {
      if (currentNotificationIdentifier && Notifications) {
        await Notifications.cancelScheduledNotificationAsync(currentNotificationIdentifier).catch(() => {
          return;
        });
      }
      await resetNotificationStateByTaskId(task.id);
      currentSentAt = null;
      currentNotificationIdentifier = null;
    }

    if (scheduleChanged) {
      await upsertNotificationForTask({
        id: notificationId,
        userId,
        taskId: task.id,
        notifyAt: notifyAtIso,
        createdAt,
      });
      if (existing?.notificationIdentifier && Notifications && !taskChangedAfterNotification) {
        await Notifications.cancelScheduledNotificationAsync(existing.notificationIdentifier).catch(() => {
          return;
        });
      }
      if (existing && !taskChangedAfterNotification) {
        await clearNotificationIdentifier(existing.id);
        currentNotificationIdentifier = null;
      }
    }

    const scheduledAtDate = new Date(task.scheduledAt);
    if (scheduledAtDate <= now) {
      continue;
    }

    if (currentSentAt) {
      continue;
    }

    const msUntilTaskStarts = scheduledAtDate.getTime() - now.getTime();
    const isWithinOneHourWindow = msUntilTaskStarts > 0 && msUntilTaskStarts <= ONE_HOUR_MS;

    if (isWithinOneHourWindow) {
      if (deliveredTaskIds.has(task.id)) {
        await markNotificationSent(notificationId, now.toISOString(), currentNotificationIdentifier);
        continue;
      }
      if (hasPermission && Notifications) {
        const identifier = await Notifications.scheduleNotificationAsync({
          content: buildNotificationContent(task),
          trigger: null,
        });
        await markNotificationSent(notificationId, new Date().toISOString(), identifier);
      }
      continue;
    }

    if (hasPermission && Notifications && (!currentNotificationIdentifier || scheduleChanged)) {
      const identifier = await Notifications.scheduleNotificationAsync({
        content: buildNotificationContent(task),
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: notifyAtDate,
          ...(Platform.OS === 'android' ? { channelId: 'tasks' } : {}),
        },
      });
      await setNotificationIdentifier(notificationId, identifier);
    }
  }
};
