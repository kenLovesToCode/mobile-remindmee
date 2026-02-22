import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { ActionButton } from '../components/ActionButton';
import { AuthBrand } from '../components/ui/AuthBrand';
import { AuthStatusMessage } from '../components/ui/AuthStatusMessage';
import { AuthTextField } from '../components/ui/AuthTextField';
import { AuthTextLink } from '../components/ui/AuthTextLink';
import { spacing, theme } from '../theme/colors';
import { AuthStatus } from './authTypes';

export interface ForgotPasswordScreenProps {
  readonly onSendReset?: (email: string) => void;
  readonly onBackToLogin?: () => void;
  readonly status?: AuthStatus;
  readonly statusMessage?: string;
}

export const ForgotPasswordScreen = ({
  onSendReset,
  onBackToLogin,
  status = 'idle',
  statusMessage,
}: ForgotPasswordScreenProps) => {
  const [email, setEmail] = useState('');
  const isLoading = status === 'loading';

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <AuthBrand title="RemindMee" subtitle="Password recovery" />

        <Text style={styles.headline}>Reset your password</Text>
        <Text style={styles.subtext}>
          Enter your email address and we’ll help you reset your password.
        </Text>

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

          <ActionButton
            label={isLoading ? 'Sending...' : 'Send reset link'}
            onPress={isLoading ? undefined : () => onSendReset?.(email)}
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
});
