import { useCallback, useState } from 'react';
import { router } from 'expo-router';

import { ForgotPasswordScreen } from '../../src/screens/ForgotPasswordScreen';
import { AuthStatus } from '../../src/screens/authTypes';

export default function ForgotPasswordRoute() {
  const [status, setStatus] = useState<AuthStatus>('idle');

  const handleSendReset = useCallback(() => {
    setStatus('loading');
    requestAnimationFrame(() => {
      setStatus('idle');
      router.replace('/(auth)/email-sent');
    });
  }, []);

  return (
    <ForgotPasswordScreen
      status={status}
      onSendReset={handleSendReset}
      onBackToLogin={() => router.replace('/(auth)/login')}
    />
  );
}
