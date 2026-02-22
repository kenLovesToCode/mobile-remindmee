import { executeSql, executeTransaction, querySingle } from './db';
import { Account, Session, User } from './models';

const PROVIDER_LOCAL = 'local';

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const toUser = (row: {
  id: string;
  full_name: string;
  email: string;
  created_at: string;
  updated_at: string;
}): User => ({
  id: row.id,
  fullName: row.full_name,
  email: row.email,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const toAccount = (row: {
  id: string;
  user_id: string;
  provider: string;
  provider_account_id: string;
  password_hash: string;
  password_salt: string;
  created_at: string;
}): Account => ({
  id: row.id,
  userId: row.user_id,
  provider: row.provider as 'local',
  providerAccountId: row.provider_account_id,
  passwordHash: row.password_hash,
  passwordSalt: row.password_salt,
  createdAt: row.created_at,
});

const toSession = (row: {
  id: string;
  user_id: string;
  created_at: string;
  last_active_at: string;
}): Session => ({
  id: row.id,
  userId: row.user_id,
  createdAt: row.created_at,
  lastActiveAt: row.last_active_at,
});

export interface CreateUserInput {
  readonly id: string;
  readonly fullName: string;
  readonly email: string;
  readonly passwordHash: string;
  readonly passwordSalt: string;
  readonly accountId: string;
}

export const findAccountByEmail = async (email: string) => {
  const normalizedEmail = normalizeEmail(email);
  const row = await querySingle<{
    id: string;
    user_id: string;
    provider: string;
    provider_account_id: string;
    password_hash: string;
    password_salt: string;
    created_at: string;
  }>(
    `SELECT id, user_id, provider, provider_account_id, password_hash, password_salt, created_at
     FROM accounts
     WHERE provider = ? AND provider_account_id = ?
     LIMIT 1;`,
    [PROVIDER_LOCAL, normalizedEmail],
  );
  return row ? toAccount(row) : null;
};

export const getUserById = async (userId: string) => {
  const row = await querySingle<{
    id: string;
    full_name: string;
    email: string;
    created_at: string;
    updated_at: string;
  }>(
    `SELECT id, full_name, email, created_at, updated_at
     FROM users
     WHERE id = ?
     LIMIT 1;`,
    [userId],
  );
  return row ? toUser(row) : null;
};

export const createUserWithAccount = async (input: CreateUserInput) => {
  const now = new Date().toISOString();
  const normalizedEmail = normalizeEmail(input.email);

  await executeTransaction([
    {
      sql: `INSERT INTO users (id, full_name, email, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?);`,
      params: [input.id, input.fullName.trim(), normalizedEmail, now, now],
    },
    {
      sql: `INSERT INTO accounts (id, user_id, provider, provider_account_id, password_hash, password_salt, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?);`,
      params: [
        input.accountId,
        input.id,
        PROVIDER_LOCAL,
        normalizedEmail,
        input.passwordHash,
        input.passwordSalt,
        now,
      ],
    },
  ]);

  return getUserById(input.id);
};

export const createSession = async (session: { id: string; userId: string }) => {
  const now = new Date().toISOString();
  await executeTransaction([
    { sql: 'DELETE FROM sessions;', params: [] },
    {
      sql: `INSERT INTO sessions (id, user_id, created_at, last_active_at)
            VALUES (?, ?, ?, ?);`,
      params: [session.id, session.userId, now, now],
    },
  ]);
};

export const getSession = async () => {
  const row = await querySingle<{
    id: string;
    user_id: string;
    created_at: string;
    last_active_at: string;
  }>(
    `SELECT id, user_id, created_at, last_active_at
     FROM sessions
     LIMIT 1;`,
  );
  return row ? toSession(row) : null;
};

export const clearSessions = async () => {
  await executeSql('DELETE FROM sessions;');
};

export const updateAccountPasswordByEmail = async (email: string, passwordHash: string, passwordSalt: string) => {
  const normalizedEmail = normalizeEmail(email);
  const result = await executeSql(
    `UPDATE accounts
     SET password_hash = ?, password_salt = ?
     WHERE provider = ? AND provider_account_id = ?;`,
    [passwordHash, passwordSalt, PROVIDER_LOCAL, normalizedEmail],
  );
  return result.changes > 0;
};
