export type ReminderPriority = 'High' | 'Medium' | 'Low';

export const userProfile = {
  name: 'Jo Vanne',
  greeting: 'Good Morning, Jonalyn',
  dateLabel: 'Tuesday, October 24',
  email: 'alex.j@remindapp.com',
  planLabel: 'Premium Member',
  appVersion: 'Remindly App v2.4.0 (2024)',
  appTagline: 'Made with care for Productivity',
};

export const dashboardStats = [
  { label: 'Today', value: '5', accent: 'primary' },
  { label: 'Scheduled', value: '12', accent: 'neutral' },
  { label: 'Done', value: '8', accent: 'neutral' },
] as const;

export const upcomingReminders = [
  { title: 'Morning Workout', time: '07:00 AM', priority: 'High' as ReminderPriority, accent: 'red' },
  { title: 'Team Sync Meeting', time: '10:30 AM', priority: 'Medium' as ReminderPriority, accent: 'orange' },
  { title: 'Grocery Shopping', time: '05:00 PM', priority: 'Low' as ReminderPriority, accent: 'primary' },
  { title: 'Vitamins Reminder', time: '08:00 PM', priority: 'Low' as ReminderPriority, accent: 'green' },
];

export const taskSections = [
  {
    title: 'Overdue',
    countLabel: '2 tasks',
    accent: 'danger',
    tasks: [
      { title: 'Finalize quarterly report', meta: 'Yesterday - Work', checked: false },
      { title: 'Call insurance agent', meta: '9:00 AM - Personal', checked: false },
    ],
  },
  {
    title: 'Today',
    countLabel: '3 tasks',
    accent: 'primary',
    tasks: [
      { title: 'Grocery shopping', meta: '5:00 PM - Home', checked: false },
      { title: 'Morning yoga session', meta: 'Done - Health', checked: true },
      { title: 'Design review with team', meta: '2:00 PM - Work', checked: false },
    ],
  },
] as const;

export const quickProjects = [
  { title: 'Home Improvement', count: '12 tasks', accent: 'primary' },
  { title: 'Product Launch', count: '8 tasks', accent: 'orange' },
];

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
