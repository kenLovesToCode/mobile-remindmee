import { openDatabaseSync, type SQLiteDatabase, type SQLiteRunResult } from 'expo-sqlite';

export type SqlParams = Array<string | number | null>;

export interface SqlStatement {
  readonly sql: string;
  readonly params?: SqlParams;
}

const DB_NAME = 'remindmee.db';
const CREATE_TABLE_STATEMENTS: SqlStatement[] = [
  {
    sql: `CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY NOT NULL,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );`,
  },
  {
    sql: `CREATE TABLE IF NOT EXISTS accounts (
      id TEXT PRIMARY KEY NOT NULL,
      user_id TEXT NOT NULL,
      provider TEXT NOT NULL,
      provider_account_id TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      password_salt TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );`,
  },
  {
    sql: `CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY NOT NULL,
      user_id TEXT NOT NULL,
      created_at TEXT NOT NULL,
      last_active_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );`,
  },
  {
    sql: `CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY NOT NULL,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      priority TEXT NOT NULL,
      scheduled_at TEXT NOT NULL,
      is_completed INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );`,
  },
  {
    sql: `CREATE INDEX IF NOT EXISTS idx_tasks_user_scheduled
      ON tasks(user_id, scheduled_at);`,
  },
  {
    sql: `CREATE TABLE IF NOT EXISTS task_notifications (
      id TEXT PRIMARY KEY NOT NULL,
      user_id TEXT NOT NULL,
      task_id TEXT NOT NULL UNIQUE,
      notify_at TEXT NOT NULL,
      sent_at TEXT,
      read_at TEXT,
      notification_identifier TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
    );`,
  },
  {
    sql: `CREATE INDEX IF NOT EXISTS idx_task_notifications_user_notify_at
      ON task_notifications(user_id, notify_at);`,
  },
  {
    sql: `CREATE INDEX IF NOT EXISTS idx_task_notifications_task_id
      ON task_notifications(task_id);`,
  },
];

let dbInstance: SQLiteDatabase | null = null;
let initPromise: Promise<void> | null = null;

const openDb = () => {
  if (!dbInstance) {
    dbInstance = openDatabaseSync(DB_NAME);
  }
  return dbInstance;
};

export const initializeAuthDb = async () => {
  if (!initPromise) {
    initPromise = executeTransaction([{ sql: 'PRAGMA foreign_keys = ON;' }, ...CREATE_TABLE_STATEMENTS]);
  }
  return initPromise;
};

export const executeSql = async (sql: string, params: SqlParams = []) => {
  const db = openDb();
  return db.runAsync(sql, params);
};

export const executeTransaction = async (statements: SqlStatement[]) => {
  const db = openDb();
  await db.withTransactionAsync(async () => {
    for (const statement of statements) {
      await db.runAsync(statement.sql, statement.params ?? []);
    }
  });
};

export const querySingle = async <T>(sql: string, params: SqlParams = []) => {
  const db = openDb();
  return db.getFirstAsync<T>(sql, params);
};

export const queryAll = async <T>(sql: string, params: SqlParams = []) => {
  const db = openDb();
  return db.getAllAsync<T>(sql, params);
};

export type { SQLiteRunResult };
