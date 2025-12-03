import React from 'react';
import { Pressable, Text, View, ViewStyle, TextStyle } from 'react-native';
import { useColorScheme } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
  testID?: string;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  selected = false,
  onPress,
  style,
  testID,
}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const scheme = isDarkMode ? colors.dark : colors.light;

  const containerStyle: ViewStyle = {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: selected ? scheme.primary : scheme.textSecondary,
    backgroundColor: selected ? scheme.primary : 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const textStyle: TextStyle = {
    fontSize: 13,
    fontWeight: '600' as const,
    color: selected ? '#FFFFFF' : scheme.text,
  };

  return (
    <Pressable
      onPress={onPress}
      style={[containerStyle, style]}
      testID={testID}
    >
      <Text style={textStyle}>{label}</Text>
    </Pressable>
  );
};
