import { useCallback, useState } from 'react';
import { router } from 'expo-router';

import { LoginCredentials, LoginScreen } from '../../src/screens/LoginScreen';
import { AuthStatus } from '../../src/screens/authTypes';
import { useAuth } from '../../src/features/auth/AuthContext';

export default function LoginRoute() {
  const [status, setStatus] = useState<AuthStatus>('idle');
  const [statusMessage, setStatusMessage] = useState<string | undefined>(undefined);
  const { login } = useAuth();

  const handleLogin = useCallback(
    async ({ email, password }: LoginCredentials) => {
      setStatus('loading');
      setStatusMessage(undefined);
      const result = await login({ email, password });
      if (result.ok) {
        setStatus('idle');
        router.replace('/(app)/home');
        return;
      }
      setStatus(result.status ?? 'error');
      setStatusMessage(result.message);
    },
    [login],
  );

  return (
    <LoginScreen
      status={status}
      statusMessage={statusMessage}
      onLogin={handleLogin}
      onForgotPassword={() => router.push('/(auth)/forgot-password')}
      onSignup={() => router.push('/(auth)/signup')}
    />
  );
}
