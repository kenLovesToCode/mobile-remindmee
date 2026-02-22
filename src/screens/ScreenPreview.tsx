import { StyleSheet, View } from 'react-native';

import { HomeDashboardScreen } from './HomeDashboardScreen';
import { TaskListScreen } from './TaskListScreen';
import { NewTaskModalScreen } from './NewTaskModalScreen';
import { AppSettingsScreen } from './AppSettingsScreen';
import { useScreenPreview } from '../hooks/useScreenPreview';
import { theme } from '../theme/colors';

export interface ScreenPreviewProps {}

export const ScreenPreview = ({}: ScreenPreviewProps) => {
  const { screen, navigateTo, closeModal } = useScreenPreview();
  const activeScreen = screen;

  return (
    <View style={styles.container}>
      <View style={styles.screenWrap}>
        {activeScreen === 'home' && (
          <HomeDashboardScreen onAddTask={() => navigateTo('newTask')} onNavigate={navigateTo} />
        )}
        {activeScreen === 'tasks' && (
          <TaskListScreen onAddTask={() => navigateTo('newTask')} onNavigate={navigateTo} />
        )}
        {activeScreen === 'newTask' && <NewTaskModalScreen onClose={closeModal} onSave={closeModal} />}
        {activeScreen === 'settings' && <AppSettingsScreen onNavigate={navigateTo} />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  screenWrap: {
    flex: 1,
  },
});
