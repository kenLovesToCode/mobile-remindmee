import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { initializeAuthDb } from '../../data/auth/db';
import {
  clearSessions,
  createSession,
  createUserWithAccount,
  findAccountByEmail,
  getSession,
  getUserById,
  updateAccountPasswordByEmail,
} from '../../data/auth/repository';
import { User } from '../../data/auth/models';
import { createId } from './ids';
import { createPasswordHash, verifyPassword } from './password';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN_LENGTH = 8;

export interface LoginInput {
  readonly email: string;
  readonly password: string;
}

export interface SignupInput {
  readonly fullName: string;
  readonly email: string;
  readonly password: string;
  readonly confirmPassword: string;
}

export interface AuthResult {
  readonly ok: boolean;
  readonly message?: string;
  readonly status?: 'error' | 'empty';
}

export interface AuthContextValue {
  readonly user: User | null;
  readonly isReady: boolean;
  readonly login: (input: LoginInput) => Promise<AuthResult>;
  readonly signup: (input: SignupInput) => Promise<AuthResult>;
  readonly logout: () => Promise<void>;
  readonly sendPasswordReset: (email: string) => Promise<AuthResult>;
  readonly resetPassword: (email: string, password: string, confirmPassword: string) => Promise<AuthResult>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const fail = (message: string, status: 'error' | 'empty' = 'error'): AuthResult => ({
  ok: false,
  message,
  status,
});

const logAuthTiming = (label: string, startedAt: number) => {
  if (__DEV__) {
    const elapsedMs = Date.now() - startedAt;
    console.info(`[auth-timing] ${label}: ${elapsedMs}ms`);
  }
};

export const AuthProvider = ({ children }: { readonly children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadSession = async () => {
      try {
        await initializeAuthDb();
        const session = await getSession();
        if (session) {
          const foundUser = await getUserById(session.userId);
          if (isMounted) {
            setUser(foundUser);
          }
          if (!foundUser) {
            await clearSessions();
          }
        }
      } catch {
        await clearSessions();
      } finally {
        if (isMounted) {
          setIsReady(true);
        }
      }
    };
    loadSession();
    return () => {
      isMounted = false;
    };
  }, []);

  const login = async ({ email, password }: LoginInput): Promise<AuthResult> => {
    const totalStartedAt = Date.now();
    try {
      await initializeAuthDb();
      const trimmedEmail = email.trim();
      if (!trimmedEmail || !password) {
        return fail('Email and password are required.', 'empty');
      }
      if (!EMAIL_PATTERN.test(trimmedEmail)) {
        return fail('Enter a valid email address.');
      }

      const accountLookupStartedAt = Date.now();
      const account = await findAccountByEmail(trimmedEmail);
      logAuthTiming('login.accountLookup', accountLookupStartedAt);
      if (!account) {
        return fail('Invalid email or password.');
      }

      const verifyStartedAt = Date.now();
      const verification = await verifyPassword(password, account.passwordSalt, account.passwordHash);
      logAuthTiming('login.verifyPassword', verifyStartedAt);
      if (!verification.isValid) {
        return fail('Invalid email or password.');
      }
      if (verification.needsUpgrade) {
        const upgradeStartedAt = Date.now();
        const { passwordHash, passwordSalt } = await createPasswordHash(password);
        await updateAccountPasswordByEmail(trimmedEmail, passwordHash, passwordSalt);
        logAuthTiming('login.passwordUpgrade', upgradeStartedAt);
      }

      const sessionStartedAt = Date.now();
      await createSession({ id: await createId(), userId: account.userId });
      const foundUser = await getUserById(account.userId);
      logAuthTiming('login.sessionAndUser', sessionStartedAt);
      if (foundUser) {
        setUser(foundUser);
      }
      logAuthTiming('login.total', totalStartedAt);
      return { ok: true };
    } catch {
      logAuthTiming('login.total.error', totalStartedAt);
      return fail('Unable to log in. Please try again.');
    }
  };

  const signup = async ({
    fullName,
    email,
    password,
    confirmPassword,
  }: SignupInput): Promise<AuthResult> => {
    const totalStartedAt = Date.now();
    try {
      await initializeAuthDb();
      const trimmedName = fullName.trim();
      const trimmedEmail = email.trim();

      if (!trimmedName || !trimmedEmail || !password || !confirmPassword) {
        return fail('All fields are required.', 'empty');
      }
      if (!EMAIL_PATTERN.test(trimmedEmail)) {
        return fail('Enter a valid email address.');
      }
      if (password.length < PASSWORD_MIN_LENGTH) {
        return fail(`Password must be at least ${PASSWORD_MIN_LENGTH} characters.`);
      }
      if (password !== confirmPassword) {
        return fail('Passwords do not match.');
      }

      const duplicateCheckStartedAt = Date.now();
      const existingAccount = await findAccountByEmail(trimmedEmail);
      logAuthTiming('signup.duplicateCheck', duplicateCheckStartedAt);
      if (existingAccount) {
        return fail('An account with this email already exists.');
      }

      const hashStartedAt = Date.now();
      const { passwordHash, passwordSalt } = await createPasswordHash(password);
      logAuthTiming('signup.createPasswordHash', hashStartedAt);
      const userId = await createId();
      const accountId = await createId();
      const persistStartedAt = Date.now();
      const createdUser = await createUserWithAccount({
        id: userId,
        accountId,
        fullName: trimmedName,
        email: trimmedEmail,
        passwordHash,
        passwordSalt,
      });
      logAuthTiming('signup.createUserWithAccount', persistStartedAt);

      if (!createdUser) {
        return fail('Unable to create account. Please try again.');
      }

      const sessionStartedAt = Date.now();
      await createSession({ id: await createId(), userId });
      logAuthTiming('signup.createSession', sessionStartedAt);
      setUser(createdUser);
      logAuthTiming('signup.total', totalStartedAt);
      return { ok: true };
    } catch {
      logAuthTiming('signup.total.error', totalStartedAt);
      return fail('Unable to create account. Please try again.');
    }
  };

  const logout = async () => {
    await clearSessions();
    setUser(null);
  };

  const sendPasswordReset = async (email: string): Promise<AuthResult> => {
    try {
      await initializeAuthDb();
      const trimmedEmail = email.trim();
      if (!trimmedEmail) {
        return fail('Enter your email address.', 'empty');
      }
      if (!EMAIL_PATTERN.test(trimmedEmail)) {
        return fail('Enter a valid email address.');
      }
      const account = await findAccountByEmail(trimmedEmail);
      if (!account) {
        return fail('No account found with that email.');
      }
      return { ok: true, message: 'Continue to reset your password.' };
    } catch {
      return fail('Unable to process request. Please try again.');
    }
  };

  const resetPassword = async (
    email: string,
    password: string,
    confirmPassword: string,
  ): Promise<AuthResult> => {
    try {
      await initializeAuthDb();
      const trimmedEmail = email.trim();
      if (!trimmedEmail || !password || !confirmPassword) {
        return fail('All fields are required.', 'empty');
      }
      if (!EMAIL_PATTERN.test(trimmedEmail)) {
        return fail('Enter a valid email address.');
      }
      if (password.length < PASSWORD_MIN_LENGTH) {
        return fail(`Password must be at least ${PASSWORD_MIN_LENGTH} characters.`);
      }
      if (password !== confirmPassword) {
        return fail('Passwords do not match.');
      }

      const { passwordHash, passwordSalt } = await createPasswordHash(password);
      const updated = await updateAccountPasswordByEmail(trimmedEmail, passwordHash, passwordSalt);
      if (!updated) {
        return fail('No account found with that email.');
      }

      return { ok: true };
    } catch {
      return fail('Unable to reset password. Please try again.');
    }
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isReady,
      login,
      signup,
      logout,
      sendPasswordReset,
      resetPassword,
    }),
    [user, isReady],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
};
