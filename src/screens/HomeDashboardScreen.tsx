import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { SectionHeader } from '../components/SectionHeader';
import { StatCard } from '../components/StatCard';
import { ReminderCard } from '../components/ReminderCard';
import { BottomNav } from '../components/BottomNav';
import { AppIcon } from '../components/ui/AppIcon';
import { dashboardStats, upcomingReminders, userProfile, ScreenKey } from '../data/mockData';
import { palette, radii, spacing, theme } from '../theme/colors';

export interface HomeDashboardScreenProps {
  readonly onAddTask?: () => void;
  readonly onNavigate?: (screen: ScreenKey) => void;
}

const HEADER_ICON_SIZE = 18;
const FAB_ICON_SIZE = 22;
const noop = () => {};

export const HomeDashboardScreen = ({ onAddTask, onNavigate }: HomeDashboardScreenProps) => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>A</Text>
            </View>
            <View>
              <Text style={styles.greeting}>{userProfile.greeting}</Text>
              <Text style={styles.date}>{userProfile.dateLabel}</Text>
            </View>
          </View>
          <Pressable style={styles.iconButton}>
            <AppIcon name="bell" size={HEADER_ICON_SIZE} color={theme.colors.textSecondary} />
          </Pressable>
        </View>

        <Text style={styles.sectionEyebrow}>Dashboard</Text>
        <View style={styles.statsRow}>
          {dashboardStats.map((stat, index) => (
            <View
              key={stat.label}
              style={[styles.statItem, index === dashboardStats.length - 1 && styles.statItemLast]}
            >
              <StatCard label={stat.label} value={stat.value} accent={stat.accent} />
            </View>
          ))}
        </View>

        <View style={styles.sectionSpacer}>
          <SectionHeader title="Upcoming Reminders" actionLabel="See all" />
          <View style={styles.cardList}>
            {upcomingReminders.map((item, index) => (
              <View
                key={item.title}
                style={[styles.cardItem, index === upcomingReminders.length - 1 && styles.cardItemLast]}
              >
                <ReminderCard
                  title={item.title}
                  time={item.time}
                  priority={item.priority}
                  accent={item.accent}
                />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <Pressable style={styles.fab} onPress={onAddTask}>
        <AppIcon name="plus" size={FAB_ICON_SIZE} color="#ffffff" />
      </Pressable>

      <BottomNav active="home" onNavigate={onNavigate ?? noop} />
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
    paddingBottom: 120,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: radii.pill,
    backgroundColor: 'rgba(37, 140, 244, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(37, 140, 244, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    fontWeight: '700',
    color: theme.colors.primary,
  },
  greeting: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  date: {
    marginTop: spacing.xs,
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surfaceSoft,
  },
  sectionEyebrow: {
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginBottom: spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
  },
  statItem: {
    flex: 1,
    marginRight: spacing.md,
  },
  statItemLast: {
    marginRight: 0,
  },
  sectionSpacer: {
    marginTop: spacing.xxxl,
  },
  cardList: {},
  cardItem: {
    marginBottom: spacing.md,
  },
  cardItemLast: {
    marginBottom: 0,
  },
  fab: {
    position: 'absolute',
    right: spacing.xxl,
    bottom: 110,
    width: 56,
    height: 56,
    borderRadius: radii.pill,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: palette.primary,
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
});
