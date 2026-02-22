import { useCallback, useState } from 'react';
import { router } from 'expo-router';

import { SignupScreen } from '../../src/screens/SignupScreen';
import { AuthStatus } from '../../src/screens/authTypes';

export default function SignupRoute() {
  const [status, setStatus] = useState<AuthStatus>('idle');

  const handleCreateAccount = useCallback(() => {
    setStatus('loading');
    requestAnimationFrame(() => {
      setStatus('idle');
      router.replace('/(app)/home');
    });
  }, []);

  return (
    <SignupScreen
      status={status}
      onCreateAccount={handleCreateAccount}
      onLogin={() => router.replace('/(auth)/login')}
    />
  );
}
