import { useCallback, useEffect, useRef } from 'react';
import { AppState, type AppStateStatus, Platform } from 'react-native';
import Constants from 'expo-constants';

import { syncNotificationsForUser } from './syncNotifications';
import { initializeAuthDb } from '../../data/auth/db';
import { markNotificationSentByTaskId } from '../../data/notifications/repository';

export const useNotificationSync = (userId?: string) => {
  const isSyncingRef = useRef(false);

  const sync = useCallback(async () => {
    if (!userId || isSyncingRef.current) {
      return;
    }
    isSyncingRef.current = true;
    try {
      await syncNotificationsForUser(userId);
    } finally {
      isSyncingRef.current = false;
    }
  }, [userId]);

  useEffect(() => {
    sync();
  }, [sync]);

  useEffect(() => {
    const handleStateChange = (nextState: AppStateStatus) => {
      if (nextState === 'active') {
        sync();
      }
    };
    const subscription = AppState.addEventListener('change', handleStateChange);
    return () => subscription.remove();
  }, [sync]);

  useEffect(() => {
    if (!userId || Constants.appOwnership === 'expo' || Platform.OS === 'web') {
      return;
    }

    let isMounted = true;
    let receivedSub: { remove: () => void } | null = null;
    let responseSub: { remove: () => void } | null = null;

    const markSentFromPayload = async (
      payload: { taskId?: unknown },
      requestIdentifier?: string | null,
    ) => {
      const taskId = typeof payload.taskId === 'string' ? payload.taskId : undefined;
      if (!taskId) {
        return;
      }
      await initializeAuthDb();
      await markNotificationSentByTaskId(taskId, new Date().toISOString(), requestIdentifier ?? null);
    };

    const setupListeners = async () => {
      const Notifications = await import('expo-notifications');
      if (!isMounted) {
        return;
      }

      receivedSub = Notifications.addNotificationReceivedListener((event) => {
        void markSentFromPayload(
          (event.request.content.data ?? {}) as { taskId?: unknown },
          event.request.identifier,
        );
      });

      responseSub = Notifications.addNotificationResponseReceivedListener((response) => {
        void markSentFromPayload(
          (response.notification.request.content.data ?? {}) as { taskId?: unknown },
          response.notification.request.identifier,
        );
      });
    };

    void setupListeners();

    return () => {
      isMounted = false;
      receivedSub?.remove();
      responseSub?.remove();
    };
  }, [userId]);
};
