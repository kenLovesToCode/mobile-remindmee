import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { BottomNav } from '../components/BottomNav';
import { SettingsRow } from '../components/SettingsRow';
import { AppIcon } from '../components/ui/AppIcon';
import { userProfile, settingsSections, ScreenKey } from '../data/mockData';
import { palette, radii, spacing, theme } from '../theme/colors';

export interface AppSettingsScreenProps {
  readonly onLogout?: () => void;
  readonly onNavigate?: (screen: ScreenKey) => void;
}

const CHEVRON_SIZE = 18;
const noop = () => {};

export const AppSettingsScreen = ({ onLogout, onNavigate }: AppSettingsScreenProps) => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Settings</Text>

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>A</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{userProfile.name}</Text>
            <Text style={styles.profileEmail}>{userProfile.email}</Text>
            <View style={styles.planBadge}>
              <Text style={styles.planText}>{userProfile.planLabel}</Text>
            </View>
          </View>
          <AppIcon name="chevron-right" size={CHEVRON_SIZE} color={theme.colors.textSecondary} />
        </View>

        <View style={styles.sections}>
          {settingsSections.map((section, index) => (
            <View
              key={section.title}
              style={[styles.sectionBlock, index === settingsSections.length - 1 && styles.sectionBlockLast]}
            >
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <View style={styles.sectionCard}>
                {section.items.map((item) => (
                  <SettingsRow
                    key={item.label}
                    label={item.label}
                    value={item.value}
                    accent={item.accent}
                    accessory={item.accessory}
                    iconName={item.iconName}
                  />
                ))}
              </View>
            </View>
          ))}
        </View>

        <View style={styles.logoutWrapper}>
          <Text style={styles.logout} onPress={onLogout}>
            Log Out
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>{userProfile.appVersion}</Text>
          <Text style={styles.footerSubtext}>{userProfile.appTagline}</Text>
        </View>
      </ScrollView>

      <BottomNav active="settings" onNavigate={onNavigate ?? noop} />
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
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    marginBottom: spacing.xl,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: spacing.lg,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(37, 140, 244, 0.2)',
    borderWidth: 2,
    borderColor: theme.colors.primary,
    marginRight: spacing.lg,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  profileEmail: {
    marginTop: spacing.xs,
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  planBadge: {
    marginTop: spacing.xs,
    alignSelf: 'flex-start',
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: 'rgba(37, 140, 244, 0.25)',
    backgroundColor: theme.colors.primarySoft,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  planText: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.primary,
    textTransform: 'uppercase',
  },
  sections: {
    marginTop: spacing.xxxl,
  },
  sectionBlock: {
    marginBottom: spacing.xl,
  },
  sectionBlockLast: {
    marginBottom: 0,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: theme.colors.textSecondary,
  },
  sectionCard: {
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  logoutWrapper: {
    marginTop: spacing.xxxl,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  logout: {
    color: palette.red500,
    fontWeight: '700',
  },
  footer: {
    marginTop: spacing.xxxl,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 11,
    color: theme.colors.textSecondary,
  },
  footerSubtext: {
    marginTop: spacing.xs,
    fontSize: 10,
    color: theme.colors.textSecondary,
  },
});
