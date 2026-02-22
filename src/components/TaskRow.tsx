import { StyleSheet, Text, View } from 'react-native';

import { AppIcon } from './ui/AppIcon';
import { radii, spacing, theme } from '../theme/colors';

export interface TaskRowProps {
  readonly title: string;
  readonly meta: string;
  readonly checked?: boolean;
}

const CHECK_ICON_SIZE = 12;

export const TaskRow = ({ title, meta, checked = false }: TaskRowProps) => {
  return (
    <View style={styles.row}>
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked ? <AppIcon name="check" size={CHECK_ICON_SIZE} color="#ffffff" /> : null}
      </View>
      <View style={styles.body}>
        <Text style={[styles.title, checked && styles.titleChecked]} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.meta}>{meta}</Text>
      </View>
      <View style={styles.actions}>
        <Text style={styles.actionText}>edit</Text>
        <Text style={styles.actionText}>del</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radii.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: spacing.lg,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: radii.pill,
    borderWidth: 2,
    borderColor: theme.colors.textSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  checkboxChecked: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  body: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  titleChecked: {
    color: theme.colors.textSecondary,
    textDecorationLine: 'line-through',
  },
  meta: {
    marginTop: spacing.xs,
    fontSize: 11,
    color: theme.colors.textSecondary,
  },
  actions: {
    flexDirection: 'row',
  },
  actionText: {
    color: theme.colors.textSecondary,
    fontSize: 11,
    marginLeft: spacing.sm,
  },
});
