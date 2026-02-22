import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { ActionButton } from '../components/ActionButton';
import { AuthBrand } from '../components/ui/AuthBrand';
import { AuthStatusMessage } from '../components/ui/AuthStatusMessage';
import { AuthTextField } from '../components/ui/AuthTextField';
import { AuthTextLink } from '../components/ui/AuthTextLink';
import { radii, spacing, theme } from '../theme/colors';
import { AuthStatus } from './authTypes';

export interface ResetPasswordScreenProps {
  readonly email: string;
  readonly onReset?: (email: string, password: string, confirmPassword: string) => void;
  readonly onBackToLogin?: () => void;
  readonly status?: AuthStatus;
  readonly statusMessage?: string;
}

export const ResetPasswordScreen = ({
  email,
  onReset,
  onBackToLogin,
  status = 'idle',
  statusMessage,
}: ResetPasswordScreenProps) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const isLoading = status === 'loading';

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <AuthBrand title="RemindMee" subtitle="Password recovery" />

        <Text style={styles.headline}>Set a new password</Text>
        <Text style={styles.subtext}>Update the password for your account below.</Text>

        <View style={styles.form}>
          <View style={styles.readonlyField}>
            <Text style={styles.readonlyLabel}>Email Address</Text>
            <View style={styles.readonlyValue}>
              <Text style={styles.readonlyText}>{email || 'you@remindmee.app'}</Text>
            </View>
          </View>
          <AuthTextField
            label="New Password"
            placeholder="Enter a new password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            textContentType="password"
          />
          <AuthTextField
            label="Confirm Password"
            placeholder="Re-enter new password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            textContentType="password"
          />

          <ActionButton
            label={isLoading ? 'Updating...' : 'Update Password'}
            onPress={isLoading ? undefined : () => onReset?.(email, password, confirmPassword)}
            style={isLoading ? styles.buttonLoading : undefined}
          />

          <AuthTextLink label="Back to Log In" onPress={onBackToLogin} align="center" />
          <AuthStatusMessage status={status} message={statusMessage} align="center" />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.xxxl,
    paddingBottom: spacing.xxxl,
  },
  headline: {
    fontSize: 26,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  subtext: {
    marginTop: spacing.sm,
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  form: {
    marginTop: spacing.xxl,
  },
  buttonLoading: {
    opacity: 0.7,
  },
  readonlyField: {
    marginBottom: spacing.lg,
  },
  readonlyLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginBottom: spacing.sm,
  },
  readonlyValue: {
    height: 52,
    borderRadius: radii.md,
    backgroundColor: theme.colors.surfaceSoft,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
  },
  readonlyText: {
    fontSize: 14,
    color: theme.colors.textPrimary,
  },
});
