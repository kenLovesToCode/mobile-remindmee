import { useCallback, useState } from 'react';

import { ScreenKey } from '../data/mockData';

export interface UseScreenPreviewResult {
  readonly screen: ScreenKey;
  readonly navigateTo: (screen: ScreenKey) => void;
  readonly closeModal: () => void;
}

export const useScreenPreview = (): UseScreenPreviewResult => {
  const defaultScreen: ScreenKey = 'login';
  const fallbackScreen: ScreenKey = 'home';
  const [screen, setScreen] = useState<ScreenKey>(defaultScreen);
  const [previousScreen, setPreviousScreen] = useState<ScreenKey>(defaultScreen);

  const navigateTo = useCallback(
    (nextScreen: ScreenKey) => {
      if (nextScreen === 'newTask' && screen !== 'newTask') {
        setPreviousScreen(screen);
      }
      setScreen(nextScreen);
    },
    [screen],
  );

  const closeModal = useCallback(() => {
    const targetScreen = previousScreen === 'newTask' ? fallbackScreen : previousScreen;
    setScreen(targetScreen);
  }, [previousScreen]);

  return {
    screen,
    navigateTo,
    closeModal,
  } as const;
};
