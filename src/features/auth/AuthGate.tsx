import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';

import { useAuth } from './AuthContext';

export const AuthGate = () => {
  const { user, isReady } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isReady) {
      return;
    }

    const inAuthGroup = segments[0] === '(auth)';
    const inAppGroup = segments[0] === '(app)';

    if (!user && inAppGroup) {
      router.replace('/(auth)/login');
    } else if (user && inAuthGroup) {
      router.replace('/(app)/home');
    }
  }, [isReady, user, segments, router]);

  return null;
};
