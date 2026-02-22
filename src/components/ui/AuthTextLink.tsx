import { Pressable, StyleSheet, Text } from 'react-native';

import { spacing, theme } from '../../theme/colors';

export interface AuthTextLinkProps {
  readonly label: string;
  readonly onPress?: () => void;
  readonly align?: 'left' | 'center';
}

export const AuthTextLink = ({ label, onPress, align = 'left' }: AuthTextLinkProps) => {
  return (
    <Pressable style={[styles.container, align === 'center' && styles.center]} onPress={onPress}>
      <Text style={styles.text}>{label}</Text>
    </Pressable>
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
    fontWeight: '600',
    color: theme.colors.primary,
  },
});
