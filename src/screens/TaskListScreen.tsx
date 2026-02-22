import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useMemo, useState } from 'react';

import { BottomNav } from '../components/BottomNav';
import { TaskRow } from '../components/TaskRow';
import { AppIcon } from '../components/ui/AppIcon';
import { ScreenKey } from '../data/mockData';
import { Task, TaskPriority } from '../data/tasks/models';
import { palette, radii, spacing, theme } from '../theme/colors';

export interface TaskListScreenProps {
  readonly onAddTask?: () => void;
  readonly onNavigate?: (screen: ScreenKey) => void;
  readonly sections?: Array<{
    readonly title: string;
    readonly countLabel: string;
    readonly accent: 'danger' | 'primary';
    readonly tasks: Task[];
  }>;
  readonly upcomingTasks?: Task[];
}

const HEADER_ICON_SIZE = 18;
const FAB_ICON_SIZE = 22;
const noop = () => {};
type TaskTab = 'today' | 'upcoming';

const priorityLabel: Record<TaskPriority, string> = {
  High: 'High',
  Medium: 'Medium',
  Low: 'Low',
};

const formatTaskMeta = (task: Task) => {
  const date = new Date(task.scheduledAt);
  const now = new Date();
  const isToday =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();
  const dayLabel = isToday
    ? 'Today'
    : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const timeLabel = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  return `${dayLabel} • ${timeLabel} • ${priorityLabel[task.priority]}`;
};

export const TaskListScreen = ({
  onAddTask,
  onNavigate,
  sections = [],
  upcomingTasks = [],
}: TaskListScreenProps) => {
  const [activeTab, setActiveTab] = useState<TaskTab>('today');

  const upcomingSections = useMemo(() => {
    if (upcomingTasks.length === 0) {
      return [];
    }
    return [
      {
        title: 'Upcoming',
        countLabel: `${upcomingTasks.length} task${upcomingTasks.length === 1 ? '' : 's'}`,
        accent: 'primary' as const,
        tasks: upcomingTasks,
      },
    ];
  }, [upcomingTasks]);

  const activeSections = activeTab === 'today' ? sections : upcomingSections;
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Tasks</Text>
          <View style={styles.headerActions}>
            <View style={[styles.headerIcon, styles.headerIconSpacing]}>
              <AppIcon name="search" size={HEADER_ICON_SIZE} color={theme.colors.textSecondary} />
            </View>
            <View style={styles.headerIcon}>
              <AppIcon name="filter" size={HEADER_ICON_SIZE} color={theme.colors.textSecondary} />
            </View>
          </View>
        </View>

        <View style={styles.tabs}>
          <Pressable onPress={() => setActiveTab('today')}>
            <Text style={[styles.tab, activeTab === 'today' && styles.tabActive]}>Today</Text>
          </Pressable>
          <Pressable onPress={() => setActiveTab('upcoming')}>
            <Text style={[styles.tab, activeTab === 'upcoming' && styles.tabActive]}>Upcoming</Text>
          </Pressable>
        </View>

        {activeSections.length === 0 ? (
          <Text style={styles.emptyText}>
            {activeTab === 'today'
              ? 'No tasks today. Tap the + button to add one.'
              : 'No upcoming tasks yet.'}
          </Text>
        ) : (
          activeSections.map((section) => (
            <View key={section.title} style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text
                  style={[
                    styles.sectionTitle,
                    section.accent === 'danger' && { color: palette.red500 },
                    section.accent === 'primary' && { color: theme.colors.primary },
                  ]}
                >
                  {section.title}
                </Text>
                <Text style={styles.sectionCount}>{section.countLabel}</Text>
              </View>
              <View style={styles.taskList}>
                {section.tasks.map((task, index) => (
                  <View
                    key={task.id}
                    style={[styles.taskItem, index === section.tasks.length - 1 && styles.taskItemLast]}
                  >
                    <TaskRow
                      title={task.title}
                      meta={formatTaskMeta(task)}
                      checked={task.isCompleted}
                    />
                  </View>
                ))}
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <Pressable style={styles.fab} onPress={onAddTask}>
        <AppIcon name="plus" size={FAB_ICON_SIZE} color="#ffffff" />
      </Pressable>

      <BottomNav active="tasks" onNavigate={onNavigate ?? noop} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.xxxl,
    paddingBottom: 140,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.colors.textPrimary,
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surfaceSoft,
  },
  headerIconSpacing: {
    marginRight: spacing.md,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingBottom: spacing.sm,
  },
  tab: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginRight: spacing.xxl,
  },
  tabActive: {
    color: theme.colors.primary,
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.primary,
    paddingBottom: spacing.sm,
  },
  section: {
    marginTop: spacing.xxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: theme.colors.textSecondary,
  },
  sectionCount: {
    fontSize: 11,
    color: theme.colors.textSecondary,
  },
  taskList: {},
  taskItem: {
    marginBottom: spacing.sm,
  },
  taskItemLast: {
    marginBottom: 0,
  },
  emptyText: {
    marginTop: spacing.xl,
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  fab: {
    position: 'absolute',
    right: spacing.xxl,
    bottom: 120,
    width: 56,
    height: 56,
    borderRadius: radii.pill,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: palette.primary,
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
  },
});
