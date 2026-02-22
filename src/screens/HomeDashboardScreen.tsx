import {
  Animated,
  Dimensions,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useCallback, useMemo, useRef, useState } from 'react';

import { ScreenScrollView } from '../components/layout/ScreenScrollView';
import { SectionHeader } from '../components/SectionHeader';
import { StatCard } from '../components/StatCard';
import { ReminderCard } from '../components/ReminderCard';
import { BottomNav } from '../components/BottomNav';
import { AppIcon } from '../components/ui/AppIcon';
import { userProfile, ScreenKey } from '../data/mockData';
import { Task, TaskPriority } from '../data/tasks/models';
import { palette, radii, spacing, theme } from '../theme/colors';

export interface HomeDashboardScreenProps {
  readonly onAddTask?: () => void;
  readonly onNavigate?: (screen: ScreenKey) => void;
  readonly upcomingTasks?: Task[];
  readonly upcomingLimit?: number;
  readonly stats?: {
    readonly today: number;
    readonly scheduled: number;
    readonly done: number;
  };
}

const HEADER_ICON_SIZE = 18;
const FAB_ICON_SIZE = 22;
const SHEET_CLOSE_DURATION = 180;
const SHEET_MAX_HEIGHT = 0.95;
const SHEET_OPEN_OVERSHOOT = -16;
const DRAG_DISMISS_DISTANCE = 140;
const DRAG_VELOCITY_THRESHOLD = 0.9;
const DRAG_HANDLE_HEIGHT = 80;
const noop = () => {};

const priorityAccentMap: Record<TaskPriority, 'red' | 'orange' | 'primary'> = {
  High: 'red',
  Medium: 'orange',
  Low: 'primary',
};

const formatDateTimeLabel = (date: Date) =>
  date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) +
  ' • ' +
  date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

export const HomeDashboardScreen = ({
  onAddTask,
  onNavigate,
  upcomingTasks = [],
  upcomingLimit = 10,
  stats = { today: 0, scheduled: 0, done: 0 },
}: HomeDashboardScreenProps) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const sheetTranslateY = useRef(new Animated.Value(0)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const screenHeight = useMemo(() => Dimensions.get('window').height, []);
  const displayUpcoming = useMemo(() => upcomingTasks.slice(0, upcomingLimit), [upcomingTasks, upcomingLimit]);

  const openSheet = useCallback(() => {
    sheetTranslateY.setValue(screenHeight);
    overlayOpacity.setValue(0);
    setIsSheetOpen(true);
    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: 160,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(sheetTranslateY, {
          toValue: SHEET_OPEN_OVERSHOOT,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.spring(sheetTranslateY, {
          toValue: 0,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [overlayOpacity, sheetTranslateY, screenHeight]);

  const closeSheet = useCallback(() => {
    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 140,
        useNativeDriver: true,
      }),
      Animated.timing(sheetTranslateY, {
        toValue: screenHeight,
        duration: SHEET_CLOSE_DURATION,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsSheetOpen(false);
      overlayOpacity.setValue(0);
    });
  }, [overlayOpacity, sheetTranslateY, screenHeight]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (event, gestureState) => {
        if (gestureState.dy <= 6 || Math.abs(gestureState.dx) > 12) {
          return false;
        }
        return event.nativeEvent.locationY <= DRAG_HANDLE_HEIGHT;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          sheetTranslateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        const shouldClose =
          gestureState.dy > DRAG_DISMISS_DISTANCE || gestureState.vy > DRAG_VELOCITY_THRESHOLD;
        if (shouldClose) {
          closeSheet();
          return;
        }
        Animated.spring(sheetTranslateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      },
    }),
  ).current;
  const dashboardStats = [
    { label: 'Today', value: String(stats.today), accent: 'primary' },
    { label: 'Scheduled', value: String(stats.scheduled), accent: 'neutral' },
    { label: 'Done', value: String(stats.done), accent: 'neutral' },
  ] as const;

  return (
    <View style={styles.container}>
      <ScreenScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        basePaddingTop={spacing.xxxl}
      >
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
          <SectionHeader title="Upcoming Reminders" actionLabel="See all" onPressAction={openSheet} />
          <View style={styles.cardList}>
            {displayUpcoming.length === 0 ? (
              <Text style={styles.emptyText}>No upcoming reminders yet.</Text>
            ) : (
              displayUpcoming.map((item, index) => (
                <View
                  key={item.id}
                  style={[styles.cardItem, index === displayUpcoming.length - 1 && styles.cardItemLast]}
                >
                  <ReminderCard
                    title={item.title}
                    time={formatDateTimeLabel(new Date(item.scheduledAt))}
                    priority={item.priority}
                    accent={priorityAccentMap[item.priority]}
                  />
                </View>
              ))
            )}
          </View>
        </View>
      </ScreenScrollView>

      <Pressable style={styles.fab} onPress={onAddTask}>
        <AppIcon name="plus" size={FAB_ICON_SIZE} color="#ffffff" />
      </Pressable>

      {isSheetOpen ? (
        <>
          <Animated.View style={[styles.sheetOverlay, { opacity: overlayOpacity }]} />
          <Pressable style={styles.sheetOverlayPressable} onPress={closeSheet} />
          <Animated.View
            style={[
              styles.sheet,
              { height: screenHeight * SHEET_MAX_HEIGHT, transform: [{ translateY: sheetTranslateY }] },
            ]}
          >
            <View style={styles.sheetDragArea} {...panResponder.panHandlers}>
              <View style={styles.sheetHandle} />
              <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Upcoming Reminders</Text>
              <Pressable onPress={closeSheet}>
                <Text style={styles.sheetAction}>Close</Text>
              </Pressable>
            </View>
            </View>
            <ScrollView contentContainerStyle={styles.sheetContent} showsVerticalScrollIndicator={false}>
              {upcomingTasks.length === 0 ? (
                <Text style={styles.emptyText}>No upcoming reminders yet.</Text>
              ) : (
                upcomingTasks.map((item, index) => (
                  <View
                    key={item.id}
                    style={[styles.cardItem, index === upcomingTasks.length - 1 && styles.cardItemLast]}
                  >
                    <ReminderCard
                      title={item.title}
                      time={formatDateTimeLabel(new Date(item.scheduledAt))}
                      priority={item.priority}
                      accent={priorityAccentMap[item.priority]}
                    />
                  </View>
                ))
              )}
            </ScrollView>
          </Animated.View>
        </>
      ) : null}

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
  emptyText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  sheetOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
  },
  sheetOverlayPressable: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: spacing.sm,
  },
  sheetDragArea: {
    paddingTop: spacing.sm,
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 48,
    height: 6,
    borderRadius: radii.pill,
    backgroundColor: theme.colors.textSecondary,
    marginBottom: spacing.lg,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xxl,
    paddingBottom: spacing.lg,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  sheetAction: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  sheetContent: {
    paddingHorizontal: spacing.xxl,
    paddingBottom: spacing.xxxl,
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
