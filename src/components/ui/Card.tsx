import React from 'react';
import { View, ViewStyle } from 'react-native';
import { useColorScheme } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  testID?: string;
}

export const Card: React.FC<CardProps> = ({ children, style, onPress, testID }) => {
  const isDarkMode = useColorScheme() === 'dark';
  const scheme = isDarkMode ? colors.dark : colors.light;

  const cardStyle: ViewStyle = {
    backgroundColor: scheme.surface,
    borderRadius: 12,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: isDarkMode ? colors.dark.border : colors.light.border,
    shadowColor: scheme.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  };

  if (onPress) {
    // If card is pressable, we need to wrap with a Pressable component
    // For now, return as a normal card
    return (
      <View style={[cardStyle, style]} testID={testID}>
        {children}
      </View>
    );
  }

  return (
    <View style={[cardStyle, style]} testID={testID}>
      {children}
    </View>
  );
};
