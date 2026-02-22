import { useCallback, useState } from 'react';
import { router } from 'expo-router';

import { EmailSentScreen } from '../../src/screens/EmailSentScreen';
import { AuthStatus } from '../../src/screens/authTypes';

export default function EmailSentRoute() {
  const [status, setStatus] = useState<AuthStatus>('idle');
  const [statusMessage, setStatusMessage] = useState<string | undefined>(undefined);

  const handleResend = useCallback(() => {
    setStatus('loading');
    requestAnimationFrame(() => {
      setStatus('empty');
      setStatusMessage('We just sent another reset email.');
    });
  }, []);

  return (
    <EmailSentScreen
      status={status}
      statusMessage={statusMessage}
      onBackToLogin={() => router.replace('/(auth)/login')}
      onResendEmail={handleResend}
    />
  );
}
