import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { BottomNav } from '../components/BottomNav';
import { TaskRow } from '../components/TaskRow';
import { ProjectCard } from '../components/ProjectCard';
import { AppIcon } from '../components/ui/AppIcon';
import { taskSections, quickProjects, ScreenKey } from '../data/mockData';
import { palette, radii, spacing, theme } from '../theme/colors';

export interface TaskListScreenProps {
  readonly onAddTask?: () => void;
  readonly onNavigate?: (screen: ScreenKey) => void;
}

const HEADER_ICON_SIZE = 18;
const FAB_ICON_SIZE = 22;
const noop = () => {};

export const TaskListScreen = ({ onAddTask, onNavigate }: TaskListScreenProps) => {
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
          <Text style={[styles.tab, styles.tabActive]}>Today</Text>
          <Text style={styles.tab}>Upcoming</Text>
          <Text style={styles.tab}>Projects</Text>
        </View>

        {taskSections.map((section) => (
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
                  key={task.title}
                  style={[styles.taskItem, index === section.tasks.length - 1 && styles.taskItemLast]}
                >
                  <TaskRow title={task.title} meta={task.meta} checked={task.checked} />
                </View>
              ))}
            </View>
          </View>
        ))}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitleMuted}>Quick Projects</Text>
            <Text style={styles.sectionCount}>View all</Text>
          </View>
          <View style={styles.projectGrid}>
            {quickProjects.map((project, index) => (
              <View
                key={project.title}
                style={[styles.projectItem, index === quickProjects.length - 1 && styles.projectItemLast]}
              >
                <ProjectCard title={project.title} count={project.count} accent={project.accent} />
              </View>
            ))}
          </View>
        </View>
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
  sectionTitleMuted: {
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
  projectGrid: {
    flexDirection: 'row',
  },
  projectItem: {
    flex: 1,
    marginRight: spacing.md,
  },
  projectItemLast: {
    marginRight: 0,
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
