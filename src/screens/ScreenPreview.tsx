import { StyleSheet, View } from 'react-native';

import { HomeDashboardScreen } from './HomeDashboardScreen';
import { TaskListScreen } from './TaskListScreen';
import { NewTaskModalScreen } from './NewTaskModalScreen';
import { AppSettingsScreen } from './AppSettingsScreen';
import { LoginScreen } from './LoginScreen';
import { SignupScreen } from './SignupScreen';
import { ForgotPasswordScreen } from './ForgotPasswordScreen';
import { EmailSentScreen } from './EmailSentScreen';
import { ResetPasswordScreen } from './ResetPasswordScreen';
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
          <HomeDashboardScreen
            onAddTask={() => navigateTo('newTask')}
            onNavigate={navigateTo}
            userName="Alex"
            upcomingTasks={[]}
            stats={{ today: 0, scheduled: 0, done: 0 }}
          />
        )}
        {activeScreen === 'login' && (
          <LoginScreen
            onLogin={() => navigateTo('home')}
            onForgotPassword={() => navigateTo('forgotPassword')}
            onSignup={() => navigateTo('signup')}
          />
        )}
        {activeScreen === 'signup' && (
          <SignupScreen onCreateAccount={() => navigateTo('home')} onLogin={() => navigateTo('login')} />
        )}
        {activeScreen === 'forgotPassword' && (
          <ForgotPasswordScreen
            onSendReset={() => navigateTo('resetPassword')}
            onBackToLogin={() => navigateTo('login')}
          />
        )}
        {activeScreen === 'emailSent' && (
          <EmailSentScreen onBackToLogin={() => navigateTo('login')} onResendEmail={() => {}} />
        )}
        {activeScreen === 'resetPassword' && (
          <ResetPasswordScreen
            email="you@remindmee.app"
            onReset={() => navigateTo('login')}
            onBackToLogin={() => navigateTo('login')}
          />
        )}
        {activeScreen === 'tasks' && (
          <TaskListScreen onAddTask={() => navigateTo('newTask')} onNavigate={navigateTo} sections={[]} />
        )}
        {activeScreen === 'newTask' && <NewTaskModalScreen onClose={closeModal} onSave={() => closeModal()} />}
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
