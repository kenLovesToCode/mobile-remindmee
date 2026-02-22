export const userProfile = {
  name: 'Jo Vanne',
  greeting: 'Good Morning, Jonalyn',
  dateLabel: 'Tuesday, October 24',
  email: 'alex.j@remindapp.com',
  planLabel: 'Premium Member',
  appVersion: 'Remindly App v2.4.0 (2024)',
  appTagline: 'Made with care for Productivity',
};

export const newTaskDefaults = {
  titlePlaceholder: 'What needs to be done?',
  descriptionPlaceholder: 'Add notes, links, or context...',
  priorities: ['Low', 'Medium', 'High'],
};

export const settingsSections = [
  {
    title: 'General',
    items: [
      { label: 'Notifications', value: 'Alerts On', accent: 'orange', accessory: 'chevron', iconName: 'bell' },
      { label: 'Dark Mode', value: 'On', accent: 'indigo', accessory: 'toggle', iconName: 'moon' },
      { label: 'Language', value: 'English', accent: 'green', accessory: 'chevron', iconName: 'globe' },
    ],
  },
  {
    title: 'Security',
    items: [
      { label: 'Account Security', value: '', accent: 'blue', accessory: 'chevron', iconName: 'shield' },
      { label: 'Privacy Center', value: '', accent: 'pink', accessory: 'chevron', iconName: 'lock' },
    ],
  },
  {
    title: 'Support',
    items: [
      { label: 'Help & Support', value: '', accent: 'amber', accessory: 'chevron', iconName: 'help-circle' },
      { label: 'Send Feedback', value: '', accent: 'cyan', accessory: 'chevron', iconName: 'message-square' },
    ],
  },
] as const;

export type ScreenKey =
  | 'home'
  | 'tasks'
  | 'newTask'
  | 'settings'
  | 'login'
  | 'signup'
  | 'forgotPassword'
  | 'emailSent'
  | 'resetPassword';
