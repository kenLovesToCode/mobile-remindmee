import { StyleSheet, Text, View } from 'react-native';

import { spacing, theme } from '../../theme/colors';

export interface AuthStatusMessageProps {
  readonly status?: 'idle' | 'loading' | 'error' | 'empty';
  readonly message?: string;
  readonly align?: 'left' | 'center';
}

export const AuthStatusMessage = ({
  status = 'idle',
  message,
  align = 'left',
}: AuthStatusMessageProps) => {
  if (status === 'idle') {
    return null;
  }

  const text =
    message ??
    (status === 'loading'
      ? 'Loading...'
      : status === 'empty'
        ? 'Nothing here yet.'
        : 'Something went wrong.');

  return (
    <View style={[styles.container, align === 'center' && styles.center]}>
      <Text style={[styles.text, status === 'error' && styles.error]}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.md,
  },
  center: {
    alignItems: 'center',
  },
  text: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  error: {
    color: theme.colors.danger,
  },
});
