import { Feather } from '@expo/vector-icons';

import { theme } from '../../theme/colors';

export type AppIconName =
  | 'bell'
  | 'check'
  | 'check-square'
  | 'chevron-right'
  | 'edit'
  | 'filter'
  | 'globe'
  | 'help-circle'
  | 'home'
  | 'lock'
  | 'mail'
  | 'message-square'
  | 'moon'
  | 'plus'
  | 'search'
  | 'settings'
  | 'shield'
  | 'trash';

export interface AppIconProps {
  readonly name: AppIconName;
  readonly size?: number;
  readonly color?: string;
}

const iconMap: Record<AppIconName, keyof typeof Feather.glyphMap> = {
  bell: 'bell',
  check: 'check',
  'check-square': 'check-square',
  'chevron-right': 'chevron-right',
  edit: 'edit-2',
  filter: 'filter',
  globe: 'globe',
  'help-circle': 'help-circle',
  home: 'home',
  lock: 'lock',
  mail: 'mail',
  'message-square': 'message-square',
  moon: 'moon',
  plus: 'plus',
  search: 'search',
  settings: 'settings',
  shield: 'shield',
  trash: 'trash-2',
};

export const AppIcon = ({ name, size = 18, color = theme.colors.textSecondary }: AppIconProps) => {
  return <Feather name={iconMap[name]} size={size} color={color} />;
};
