import React from 'react';
import { View, Text } from 'react-native';
import { spacing, typography, useTheme, borderRadius} from '@/theme';

type EmptyStateProps = {
  title: string;
  subtitle?: string;
  icon?: string; 
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  subtitle,
  icon = '(♡ˊ͈ ꒳ ˋ͈)',
}) => {
  const { colors } = useTheme();

  return (
    <View
      style={{
        padding: spacing.xl,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: borderRadius.lg,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      {icon ? (
        <Text
          style={{
            fontSize: 40,
            marginBottom: spacing.md,
            color: colors.text,
          }}
        >
          {icon}
        </Text>
      ) : null}

      <Text
        style={{
          ...typography.h3,
          color: colors.text,
          textAlign: 'center',
        }}
      >
        {title}
      </Text>

      {subtitle ? (
        <Text
          style={{
            marginTop: spacing.xs,
            ...typography.body,
            color: colors.textSecondary,
            textAlign: 'center',
          }}
        >
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
};

export default EmptyState;