import { useCallback, useState } from 'react';
import { router } from 'expo-router';

import { SignupCredentials, SignupScreen } from '../../src/screens/SignupScreen';
import { AuthStatus } from '../../src/screens/authTypes';
import { useAuth } from '../../src/features/auth/AuthContext';

export default function SignupRoute() {
  const [status, setStatus] = useState<AuthStatus>('idle');
  const [statusMessage, setStatusMessage] = useState<string | undefined>(undefined);
  const { signup } = useAuth();

  const handleCreateAccount = useCallback(
    async ({ fullName, email, password, confirmPassword }: SignupCredentials) => {
      setStatus('loading');
      setStatusMessage(undefined);
      const result = await signup({ fullName, email, password, confirmPassword });
      if (result.ok) {
        setStatus('idle');
        router.replace('/(app)/home');
        return;
      }
      setStatus(result.status ?? 'error');
      setStatusMessage(result.message);
    },
    [signup],
  );

  return (
    <SignupScreen
      status={status}
      statusMessage={statusMessage}
      onCreateAccount={handleCreateAccount}
      onLogin={() => router.replace('/(auth)/login')}
    />
  );
}
