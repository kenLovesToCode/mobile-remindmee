import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, type ScrollViewProps, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface ScreenScrollViewProps extends Omit<ScrollViewProps, 'contentContainerStyle'> {
  readonly children: ReactNode;
  readonly contentContainerStyle?: StyleProp<ViewStyle>;
  readonly basePaddingTop?: number;
}

export const ScreenScrollView = ({
  children,
  contentContainerStyle,
  basePaddingTop = 0,
  ...scrollProps
}: ScreenScrollViewProps) => {
  const insets = useSafeAreaInsets();
  const combinedStyle = StyleSheet.flatten([
    contentContainerStyle,
    { paddingTop: basePaddingTop + insets.top },
  ]);

  return (
    <ScrollView {...scrollProps} contentContainerStyle={combinedStyle}>
      {children}
    </ScrollView>
  );
};
