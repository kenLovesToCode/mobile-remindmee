import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { ActionButton } from '../components/ActionButton';
import { AuthBrand } from '../components/ui/AuthBrand';
import { AuthStatusMessage } from '../components/ui/AuthStatusMessage';
import { AuthTextField } from '../components/ui/AuthTextField';
import { radii, spacing, theme } from '../theme/colors';
import { AuthStatus } from './authTypes';

export interface SignupScreenProps {
  readonly onCreateAccount?: () => void;
  readonly onLogin?: () => void;
  readonly status?: AuthStatus;
  readonly statusMessage?: string;
}

export const SignupScreen = ({
  onCreateAccount,
  onLogin,
  status = 'idle',
  statusMessage,
}: SignupScreenProps) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const isLoading = status === 'loading';

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <AuthBrand title="RemindMee" subtitle="Plan smarter, live lighter." />

        <Text style={styles.headline}>Create your account</Text>
        <Text style={styles.subtext}>Start organizing your life in minutes.</Text>

        <View style={styles.form}>
          <AuthTextField
            label="Full Name"
            placeholder="Your name"
            value={fullName}
            onChangeText={setFullName}
            textContentType="name"
            autoCapitalize="words"
          />
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
            placeholder="Create a password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            textContentType="password"
          />
          <AuthTextField
            label="Confirm Password"
            placeholder="Re-enter password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            textContentType="password"
          />

          <ActionButton
            label={isLoading ? 'Creating Account...' : 'Create Account'}
            onPress={isLoading ? undefined : onCreateAccount}
            style={isLoading ? styles.buttonLoading : undefined}
          />

          <Text style={styles.terms}>
            By signing up you agree to the Terms and Privacy.
          </Text>
          <AuthStatusMessage status={status} message={statusMessage} align="center" />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <Text style={styles.footerLink} onPress={onLogin}>
            Log in
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
  terms: {
    marginTop: spacing.md,
    fontSize: 11,
    color: theme.colors.textSecondary,
    textAlign: 'center',
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
