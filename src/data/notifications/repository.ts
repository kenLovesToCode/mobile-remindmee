import { executeSql, queryAll, querySingle } from '../auth/db';
import { TaskNotification } from './models';

const toNotification = (row: {
  id: string;
  user_id: string;
  task_id: string;
  notify_at: string;
  sent_at: string | null;
  read_at: string | null;
  notification_identifier: string | null;
  created_at: string;
  updated_at: string;
}): TaskNotification => ({
  id: row.id,
  userId: row.user_id,
  taskId: row.task_id,
  notifyAt: row.notify_at,
  sentAt: row.sent_at,
  readAt: row.read_at,
  notificationIdentifier: row.notification_identifier,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export interface UpsertTaskNotificationInput {
  readonly id: string;
  readonly userId: string;
  readonly taskId: string;
  readonly notifyAt: string;
  readonly createdAt: string;
}

export const getNotificationsByUserId = async (userId: string) => {
  const rows = await queryAll<{
    id: string;
    user_id: string;
    task_id: string;
    notify_at: string;
    sent_at: string | null;
    read_at: string | null;
    notification_identifier: string | null;
    created_at: string;
    updated_at: string;
  }>(
    `SELECT id, user_id, task_id, notify_at, sent_at, read_at, notification_identifier, created_at, updated_at
     FROM task_notifications
     WHERE user_id = ?
     ORDER BY datetime(notify_at) DESC;`,
    [userId],
  );
  return rows.map(toNotification);
};

export const getNotificationsByUserIdInTaskRange = async (
  userId: string,
  fromISO: string,
  toISO: string,
) => {
  const rows = await queryAll<{
    id: string;
    user_id: string;
    task_id: string;
    notify_at: string;
    sent_at: string | null;
    read_at: string | null;
    notification_identifier: string | null;
    created_at: string;
    updated_at: string;
  }>(
    `SELECT tn.id, tn.user_id, tn.task_id, tn.notify_at, tn.sent_at, tn.read_at, tn.notification_identifier,
            tn.created_at, tn.updated_at
     FROM task_notifications tn
     JOIN tasks t ON t.id = tn.task_id
     WHERE tn.user_id = ? AND datetime(t.scheduled_at) BETWEEN datetime(?) AND datetime(?)
     ORDER BY datetime(t.scheduled_at) DESC;`,
    [userId, fromISO, toISO],
  );
  return rows.map(toNotification);
};

export const getNotificationByTaskId = async (taskId: string) => {
  const row = await querySingle<{
    id: string;
    user_id: string;
    task_id: string;
    notify_at: string;
    sent_at: string | null;
    read_at: string | null;
    notification_identifier: string | null;
    created_at: string;
    updated_at: string;
  }>(
    `SELECT id, user_id, task_id, notify_at, sent_at, read_at, notification_identifier, created_at, updated_at
     FROM task_notifications
     WHERE task_id = ?
     LIMIT 1;`,
    [taskId],
  );
  return row ? toNotification(row) : null;
};

export const upsertNotificationForTask = async (input: UpsertTaskNotificationInput) => {
  const now = new Date().toISOString();
  await executeSql(
    `INSERT INTO task_notifications (id, user_id, task_id, notify_at, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT(task_id) DO UPDATE SET notify_at = excluded.notify_at, updated_at = excluded.updated_at;`,
    [input.id, input.userId, input.taskId, input.notifyAt, input.createdAt, now],
  );
};

export const markNotificationSent = async (
  id: string,
  sentAt: string,
  notificationIdentifier?: string | null,
) => {
  const now = new Date().toISOString();
  await executeSql(
    `UPDATE task_notifications
     SET sent_at = ?, notification_identifier = ?, updated_at = ?
     WHERE id = ?;`,
    [sentAt, notificationIdentifier ?? null, now, id],
  );
};

export const markNotificationSentByTaskId = async (
  taskId: string,
  sentAt: string,
  notificationIdentifier?: string | null,
) => {
  const existing = await getNotificationByTaskId(taskId);
  if (!existing || existing.sentAt) {
    return;
  }
  await markNotificationSent(existing.id, sentAt, notificationIdentifier ?? existing.notificationIdentifier ?? null);
};

export const setNotificationIdentifier = async (id: string, notificationIdentifier: string) => {
  const now = new Date().toISOString();
  await executeSql(
    `UPDATE task_notifications
     SET notification_identifier = ?, updated_at = ?
     WHERE id = ?;`,
    [notificationIdentifier, now, id],
  );
};

export const markNotificationRead = async (id: string, readAt: string) => {
  const now = new Date().toISOString();
  await executeSql(
    `UPDATE task_notifications
     SET read_at = ?, updated_at = ?
     WHERE id = ?;`,
    [readAt, now, id],
  );
};

export const clearNotificationIdentifier = async (id: string) => {
  const now = new Date().toISOString();
  await executeSql(
    `UPDATE task_notifications
     SET notification_identifier = NULL, updated_at = ?
     WHERE id = ?;`,
    [now, id],
  );
};

export const deleteNotificationByTaskId = async (taskId: string) => {
  await executeSql(`DELETE FROM task_notifications WHERE task_id = ?;`, [taskId]);
};
