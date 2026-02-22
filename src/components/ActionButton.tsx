import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';

import { radii, spacing, theme } from '../theme/colors';

export interface ActionButtonProps {
  readonly label: string;
  readonly onPress?: () => void;
  readonly variant?: 'primary' | 'secondary' | 'ghost';
  readonly style?: ViewStyle;
}

export const ActionButton = ({ label, onPress, variant = 'primary', style }: ActionButtonProps) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        variant === 'primary' && styles.primary,
        variant === 'secondary' && styles.secondary,
        variant === 'ghost' && styles.ghost,
        pressed && styles.pressed,
        style,
      ]}
    >
      <Text
        style={[
          styles.label,
          variant === 'secondary' && styles.secondaryLabel,
          variant === 'ghost' && styles.ghostLabel,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.xl,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: theme.colors.primary,
  },
  secondary: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  pressed: {
    opacity: 0.85,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
  secondaryLabel: {
    color: theme.colors.textPrimary,
  },
  ghostLabel: {
    color: theme.colors.textSecondary,
  },
});
