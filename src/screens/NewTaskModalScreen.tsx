import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  PanResponder,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

import { ActionButton } from '../components/ActionButton';
import { newTaskDefaults } from '../data/mockData';
import { AuthStatusMessage } from '../components/ui/AuthStatusMessage';
import { TaskPriority } from '../data/tasks/models';
import { radii, spacing, theme } from '../theme/colors';

export interface NewTaskModalScreenProps {
  readonly onSave?: (payload: {
    title: string;
    description: string | null;
    scheduledAt: string;
    priority: TaskPriority;
  }) => void;
  readonly onClose?: () => void;
  readonly mode?: 'create' | 'edit';
  readonly primaryLabel?: string;
  readonly initialValues?: {
    readonly title: string;
    readonly description: string | null;
    readonly scheduledAt: string;
    readonly priority: TaskPriority;
  };
}

type PriorityLevel = TaskPriority;

const createDefaultTime = () => {
  const time = new Date();
  time.setHours(17, 0, 0, 0);
  return time;
};

const isSameDay = (left: Date, right: Date) =>
  left.getFullYear() === right.getFullYear() &&
  left.getMonth() === right.getMonth() &&
  left.getDate() === right.getDate();

const formatDateLabel = (date: Date) => {
  const today = new Date();
  if (isSameDay(date, today)) {
    return 'Today';
  }
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
};

const formatTimeLabel = (date: Date) =>
  date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

const DRAG_DISMISS_DISTANCE = 120;
const DRAG_VELOCITY_THRESHOLD = 0.8;
const DRAG_HANDLE_HEIGHT = 80;
const CLOSE_ANIMATION_DURATION = 200;

export const NewTaskModalScreen = ({
  onSave,
  onClose,
  mode = 'create',
  primaryLabel,
  initialValues,
}: NewTaskModalScreenProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(createDefaultTime());
  const [selectedPriority, setSelectedPriority] = useState<PriorityLevel>('Medium');
  const [status, setStatus] = useState<'idle' | 'error' | 'empty'>('idle');
  const [statusMessage, setStatusMessage] = useState<string | undefined>(undefined);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const screenHeight = useMemo(() => Dimensions.get('window').height, []);
  const translateY = useRef(new Animated.Value(0)).current;

  const priorities = newTaskDefaults.priorities as PriorityLevel[];

  useEffect(() => {
    translateY.setValue(0);
  }, [translateY]);

  useEffect(() => {
    if (!initialValues) {
      return;
    }
    const scheduled = new Date(initialValues.scheduledAt);
    setTitle(initialValues.title);
    setDescription(initialValues.description ?? '');
    setSelectedDate(new Date(scheduled.getFullYear(), scheduled.getMonth(), scheduled.getDate()));
    setSelectedTime(new Date(scheduled));
    setSelectedPriority(initialValues.priority);
  }, [initialValues]);

  const closeWithAnimation = useCallback(() => {
    if (!onClose) {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
      return;
    }
    Animated.timing(translateY, {
      toValue: screenHeight,
      duration: CLOSE_ANIMATION_DURATION,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  }, [onClose, screenHeight, translateY]);

  const handleDateChange = (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (event.type === 'set' && date) {
      setSelectedDate(date);
    } else if (Platform.OS === 'ios' && date) {
      setSelectedDate(date);
    }
  };

  const handleTimeChange = (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }
    if (event.type === 'set' && date) {
      setSelectedTime(date);
    } else if (Platform.OS === 'ios' && date) {
      setSelectedTime(date);
    }
  };

  const openDatePicker = () => {
    setShowTimePicker(false);
    setShowDatePicker((prev) => !prev);
  };

  const openTimePicker = () => {
    setShowDatePicker(false);
    setShowTimePicker((prev) => !prev);
  };

  const handleSave = () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setStatus('empty');
      setStatusMessage('Task title is required.');
      return;
    }
    const scheduledAt = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      selectedTime.getHours(),
      selectedTime.getMinutes(),
      0,
      0,
    ).toISOString();

    setStatus('idle');
    setStatusMessage(undefined);
    onSave?.({
      title: trimmedTitle,
      description: description.trim() ? description.trim() : null,
      scheduledAt,
      priority: selectedPriority,
    });
  };

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
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        const shouldClose =
          gestureState.dy > DRAG_DISMISS_DISTANCE || gestureState.vy > DRAG_VELOCITY_THRESHOLD;
        if (shouldClose) {
          closeWithAnimation();
          return;
        }
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      },
    }),
  ).current;

  return (
    <View style={styles.container}>
      <View style={styles.backdropList}>
        <Text style={styles.listTitle}>Tasks</Text>
        <View style={styles.listCard} />
        <View style={styles.listCard} />
        <View style={styles.listCard} />
      </View>

      <Pressable style={styles.overlay} onPress={closeWithAnimation} />

      <Animated.View style={[styles.sheet, { transform: [{ translateY }] }]}>
        <View style={styles.sheetDragArea} {...panResponder.panHandlers}>
          <View style={styles.sheetHandle} />
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>{mode === 'edit' ? 'Edit Task' : 'New Task'}</Text>
            {mode === 'edit' ? (
              <Pressable onPress={closeWithAnimation}>
                <Text style={styles.clearText}>Cancel</Text>
              </Pressable>
            ) : (
              <Pressable
                onPress={() => {
                  setTitle('');
                  setDescription('');
                  setSelectedDate(new Date());
                  setSelectedTime(createDefaultTime());
                  setSelectedPriority('Medium');
                  setStatus('idle');
                  setStatusMessage(undefined);
                }}
              >
                <Text style={styles.clearText}>Clear</Text>
              </Pressable>
            )}
          </View>
        </View>
        <ScrollView contentContainerStyle={styles.sheetContent} showsVerticalScrollIndicator={false}>
          <View style={styles.fieldBlock}>
            <Text style={styles.fieldLabel}>Task Title</Text>
            <TextInput
              placeholder={newTaskDefaults.titlePlaceholder}
              placeholderTextColor={theme.colors.textSecondary}
              style={styles.input}
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <View style={styles.fieldBlock}>
            <Text style={styles.fieldLabel}>Description</Text>
            <TextInput
              placeholder={newTaskDefaults.descriptionPlaceholder}
              placeholderTextColor={theme.colors.textSecondary}
              style={[styles.input, styles.textarea]}
              multiline
              value={description}
              onChangeText={setDescription}
            />
          </View>

          <View style={styles.fieldBlock}>
            <Text style={styles.fieldLabel}>Schedule</Text>
            <View style={styles.scheduleRow}>
              <Pressable
                onPress={openDatePicker}
                style={({ pressed }) => [
                  styles.scheduleButton,
                  styles.scheduleButtonSpacing,
                  pressed && styles.scheduleButtonPressed,
                ]}
              >
                <Text style={styles.scheduleText}>{formatDateLabel(selectedDate)}</Text>
              </Pressable>
              <Pressable
                onPress={openTimePicker}
                style={({ pressed }) => [styles.scheduleButton, pressed && styles.scheduleButtonPressed]}
              >
                <Text style={styles.scheduleText}>{formatTimeLabel(selectedTime)}</Text>
              </Pressable>
            </View>
            {showDatePicker ? (
              <View style={styles.pickerWrap}>
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'inline' : 'default'}
                  onChange={handleDateChange}
                />
              </View>
            ) : null}
            {showTimePicker ? (
              <View style={styles.pickerWrap}>
                <DateTimePicker
                  value={selectedTime}
                  mode="time"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleTimeChange}
                />
              </View>
            ) : null}
          </View>

          <View style={styles.fieldBlock}>
            <Text style={styles.fieldLabel}>Priority</Text>
            <View style={styles.priorityRow}>
              {priorities.map((priority) => {
                const isActive = priority === selectedPriority;
                return (
                  <Pressable
                    key={priority}
                    onPress={() => setSelectedPriority(priority)}
                    style={({ pressed }) => [
                      styles.priorityButton,
                      isActive && styles.priorityButtonActive,
                      pressed && styles.priorityButtonPressed,
                    ]}
                  >
                    <Text style={[styles.priorityText, isActive && styles.priorityTextActive]}>
                      {priority}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.actionsRow}>
            <ActionButton
              label="Cancel"
              variant="ghost"
              style={styles.cancelButton}
              onPress={closeWithAnimation}
            />
            <ActionButton
              label={primaryLabel ?? (mode === 'edit' ? 'Update Task' : 'Save Task')}
              onPress={handleSave}
              style={styles.saveButton}
            />
          </View>
          <AuthStatusMessage status={status} message={statusMessage} align="center" />
        </ScrollView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  backdropList: {
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.xxxl,
    opacity: 0.4,
  },
  listTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: spacing.lg,
  },
  listCard: {
    height: 60,
    borderRadius: radii.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: spacing.md,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
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
    maxHeight: '90%',
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
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.lg,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  clearText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  sheetContent: {
    paddingHorizontal: spacing.xxl,
    paddingBottom: spacing.xxxl,
  },
  fieldBlock: {
    marginBottom: spacing.xxl,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginBottom: spacing.sm,
  },
  input: {
    height: 52,
    borderRadius: radii.md,
    backgroundColor: theme.colors.surfaceSoft,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: spacing.lg,
    color: theme.colors.textPrimary,
  },
  textarea: {
    height: 110,
    textAlignVertical: 'top',
    paddingTop: spacing.lg,
  },
  scheduleRow: {
    flexDirection: 'row',
  },
  scheduleButton: {
    flex: 1,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surfaceSoft,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scheduleButtonPressed: {
    opacity: 0.8,
  },
  scheduleButtonSpacing: {
    marginRight: spacing.md,
  },
  scheduleText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  pickerWrap: {
    marginTop: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surfaceSoft,
    overflow: 'hidden',
  },
  priorityRow: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surfaceSoft,
    borderRadius: radii.md,
    padding: spacing.xs,
  },
  priorityButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: radii.md,
  },
  priorityButtonPressed: {
    opacity: 0.8,
  },
  priorityButtonActive: {
    backgroundColor: theme.colors.surface,
  },
  priorityText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  priorityTextActive: {
    color: theme.colors.textPrimary,
  },
  actionsRow: {
    flexDirection: 'row',
    marginTop: spacing.sm,
  },
  cancelButton: {
    flex: 1,
    marginRight: spacing.md,
  },
  saveButton: {
    flex: 2,
  },
});
