import { Pressable, StyleSheet, Text, View } from 'react-native';

import { spacing, theme } from '../theme/colors';

export interface SectionHeaderProps {
  readonly title: string;
  readonly actionLabel?: string;
  readonly onPressAction?: () => void;
}

export const SectionHeader = ({ title, actionLabel, onPressAction }: SectionHeaderProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {actionLabel ? (
        <Pressable onPress={onPressAction}>
          <Text style={styles.action}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  action: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.primary,
  },
});
