import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { ActionButton } from '../components/ActionButton';
import { AuthBrand } from '../components/ui/AuthBrand';
import { AuthStatusMessage } from '../components/ui/AuthStatusMessage';
import { AuthTextField } from '../components/ui/AuthTextField';
import { AuthTextLink } from '../components/ui/AuthTextLink';
import { radii, spacing, theme } from '../theme/colors';
import { AuthStatus } from './authTypes';

export interface LoginCredentials {
  readonly email: string;
  readonly password: string;
}

export interface LoginScreenProps {
  readonly onLogin?: (input: LoginCredentials) => void;
  readonly onForgotPassword?: () => void;
  readonly onSignup?: () => void;
  readonly status?: AuthStatus;
  readonly statusMessage?: string;
}

export const LoginScreen = ({
  onLogin,
  onForgotPassword,
  onSignup,
  status = 'idle',
  statusMessage,
}: LoginScreenProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const isLoading = status === 'loading';

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <AuthBrand title="RemindMee" subtitle="Personal reminders, simplified." />

        <Text style={styles.headline}>Welcome back</Text>
        <Text style={styles.subtext}>Sign in to manage your tasks and daily flow.</Text>

        <View style={styles.form}>
          <AuthTextField
            label="Email Address"
            placeholder="you@remindmee.app"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            textContentType="emailAddress"
            autoCapitalize="none"
          />
          <AuthTextField
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            textContentType="password"
          />

          <ActionButton
            label={isLoading ? 'Logging In...' : 'Log In'}
            onPress={
              isLoading
                ? undefined
                : () =>
                    onLogin?.({
                      email,
                      password,
                    })
            }
            style={isLoading ? styles.buttonLoading : undefined}
          />

          <AuthTextLink label="Forgot password?" onPress={onForgotPassword} align="center" />
          <AuthStatusMessage status={status} message={statusMessage} align="center" />
        </View>

        <View style={styles.dividerRow}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.divider} />
        </View>

        <View style={styles.socialPlaceholder}>
          <Text style={styles.socialText}>Social login coming soon</Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don’t have an account?</Text>
          <Text style={styles.footerLink} onPress={onSignup}>
            Sign up
          </Text>
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
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xxl,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.border,
  },
  dividerText: {
    marginHorizontal: spacing.md,
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  socialPlaceholder: {
    marginTop: spacing.lg,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surfaceSoft,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  socialText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  footer: {
    marginTop: spacing.xxxl,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  footerLink: {
    marginLeft: spacing.xs,
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.primary,
  },
});
