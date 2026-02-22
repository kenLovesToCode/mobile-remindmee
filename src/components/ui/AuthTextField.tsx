import { StyleSheet, Text, TextInput, View } from 'react-native';

import { radii, spacing, theme } from '../../theme/colors';

export interface AuthTextFieldProps {
  readonly label: string;
  readonly placeholder?: string;
  readonly value: string;
  readonly onChangeText: (value: string) => void;
  readonly secureTextEntry?: boolean;
  readonly keyboardType?: 'default' | 'email-address';
  readonly textContentType?: 'emailAddress' | 'password' | 'name';
  readonly autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}

export const AuthTextField = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType = 'default',
  textContentType,
  autoCapitalize = 'none',
}: AuthTextFieldProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textSecondary}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        textContentType={textContentType}
        autoCapitalize={autoCapitalize}
        style={styles.input}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginBottom: spacing.sm,
  },
  input: {
    height: 52,
    borderRadius: radii.md,
    backgroundColor: theme.colors.surfaceSoft,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: spacing.lg,
    color: theme.colors.textPrimary,
  },
});
