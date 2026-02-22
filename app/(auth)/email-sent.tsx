import { useCallback, useState } from 'react';
import { router } from 'expo-router';

import { EmailSentScreen } from '../../src/screens/EmailSentScreen';
import { AuthStatus } from '../../src/screens/authTypes';

export default function EmailSentRoute() {
  const [status, setStatus] = useState<AuthStatus>('idle');

  const handleResend = useCallback(() => {
    setStatus('loading');
    requestAnimationFrame(() => {
      setStatus('idle');
    });
  }, []);

  return (
    <EmailSentScreen
      status={status}
      onBackToLogin={() => router.replace('/(auth)/login')}
      onResendEmail={handleResend}
    />
  );
}
