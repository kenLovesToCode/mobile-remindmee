import { useCallback, useState } from 'react';
import { router } from 'expo-router';

import { LoginScreen } from '../../src/screens/LoginScreen';
import { AuthStatus } from '../../src/screens/authTypes';

export default function LoginRoute() {
  const [status, setStatus] = useState<AuthStatus>('idle');

  const handleLogin = useCallback(() => {
    setStatus('loading');
    requestAnimationFrame(() => {
      setStatus('idle');
      router.replace('/(app)/home');
    });
  }, []);

  return (
    <LoginScreen
      status={status}
      onLogin={handleLogin}
      onForgotPassword={() => router.push('/(auth)/forgot-password')}
      onSignup={() => router.push('/(auth)/signup')}
    />
  );
}
