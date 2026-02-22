import { Animated, Dimensions, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useMemo, useRef, useState } from 'react';

import { BottomNav } from '../components/BottomNav';
import { ScreenScrollView } from '../components/layout/ScreenScrollView';
import { TaskRow } from '../components/TaskRow';
import { AppIcon } from '../components/ui/AppIcon';
import { ScreenKey } from '../data/mockData';
import { Task, TaskPriority } from '../data/tasks/models';
import { palette, radii, spacing, theme } from '../theme/colors';

export interface TaskListScreenProps {
  readonly onAddTask?: () => void;
  readonly onNavigate?: (screen: ScreenKey) => void;
  readonly onEditTask?: (taskId: string) => void;
  readonly onCompleteTask?: (taskId: string) => void;
  readonly onReactivateTask?: (taskId: string) => void;
  readonly onDeleteTask?: (taskId: string) => void;
  readonly sections?: Array<{
    readonly title: string;
    readonly countLabel: string;
    readonly accent: 'danger' | 'primary';
    readonly tasks: Task[];
  }>;
  readonly upcomingTasks?: Task[];
  readonly completedTasks?: Task[];
}

const HEADER_ICON_SIZE = 18;
const FAB_ICON_SIZE = 22;
const noop = () => {};
type TaskTab = 'today' | 'upcoming' | 'completed';
const SHEET_CLOSE_DURATION = 180;
const SHEET_MAX_HEIGHT = 0.6;

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

const canDeleteTask = (task: Task) => {
  if (task.isCompleted) {
    return false;
  }
  const date = new Date(task.scheduledAt);
  const now = new Date();
  const isToday =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();
  return date.getTime() >= now.getTime() || isToday;
};

const formatDeleteDetails = (task: Task) => {
  const date = new Date(task.scheduledAt);
  const dateLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const timeLabel = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  const description = task.description?.trim() ? task.description : '(none)';
  return `Title: ${task.title}\nDate: ${dateLabel}\nTime: ${timeLabel}\nPriority: ${priorityLabel[task.priority]}\nDescription: ${description}`;
};

export const TaskListScreen = ({
  onAddTask,
  onNavigate,
  onEditTask,
  onCompleteTask,
  onReactivateTask,
  onDeleteTask,
  sections = [],
  upcomingTasks = [],
  completedTasks = [],
}: TaskListScreenProps) => {
  const [activeTab, setActiveTab] = useState<TaskTab>('today');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null);
  const deleteTranslateY = useRef(new Animated.Value(0)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const screenHeight = useMemo(() => Dimensions.get('window').height, []);

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

  const completedSections = useMemo(() => {
    if (completedTasks.length === 0) {
      return [];
    }
    return [
      {
        title: 'Completed',
        countLabel: `${completedTasks.length} task${completedTasks.length === 1 ? '' : 's'}`,
        accent: 'primary' as const,
        tasks: completedTasks,
      },
    ];
  }, [completedTasks]);

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const matchesQuery = (task: Task) => {
    if (!normalizedQuery) {
      return true;
    }
    return task.title.toLowerCase().includes(normalizedQuery);
  };

  const filteredSections = useMemo(() => {
    if (activeTab !== 'today') {
      return [];
    }
    return sections
      .map((section) => ({ ...section, tasks: section.tasks.filter(matchesQuery) }))
      .filter((section) => section.tasks.length > 0);
  }, [activeTab, sections, normalizedQuery]);

  const filteredUpcomingSections = useMemo(() => {
    if (activeTab !== 'upcoming') {
      return [];
    }
    const filteredTasks = upcomingTasks.filter(matchesQuery);
    if (filteredTasks.length === 0) {
      return [];
    }
    return [
      {
        title: 'Upcoming',
        countLabel: `${filteredTasks.length} task${filteredTasks.length === 1 ? '' : 's'}`,
        accent: 'primary' as const,
        tasks: filteredTasks,
      },
    ];
  }, [activeTab, upcomingTasks, normalizedQuery]);

  const filteredCompletedSections = useMemo(() => {
    if (activeTab !== 'completed') {
      return [];
    }
    const filteredTasks = completedTasks.filter(matchesQuery);
    if (filteredTasks.length === 0) {
      return [];
    }
    return [
      {
        title: 'Completed',
        countLabel: `${filteredTasks.length} task${filteredTasks.length === 1 ? '' : 's'}`,
        accent: 'primary' as const,
        tasks: filteredTasks,
      },
    ];
  }, [activeTab, completedTasks, normalizedQuery]);

  const activeSections =
    activeTab === 'today'
      ? filteredSections
      : activeTab === 'upcoming'
        ? filteredUpcomingSections
        : filteredCompletedSections;

  const openDeleteSheet = (task: Task) => {
    deleteTranslateY.setValue(screenHeight);
    overlayOpacity.setValue(0);
    setDeleteTarget(task);
    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: 140,
        useNativeDriver: true,
      }),
      Animated.timing(deleteTranslateY, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeDeleteSheet = () => {
    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(deleteTranslateY, {
        toValue: screenHeight,
        duration: SHEET_CLOSE_DURATION,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setDeleteTarget(null);
      overlayOpacity.setValue(0);
    });
  };

  const confirmDelete = async () => {
    if (!deleteTarget || !onDeleteTask) {
      return;
    }
    await onDeleteTask(deleteTarget.id);
    closeDeleteSheet();
  };

  return (
    <View style={styles.container}>
      <ScreenScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        basePaddingTop={spacing.xxxl}
      >
        <View style={styles.header}>
          {isSearchOpen ? (
            <View style={styles.searchField}>
              <AppIcon name="search" size={HEADER_ICON_SIZE} color={theme.colors.textSecondary} />
              <TextInput
                placeholder="Search tasks"
                placeholderTextColor={theme.colors.textSecondary}
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoCorrect={false}
                autoCapitalize="none"
                returnKeyType="search"
              />
            </View>
          ) : (
            <Text style={styles.title}>Tasks</Text>
          )}
          <View style={styles.headerActions}>
            <Pressable
              style={[styles.headerIcon, styles.headerIconSpacing]}
              onPress={() => {
                setIsSearchOpen((prev) => !prev);
                if (isSearchOpen) {
                  setSearchQuery('');
                }
              }}
            >
              <AppIcon name={isSearchOpen ? 'x' : 'search'} size={HEADER_ICON_SIZE} color={theme.colors.textSecondary} />
            </Pressable>
            <View style={styles.headerIcon}>
              <AppIcon name="filter" size={HEADER_ICON_SIZE} color={theme.colors.textSecondary} />
            </View>
          </View>
        </View>

        <View style={styles.tabs}>
          <Pressable
            onPress={() => {
              setActiveTab('today');
            }}
          >
            <Text style={[styles.tab, activeTab === 'today' && styles.tabActive]}>Today</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              setActiveTab('upcoming');
            }}
          >
            <Text style={[styles.tab, activeTab === 'upcoming' && styles.tabActive]}>Upcoming</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              setActiveTab('completed');
            }}
          >
            <Text style={[styles.tab, activeTab === 'completed' && styles.tabActive]}>Completed</Text>
          </Pressable>
        </View>

        {activeSections.length === 0 ? (
          <Text style={styles.emptyText}>
            {normalizedQuery
              ? 'No matching tasks.'
              : activeTab === 'today'
                ? 'No tasks today. Tap the + button to add one.'
                : activeTab === 'upcoming'
                  ? 'No upcoming tasks yet.'
                  : 'No completed tasks yet.'}
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
                      priority={task.priority}
                      checked={task.isCompleted}
                      onToggleComplete={
                        task.isCompleted
                          ? onReactivateTask
                            ? () => onReactivateTask(task.id)
                            : undefined
                          : onCompleteTask
                            ? () => onCompleteTask(task.id)
                            : undefined
                      }
                      onEdit={onEditTask ? () => onEditTask(task.id) : undefined}
                      onDelete={onDeleteTask ? () => openDeleteSheet(task) : undefined}
                      canDelete={canDeleteTask(task)}
                    />
                  </View>
                ))}
              </View>
            </View>
          ))
        )}
      </ScreenScrollView>

      <Pressable style={styles.fab} onPress={onAddTask}>
        <AppIcon name="plus" size={FAB_ICON_SIZE} color="#ffffff" />
      </Pressable>

      {deleteTarget ? (
        <>
          <Animated.View style={[styles.sheetOverlay, { opacity: overlayOpacity }]} />
          <Pressable style={styles.sheetOverlayPressable} onPress={closeDeleteSheet} />
          <Animated.View
            style={[
              styles.deleteSheet,
              { height: screenHeight * SHEET_MAX_HEIGHT, transform: [{ translateY: deleteTranslateY }] },
            ]}
          >
            <View style={styles.sheetHandle} />
            <View style={styles.deleteHeader}>
              <Text style={styles.deleteTitle}>Delete Task</Text>
              <Text style={styles.deleteSubtitle}>This action cannot be undone.</Text>
            </View>
            <View style={styles.deleteCard}>
              <Text style={styles.deleteLabel}>Title</Text>
              <Text style={styles.deleteValue}>{deleteTarget.title}</Text>

              <Text style={styles.deleteLabel}>Date</Text>
              <Text style={styles.deleteValue}>
                {new Date(deleteTarget.scheduledAt).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </Text>

              <Text style={styles.deleteLabel}>Time</Text>
              <Text style={styles.deleteValue}>
                {new Date(deleteTarget.scheduledAt).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </Text>

              <Text style={styles.deleteLabel}>Priority</Text>
              <Text style={styles.deleteValue}>{priorityLabel[deleteTarget.priority]}</Text>

              <Text style={styles.deleteLabel}>Description</Text>
              <Text style={styles.deleteValue}>
                {deleteTarget.description?.trim() ? deleteTarget.description : '(none)'}
              </Text>
            </View>

            <View style={styles.deleteActions}>
              <Pressable style={styles.cancelButton} onPress={closeDeleteSheet}>
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.deleteButton} onPress={confirmDelete}>
                <Text style={styles.deleteText}>Delete</Text>
              </Pressable>
            </View>
          </Animated.View>
        </>
      ) : null}

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
  searchField: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceSoft,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginRight: spacing.md,
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing.sm,
    color: theme.colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
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
  sheetOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(6, 11, 20, 0.7)',
  },
  sheetOverlayPressable: {
    ...StyleSheet.absoluteFillObject,
  },
  deleteSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 48,
    height: 6,
    borderRadius: radii.pill,
    backgroundColor: theme.colors.textSecondary,
    marginBottom: spacing.lg,
  },
  deleteHeader: {
    marginBottom: spacing.lg,
  },
  deleteTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  deleteSubtitle: {
    marginTop: spacing.xs,
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  deleteCard: {
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surfaceSoft,
    padding: spacing.lg,
  },
  deleteLabel: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: spacing.md,
  },
  deleteValue: {
    marginTop: spacing.xs,
    fontSize: 13,
    color: theme.colors.textPrimary,
  },
  deleteActions: {
    flexDirection: 'row',
    marginTop: spacing.xl,
  },
  cancelButton: {
    flex: 1,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginRight: spacing.md,
  },
  cancelText: {
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  deleteButton: {
    flex: 1,
    borderRadius: radii.md,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.4)',
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  deleteText: {
    color: '#ef4444',
    fontWeight: '700',
  },
});
