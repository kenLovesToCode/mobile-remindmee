import { useCallback, useMemo, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';

import { ResetPasswordScreen } from '../../src/screens/ResetPasswordScreen';
import { AuthStatus } from '../../src/screens/authTypes';
import { useAuth } from '../../src/features/auth/AuthContext';

export default function ResetPasswordRoute() {
  const [status, setStatus] = useState<AuthStatus>('idle');
  const [statusMessage, setStatusMessage] = useState<string | undefined>(undefined);
  const { resetPassword } = useAuth();
  const params = useLocalSearchParams<{ email?: string }>();
  const email = useMemo(() => (params.email ?? '').toString(), [params.email]);

  const handleReset = useCallback(
    async (targetEmail: string, password: string, confirmPassword: string) => {
      setStatus('loading');
      setStatusMessage(undefined);
      const result = await resetPassword(targetEmail, password, confirmPassword);
      if (result.ok) {
        setStatus('empty');
        setStatusMessage('Password updated. You can log in now.');
        return;
      }
      setStatus(result.status ?? 'error');
      setStatusMessage(result.message);
    },
    [resetPassword],
  );

  return (
    <ResetPasswordScreen
      email={email}
      status={status}
      statusMessage={statusMessage}
      onReset={handleReset}
      onBackToLogin={() => router.replace('/(auth)/login')}
    />
  );
}
