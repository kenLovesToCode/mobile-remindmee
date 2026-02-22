import { Feather } from '@expo/vector-icons';

import { theme } from '../../theme/colors';

export type AppIconName =
  | 'bell'
  | 'check'
  | 'check-square'
  | 'chevron-right'
  | 'filter'
  | 'globe'
  | 'help-circle'
  | 'home'
  | 'lock'
  | 'message-square'
  | 'moon'
  | 'plus'
  | 'search'
  | 'settings'
  | 'shield';

export interface AppIconProps {
  readonly name: AppIconName;
  readonly size?: number;
  readonly color?: string;
}

export const AppIcon = ({ name, size = 18, color = theme.colors.textSecondary }: AppIconProps) => {
  return <Feather name={name} size={size} color={color} />;
};
