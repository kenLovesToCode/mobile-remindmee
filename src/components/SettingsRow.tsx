import { StyleSheet, Text, View } from 'react-native';

import { AppIcon, AppIconName } from './ui/AppIcon';
import { palette, radii, spacing, theme } from '../theme/colors';

export interface SettingsRowProps {
  readonly label: string;
  readonly value?: string;
  readonly accent: 'orange' | 'indigo' | 'green' | 'blue' | 'pink' | 'amber' | 'cyan';
  readonly accessory: 'chevron' | 'toggle' | 'none';
  readonly iconName: AppIconName;
}

const accentMap = {
  orange: palette.orange500,
  indigo: palette.indigo500,
  green: palette.green500,
  blue: palette.primary,
  pink: palette.pink500,
  amber: palette.amber500,
  cyan: palette.cyan500,
} as const;

const ICON_SIZE = 16;
const CHEVRON_SIZE = 16;

export const SettingsRow = ({ label, value, accent, accessory, iconName }: SettingsRowProps) => {
  const accentColor = accentMap[accent];

  return (
    <View style={styles.row}>
      <View style={styles.left}>
        <View style={[styles.icon, { backgroundColor: accentColor + '22' }]}>
          <AppIcon name={iconName} size={ICON_SIZE} color={accentColor} />
        </View>
        <Text style={styles.label}>{label}</Text>
      </View>
      <View style={styles.right}>
        {value ? <Text style={styles.value}>{value}</Text> : null}
        {accessory === 'chevron' ? (
          <View style={styles.chevron}>
            <AppIcon name="chevron-right" size={CHEVRON_SIZE} color={theme.colors.textSecondary} />
          </View>
        ) : null}
        {accessory === 'toggle' ? (
          <View style={styles.toggle}>
            <View style={styles.toggleThumb} />
          </View>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  value: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  chevron: {
    marginLeft: spacing.sm,
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: radii.pill,
    backgroundColor: theme.colors.primary,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingHorizontal: 3,
    marginLeft: spacing.sm,
  },
  toggleThumb: {
    width: 16,
    height: 16,
    borderRadius: radii.pill,
    backgroundColor: '#ffffff',
  },
});
