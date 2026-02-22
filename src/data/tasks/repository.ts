import { executeSql, queryAll, querySingle } from '../auth/db';
import { Task, TaskPriority } from './models';

const toTask = (row: {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  priority: string;
  scheduled_at: string;
  is_completed: number;
  created_at: string;
  updated_at: string;
}): Task => ({
  id: row.id,
  userId: row.user_id,
  title: row.title,
  description: row.description,
  priority: row.priority as TaskPriority,
  scheduledAt: row.scheduled_at,
  isCompleted: row.is_completed === 1,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export interface CreateTaskInput {
  readonly id: string;
  readonly userId: string;
  readonly title: string;
  readonly description: string | null;
  readonly priority: TaskPriority;
  readonly scheduledAt: string;
}

export const createTask = async (input: CreateTaskInput) => {
  const now = new Date().toISOString();
  await executeSql(
    `INSERT INTO tasks (id, user_id, title, description, priority, scheduled_at, is_completed, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?);`,
    [
      input.id,
      input.userId,
      input.title.trim(),
      input.description,
      input.priority,
      input.scheduledAt,
      now,
      now,
    ],
  );
};

export const getTaskById = async (taskId: string) => {
  const row = await querySingle<{
    id: string;
    user_id: string;
    title: string;
    description: string | null;
    priority: string;
    scheduled_at: string;
    is_completed: number;
    created_at: string;
    updated_at: string;
  }>(
    `SELECT id, user_id, title, description, priority, scheduled_at, is_completed, created_at, updated_at
     FROM tasks
     WHERE id = ?
     LIMIT 1;`,
    [taskId],
  );
  return row ? toTask(row) : null;
};

export interface UpdateTaskInput {
  readonly id: string;
  readonly title: string;
  readonly description: string | null;
  readonly priority: TaskPriority;
  readonly scheduledAt: string;
}

export const updateTask = async (input: UpdateTaskInput) => {
  const now = new Date().toISOString();
  await executeSql(
    `UPDATE tasks
     SET title = ?, description = ?, priority = ?, scheduled_at = ?, updated_at = ?
     WHERE id = ?;`,
    [input.title.trim(), input.description, input.priority, input.scheduledAt, now, input.id],
  );
};

export const markTaskCompleted = async (taskId: string) => {
  const now = new Date().toISOString();
  await executeSql(
    `UPDATE tasks
     SET is_completed = 1, updated_at = ?
     WHERE id = ?;`,
    [now, taskId],
  );
};

export const reactivateTask = async (taskId: string) => {
  const now = new Date().toISOString();
  await executeSql(
    `UPDATE tasks
     SET is_completed = 0, updated_at = ?
     WHERE id = ?;`,
    [now, taskId],
  );
};

export const completePastDueTasks = async (userId: string, nowIso: string) => {
  const result = await executeSql(
    `UPDATE tasks
     SET is_completed = 1, updated_at = ?
     WHERE user_id = ? AND is_completed = 0 AND datetime(scheduled_at) <= datetime(?);`,
    [nowIso, userId, nowIso],
  );
  return result.changes ?? 0;
};

export const deleteTaskById = async (taskId: string) => {
  await executeSql(`DELETE FROM tasks WHERE id = ?;`, [taskId]);
};

export const getTasksByUserId = async (userId: string) => {
  const rows = await queryAll<{
    id: string;
    user_id: string;
    title: string;
    description: string | null;
    priority: string;
    scheduled_at: string;
    is_completed: number;
    created_at: string;
    updated_at: string;
  }>(
    `SELECT id, user_id, title, description, priority, scheduled_at, is_completed, created_at, updated_at
     FROM tasks
     WHERE user_id = ?
     ORDER BY datetime(scheduled_at) ASC;`,
    [userId],
  );
  return rows.map(toTask);
};

export const getUpcomingTasksByUserId = async (userId: string, limit: number) => {
  const rows = await queryAll<{
    id: string;
    user_id: string;
    title: string;
    description: string | null;
    priority: string;
    scheduled_at: string;
    is_completed: number;
    created_at: string;
    updated_at: string;
  }>(
    `SELECT id, user_id, title, description, priority, scheduled_at, is_completed, created_at, updated_at
     FROM tasks
     WHERE user_id = ? AND datetime(scheduled_at) >= datetime('now')
     ORDER BY datetime(scheduled_at) ASC
     LIMIT ?;`,
    [userId, limit],
  );
  return rows.map(toTask);
};
