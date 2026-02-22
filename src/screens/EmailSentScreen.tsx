import { StyleSheet, Text, View } from 'react-native';

import { ActionButton } from '../components/ActionButton';
import { AuthBrand } from '../components/ui/AuthBrand';
import { AuthStatusMessage } from '../components/ui/AuthStatusMessage';
import { AuthTextLink } from '../components/ui/AuthTextLink';
import { AppIcon } from '../components/ui/AppIcon';
import { radii, spacing, theme } from '../theme/colors';
import { AuthStatus } from './authTypes';

export interface EmailSentScreenProps {
  readonly onBackToLogin?: () => void;
  readonly onResendEmail?: () => void;
  readonly status?: AuthStatus;
  readonly statusMessage?: string;
}

const ICON_SIZE = 26;

export const EmailSentScreen = ({
  onBackToLogin,
  onResendEmail,
  status = 'idle',
  statusMessage,
}: EmailSentScreenProps) => {
  const isLoading = status === 'loading';

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <AuthBrand title="RemindMee" subtitle="Password recovery" />

        <View style={styles.iconBadge}>
          <AppIcon name="mail" size={ICON_SIZE} color={theme.colors.primary} />
        </View>

        <Text style={styles.headline}>Check your email</Text>
        <Text style={styles.subtext}>
          We’ve sent a password reset link to your inbox. Follow the instructions to continue.
        </Text>

        <ActionButton
          label={isLoading ? 'Opening...' : 'Back to Log In'}
          onPress={isLoading ? undefined : onBackToLogin}
          style={isLoading ? styles.buttonLoading : undefined}
        />

        <AuthTextLink label="Resend email" onPress={onResendEmail} align="center" />
        <Text style={styles.helperText}>Didn’t receive it? Check spam or try another email.</Text>
        <AuthStatusMessage status={status} message={statusMessage} align="center" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.xxxl,
  },
  iconBadge: {
    alignSelf: 'center',
    width: 72,
    height: 72,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surfaceSoft,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: spacing.xl,
  },
  headline: {
    fontSize: 26,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    textAlign: 'center',
  },
  subtext: {
    marginTop: spacing.sm,
    fontSize: 13,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xxl,
  },
  helperText: {
    marginTop: spacing.md,
    fontSize: 11,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  buttonLoading: {
    opacity: 0.7,
  },
});
