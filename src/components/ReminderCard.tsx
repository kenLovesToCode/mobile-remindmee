import { StyleSheet, Text, View } from 'react-native';

import { palette, radii, spacing, theme } from '../theme/colors';

export interface ReminderCardProps {
  readonly title: string;
  readonly time: string;
  readonly priority: string;
  readonly accent: 'red' | 'orange' | 'primary' | 'green';
}

const accentMap = {
  red: palette.red500,
  orange: palette.orange500,
  primary: palette.primary,
  green: palette.green500,
} as const;

export const ReminderCard = ({ title, time, priority, accent }: ReminderCardProps) => {
  const accentColor = accentMap[accent];

  return (
    <View style={styles.card}>
      <View style={[styles.iconBadge, { backgroundColor: accentColor + '22' }]}
      >
        <Text style={[styles.iconText, { color: accentColor }]}>{title.slice(0, 1)}</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.time}>{time}</Text>
      </View>
      <View style={[styles.priorityPill, { backgroundColor: accentColor + '22' }]}
      >
        <Text style={[styles.priorityText, { color: accentColor }]}>{priority}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: spacing.lg,
  },
  iconBadge: {
    width: 48,
    height: 48,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  iconText: {
    fontSize: 18,
    fontWeight: '700',
  },
  body: {
    flex: 1,
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  time: {
    marginTop: spacing.xs,
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  priorityPill: {
    borderRadius: radii.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    marginLeft: spacing.md,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
});
