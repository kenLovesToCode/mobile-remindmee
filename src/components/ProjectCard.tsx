import { StyleSheet, Text, View } from 'react-native';

import { palette, radii, spacing, theme } from '../theme/colors';

export interface ProjectCardProps {
  readonly title: string;
  readonly count: string;
  readonly accent: 'primary' | 'orange';
}

const accentMap = {
  primary: palette.primary,
  orange: palette.orange500,
} as const;

export const ProjectCard = ({ title, count, accent }: ProjectCardProps) => {
  const accentColor = accentMap[accent];

  return (
    <View style={[styles.card, { borderColor: accentColor + '33', backgroundColor: accentColor + '1A' }]}>
      <Text style={[styles.icon, { color: accentColor }]}>{title.slice(0, 1)}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.count}>{count}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: radii.md,
    borderWidth: 1,
    padding: spacing.lg,
  },
  icon: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  count: {
    marginTop: spacing.xs,
    fontSize: 11,
    color: theme.colors.textSecondary,
  },
});
