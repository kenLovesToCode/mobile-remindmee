import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ScreenScrollView } from '../components/layout/ScreenScrollView';
import { Task } from '../data/tasks/models';
import { TaskNotification } from '../data/notifications/models';
import { palette, radii, spacing, theme } from '../theme/colors';

export interface NotificationsScreenProps {
  readonly notifications: TaskNotification[];
  readonly tasksById: Record<string, Task>;
  readonly status: 'idle' | 'loading' | 'error' | 'empty';
  readonly error?: string;
  readonly onMarkRead?: (notificationId: string) => void;
  readonly onBack?: () => void;
}

const formatLabel = (dateIso?: string) => {
  if (!dateIso) {
    return '';
  }
  const date = new Date(dateIso);
  return (
    date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) +
    ' • ' +
    date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  );
};

const formatRelative = (dateIso?: string) => {
  if (!dateIso) {
    return '';
  }
  const value = new Date(dateIso).getTime();
  const diffMinutesFloat = (value - Date.now()) / (60 * 1000);
  const diffMinutes =
    diffMinutesFloat >= 0 ? Math.ceil(diffMinutesFloat) : Math.floor(diffMinutesFloat);
  const absMinutes = Math.abs(diffMinutes);
  if (absMinutes < 1) {
    return 'now';
  }
  if (absMinutes < 60) {
    return diffMinutes > 0 ? `in ${absMinutes}m` : `${absMinutes}m ago`;
  }
  const hours = diffMinutes > 0 ? Math.ceil(absMinutes / 60) : Math.floor(absMinutes / 60);
  return diffMinutes > 0 ? `in ${hours}h` : `${hours}h ago`;
};

export const NotificationsScreen = ({
  notifications,
  tasksById,
  status,
  error,
  onMarkRead,
  onBack,
}: NotificationsScreenProps) => {
  return (
    <View style={styles.container}>
      <ScreenScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        basePaddingTop={spacing.xxxl}
      >
        <View style={styles.header}>
          <Pressable
            style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]}
            onPress={onBack}
            disabled={!onBack}
          >
            <Text style={styles.backText}>Back</Text>
          </Pressable>
          <Text style={styles.title}>Notifications</Text>
          <View style={styles.headerSpacer} />
        </View>

        {status === 'loading' ? <Text style={styles.helperText}>Loading notifications...</Text> : null}
        {status === 'error' ? <Text style={styles.helperText}>{error ?? 'Unable to load notifications.'}</Text> : null}
        {status === 'empty' ? <Text style={styles.helperText}>No notifications yet.</Text> : null}

        {status === 'idle'
          ? notifications.map((notification) => {
              const task = tasksById[notification.taskId];
              const isUnread = !notification.readAt;
              return (
                <Pressable
                  key={notification.id}
                  style={({ pressed }) => [
                    styles.card,
                    pressed && styles.cardPressed,
                    isUnread && styles.cardUnread,
                  ]}
                  onPress={onMarkRead ? () => onMarkRead(notification.id) : undefined}
                >
                  <View style={styles.row}>
                    <View style={styles.textColumn}>
                      <Text style={styles.cardTitle} numberOfLines={1}>
                        {task?.title ?? 'Task'}
                      </Text>
                      <Text style={styles.timeValue} numberOfLines={1}>
                        {formatLabel(task?.scheduledAt)}
                      </Text>
                    </View>
                    <View style={styles.metaColumn}>
                      <View style={styles.relativeRow}>
                        <Text style={styles.timeHint} numberOfLines={1}>
                          {formatRelative(task?.scheduledAt)}
                        </Text>
                        {isUnread ? <View style={styles.unreadDot} /> : null}
                      </View>
                    </View>
                  </View>
                </Pressable>
              );
            })
          : null}
      </ScreenScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  backButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radii.pill,
    backgroundColor: theme.colors.surfaceSoft,
  },
  backButtonPressed: {
    opacity: 0.7,
  },
  backText: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  headerSpacer: {
    width: 44,
  },
  content: {
    paddingHorizontal: spacing.xxl,
    paddingBottom: 140,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.colors.textPrimary,
  },
  helperText: {
    color: theme.colors.textSecondary,
    marginBottom: spacing.md,
  },
  card: {
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  cardUnread: {
    borderColor: theme.colors.primary,
  },
  cardPressed: {
    opacity: 0.8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  textColumn: {
    flex: 1,
    marginRight: spacing.md,
  },
  metaColumn: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  timeValue: {
    marginTop: spacing.xs,
    fontSize: 13,
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
  timeHint: {
    fontSize: 11,
    color: theme.colors.textSecondary,
  },
  relativeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  unreadDot: {
    marginLeft: spacing.xs,
    width: 10,
    height: 10,
    borderRadius: radii.pill,
    backgroundColor: palette.red500,
  },
});
