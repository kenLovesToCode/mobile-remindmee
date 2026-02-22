import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppIcon, AppIconName } from './ui/AppIcon';
import { spacing, theme } from '../theme/colors';
import { ScreenKey } from '../data/mockData';

export interface BottomNavProps {
  readonly active: ScreenKey;
  readonly onNavigate: (screen: ScreenKey) => void;
}

const ICON_SIZE = 18;

const navItems: ReadonlyArray<{ key: ScreenKey; label: string; icon: AppIconName }> = [
  { key: 'home', label: 'Home', icon: 'home' },
  { key: 'tasks', label: 'Task List', icon: 'check-square' },
  { key: 'settings', label: 'Settings', icon: 'settings' },
];

export const BottomNav = ({ active, onNavigate }: BottomNavProps) => {
  return (
    <View style={styles.container}>
      {navItems.map((item) => (
        <NavItem
          key={item.key}
          label={item.label}
          icon={item.icon}
          active={active === item.key}
          onPress={() => onNavigate(item.key)}
        />
      ))}
    </View>
  );
};

interface NavItemProps {
  readonly label: string;
  readonly icon: AppIconName;
  readonly active?: boolean;
  readonly onPress: () => void;
}

const NavItem = ({ label, icon, active = false, onPress }: NavItemProps) => {
  const iconColor = active ? theme.colors.primary : theme.colors.textSecondary;
  return (
    <Pressable style={({ pressed }) => [styles.item, pressed && styles.itemPressed]} onPress={onPress}>
      <AppIcon name={icon} size={ICON_SIZE} color={iconColor} />
      <Text style={[styles.label, active && styles.labelActive]}>{label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xxxl,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: 'rgba(16, 25, 34, 0.95)',
  },
  item: {
    flex: 1,
    alignItems: 'center',
  },
  itemPressed: {
    opacity: 0.7,
  },
  label: {
    marginTop: spacing.xs,
    fontSize: 10,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
  },
  labelActive: {
    color: theme.colors.primary,
  },
});
