import { StyleSheet, Text, View } from 'react-native';

import { radii, spacing, theme } from '../theme/colors';

export interface StatCardProps {
  readonly label: string;
  readonly value: string;
  readonly accent: 'primary' | 'neutral';
}

export const StatCard = ({ label, value, accent }: StatCardProps) => {
  const accentColor = accent === 'primary' ? theme.colors.primary : theme.colors.textSecondary;
  const backgroundColor = accent === 'primary' ? 'rgba(37, 140, 244, 0.15)' : 'rgba(148, 163, 184, 0.1)';

  return (
    <View style={[styles.card, { backgroundColor, borderColor: accentColor + '33' }]}>
      <Text style={[styles.value, { color: accent === 'primary' ? theme.colors.primary : theme.colors.textPrimary }]}>
        {value}
      </Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: radii.md,
    padding: spacing.lg,
    borderWidth: 1,
  },
  value: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: spacing.xs,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
});
