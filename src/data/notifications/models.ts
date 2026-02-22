export type NotificationStatus = 'unread' | 'read';

export interface TaskNotification {
  readonly id: string;
  readonly userId: string;
  readonly taskId: string;
  readonly notifyAt: string;
  readonly sentAt?: string | null;
  readonly isSent: boolean;
  readonly readAt?: string | null;
  readonly notificationIdentifier?: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
}
