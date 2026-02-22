import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppIcon } from './ui/AppIcon';
import { palette, radii, spacing, theme } from '../theme/colors';
import { TaskPriority } from '../data/tasks/models';

export interface TaskRowProps {
  readonly title: string;
  readonly meta: string;
  readonly priority: TaskPriority;
  readonly checked?: boolean;
  readonly onEdit?: () => void;
  readonly onDelete?: () => void;
  readonly canDelete?: boolean;
}

const ACTION_ICON_SIZE = 16;
const PRIORITY_DOT_SIZE = 12;

const priorityDotColor: Record<TaskPriority, string> = {
  High: palette.red500,
  Medium: palette.amber500,
  Low: palette.green500,
};

export const TaskRow = ({
  title,
  meta,
  priority,
  checked = false,
  onEdit,
  onDelete,
  canDelete = true,
}: TaskRowProps) => {
  return (
    <View style={styles.row}>
      <View style={[styles.priorityDot, { backgroundColor: priorityDotColor[priority] }]} />
      <View style={styles.body}>
        <Text style={[styles.title, checked && styles.titleChecked]} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.meta}>{meta}</Text>
      </View>
      <View style={styles.actions}>
        <Pressable
          style={({ pressed }) => [styles.actionButton, pressed && styles.actionButtonPressed]}
          onPress={onEdit}
          disabled={!onEdit}
          hitSlop={8}
        >
          <AppIcon name="edit" size={ACTION_ICON_SIZE} color={theme.colors.textSecondary} />
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.actionButton,
            !canDelete && styles.actionButtonDisabled,
            pressed && styles.actionButtonPressed,
          ]}
          onPress={canDelete ? onDelete : undefined}
          disabled={!onDelete || !canDelete}
          hitSlop={8}
        >
          <AppIcon name="trash" size={ACTION_ICON_SIZE} color={theme.colors.textSecondary} />
        </Pressable>
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
  priorityDot: {
    width: PRIORITY_DOT_SIZE,
    height: PRIORITY_DOT_SIZE,
    borderRadius: radii.pill,
    marginRight: spacing.md,
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
    alignItems: 'center',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.xs,
  },
  actionButtonPressed: {
    opacity: 0.7,
  },
  actionButtonDisabled: {
    opacity: 0.4,
  },
});
