import { useCallback, useState } from 'react';
import { router } from 'expo-router';

import { ForgotPasswordScreen } from '../../src/screens/ForgotPasswordScreen';
import { AuthStatus } from '../../src/screens/authTypes';
import { useAuth } from '../../src/features/auth/AuthContext';

export default function ForgotPasswordRoute() {
  const [status, setStatus] = useState<AuthStatus>('idle');
  const [statusMessage, setStatusMessage] = useState<string | undefined>(undefined);
  const { sendPasswordReset } = useAuth();

  const handleSendReset = useCallback(
    async (email: string) => {
      setStatus('loading');
      setStatusMessage(undefined);
      const result = await sendPasswordReset(email);
      if (result.ok) {
        setStatus('idle');
        setStatusMessage(result.message);
        router.replace({
          pathname: '/(auth)/reset-password',
          params: { email },
        });
        return;
      }
      setStatus(result.status ?? 'error');
      setStatusMessage(result.message);
    },
    [sendPasswordReset],
  );

  return (
    <ForgotPasswordScreen
      status={status}
      statusMessage={statusMessage}
      onSendReset={handleSendReset}
      onBackToLogin={() => router.replace('/(auth)/login')}
    />
  );
}
