import { useCallback, useEffect, useMemo, useState } from 'react';
import { useFocusEffect } from 'expo-router';

import { initializeAuthDb } from '../../data/auth/db';
import {
  getNotificationsByUserIdInTaskRange,
  markNotificationRead,
} from '../../data/notifications/repository';
import { TaskNotification } from '../../data/notifications/models';

export type NotificationStatus = 'idle' | 'loading' | 'error' | 'empty';

export interface NotificationsWindow {
  readonly backDays: number;
  readonly forwardHours: number;
}

const DEFAULT_WINDOW: NotificationsWindow = {
  backDays: 3,
  forwardHours: 1,
};

const toWindowRange = (window: NotificationsWindow) => {
  const now = new Date();
  const from = new Date(now);
  from.setDate(from.getDate() - window.backDays);
  const to = new Date(now);
  to.setHours(to.getHours() + window.forwardHours);
  return { fromISO: from.toISOString(), toISO: to.toISOString() };
};

export const useNotifications = (userId?: string, window: NotificationsWindow = DEFAULT_WINDOW) => {
  const [notifications, setNotifications] = useState<TaskNotification[]>([]);
  const [status, setStatus] = useState<NotificationStatus>('idle');
  const [error, setError] = useState<string | undefined>(undefined);

  const refresh = useCallback(async () => {
    if (!userId) {
      setNotifications([]);
      setStatus('empty');
      return;
    }
    setStatus('loading');
    setError(undefined);
    try {
      await initializeAuthDb();
      const { fromISO, toISO } = toWindowRange(window);
      const rows = await getNotificationsByUserIdInTaskRange(userId, fromISO, toISO);
      setNotifications(rows);
      setStatus(rows.length === 0 ? 'empty' : 'idle');
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Unable to load notifications.');
    }
  }, [userId, window]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useFocusEffect(
    useCallback(() => {
      refresh();
      return undefined;
    }, [refresh]),
  );

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.readAt).length,
    [notifications],
  );

  const markRead = useCallback(async (notificationId: string) => {
    const now = new Date().toISOString();
    await markNotificationRead(notificationId, now);
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === notificationId ? { ...notification, readAt: now } : notification,
      ),
    );
  }, []);

  return {
    notifications,
    status,
    error,
    unreadCount,
    refresh,
    markRead,
  } as const;
};
