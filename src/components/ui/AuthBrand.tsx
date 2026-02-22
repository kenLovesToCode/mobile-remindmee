import { StyleSheet, Text, View } from 'react-native';

import { AppIcon } from './AppIcon';
import { radii, spacing, theme } from '../../theme/colors';

export interface AuthBrandProps {
  readonly title: string;
  readonly subtitle?: string;
}

const ICON_SIZE = 20;

export const AuthBrand = ({ title, subtitle }: AuthBrandProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <AppIcon name="check" size={ICON_SIZE} color={theme.colors.primary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: spacing.xxxl,
  },
  logo: {
    width: 54,
    height: 54,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surfaceSoft,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  subtitle: {
    marginTop: spacing.xs,
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
});
