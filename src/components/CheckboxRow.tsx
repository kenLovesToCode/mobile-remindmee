import { StyleSheet, Text, View } from 'react-native';

import { AppIcon } from './ui/AppIcon';
import { radii, spacing, theme } from '../theme/colors';

export interface CheckboxRowProps {
  readonly label: string;
  readonly checked?: boolean;
}

const CHECK_ICON_SIZE = 12;

export const CheckboxRow = ({ label, checked = false }: CheckboxRowProps) => {
  return (
    <View style={styles.row}>
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked ? <AppIcon name="check" size={CHECK_ICON_SIZE} color="#ffffff" /> : null}
      </View>
      <Text style={[styles.label, checked && styles.labelChecked]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    padding: spacing.lg,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: theme.colors.textSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  checkboxChecked: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  labelChecked: {
    color: theme.colors.textSecondary,
    textDecorationLine: 'line-through',
  },
});
