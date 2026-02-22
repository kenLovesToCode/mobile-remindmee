import { StyleSheet, Text, View } from 'react-native';

import { palette, radii, spacing, theme } from '../theme/colors';

export interface TimelineItemProps {
  readonly title: string;
  readonly time: string;
  readonly isPrimary?: boolean;
  readonly isLast?: boolean;
}

export const TimelineItem = ({ title, time, isPrimary = false, isLast = false }: TimelineItemProps) => {
  return (
    <View style={styles.row}>
      <View style={styles.markerColumn}>
        <View
          style={[
            styles.marker,
            isPrimary ? styles.markerPrimary : styles.markerNeutral,
          ]}
        />
        {!isLast ? <View style={styles.line} /> : null}
      </View>
      <View style={styles.body}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.time}>{time}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  markerColumn: {
    width: 20,
    alignItems: 'center',
  },
  marker: {
    width: 12,
    height: 12,
    borderRadius: radii.pill,
    marginTop: 2,
    marginBottom: 6,
  },
  markerPrimary: {
    backgroundColor: theme.colors.primary,
    borderWidth: 4,
    borderColor: 'rgba(37, 140, 244, 0.2)',
  },
  markerNeutral: {
    backgroundColor: palette.slate500,
    borderWidth: 4,
    borderColor: 'rgba(148, 163, 184, 0.15)',
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: theme.colors.border,
  },
  body: {
    paddingLeft: spacing.lg,
    paddingBottom: spacing.xl,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  time: {
    marginTop: spacing.xs,
    fontSize: 11,
    color: theme.colors.textSecondary,
  },
});
