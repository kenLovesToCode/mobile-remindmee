import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { ActionButton } from '../components/ActionButton';
import { newTaskDefaults } from '../data/mockData';
import { radii, spacing, theme } from '../theme/colors';

export interface NewTaskModalScreenProps {
  readonly onSave?: () => void;
  readonly onClose?: () => void;
}

export const NewTaskModalScreen = ({ onSave, onClose }: NewTaskModalScreenProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.backdropList}>
        <Text style={styles.listTitle}>Tasks</Text>
        <View style={styles.listCard} />
        <View style={styles.listCard} />
        <View style={styles.listCard} />
      </View>

      <View style={styles.overlay} />

      <View style={styles.sheet}>
        <View style={styles.sheetHandle} />
        <View style={styles.sheetHeader}>
          <Text style={styles.sheetTitle}>New Task</Text>
          <Pressable onPress={onClose}>
            <Text style={styles.clearText}>Clear</Text>
          </Pressable>
        </View>
        <ScrollView contentContainerStyle={styles.sheetContent} showsVerticalScrollIndicator={false}>
          <View style={styles.fieldBlock}>
            <Text style={styles.fieldLabel}>Task Title</Text>
            <TextInput
              placeholder={newTaskDefaults.titlePlaceholder}
              placeholderTextColor={theme.colors.textSecondary}
              style={styles.input}
            />
          </View>

          <View style={styles.fieldBlock}>
            <Text style={styles.fieldLabel}>Description</Text>
            <TextInput
              placeholder={newTaskDefaults.descriptionPlaceholder}
              placeholderTextColor={theme.colors.textSecondary}
              style={[styles.input, styles.textarea]}
              multiline
            />
          </View>

          <View style={styles.fieldBlock}>
            <Text style={styles.fieldLabel}>Schedule</Text>
            <View style={styles.scheduleRow}>
              {newTaskDefaults.schedule.map((label, index) => (
                <View
                  key={label}
                  style={[styles.scheduleButton, index === 0 && styles.scheduleButtonSpacing]}
                >
                  <Text style={styles.scheduleText}>{label}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.fieldBlock}>
            <Text style={styles.fieldLabel}>Priority</Text>
            <View style={styles.priorityRow}>
              {newTaskDefaults.priorities.map((priority) => (
                <View
                  key={priority}
                  style={[
                    styles.priorityButton,
                    priority === 'Medium' && styles.priorityButtonActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.priorityText,
                      priority === 'Medium' && styles.priorityTextActive,
                    ]}
                  >
                    {priority}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.actionsRow}>
            <ActionButton label="Cancel" variant="ghost" style={styles.cancelButton} onPress={onClose} />
            <ActionButton label="Save Task" onPress={onSave} style={styles.saveButton} />
          </View>
        </ScrollView>
      </View>
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
  sheetHandle: {
    alignSelf: 'center',
    width: 48,
    height: 6,
    borderRadius: radii.pill,
    backgroundColor: theme.colors.textSecondary,
    marginTop: spacing.sm,
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
  scheduleButtonSpacing: {
    marginRight: spacing.md,
  },
  scheduleText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textSecondary,
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
