//File: src/components/HabitCard.tsx

import React from 'react';
import { useRouter } from 'expo-router'
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Habit, Completion } from '@/types';
import { Button, Input, Card,Checkbox } from '@/components/ui';
import { spacing, typography, borderRadius, colors, useTheme} from '@/theme';
import { getTodayString, isHabitCompletedOnDate } from '@/utils/helpers';
import { HabitIcon } from '@/components/habits/HabitIcon'
import { getHabitIconConfig } from '@/constants/habitIcons'

interface HabitCardProps {
  habit: Habit;
  completions: Completion[];
  onPress?: () => void;
  onToggleCompletion?: (habitId: string, date: string) => void;
}

const pressedStyle = (pressed: boolean) => ({
  opacity: pressed ? 0.7 : 1,
});

export const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  completions,
  onPress,
  onToggleCompletion,
}) => {
  const today = getTodayString();
  const router = useRouter()
  const isCompletedToday = isHabitCompletedOnDate(completions, habit.id, today);
  const { colors } = useTheme()
  const iconCfg = getHabitIconConfig(habit.icon)
  const frequencyLabel = habit.frequency // daily weekly monthly

  // Map frequency to category-specific habit color
  const getHabitBackgroundColor = () => {
    switch (habit.frequency) {
      case 'daily':
        return colors.habitDaily;
      case 'weekly':
        return colors.habitWeekly;
      case 'monthly':
        return colors.habitMonthly;
      default:
        return colors.surface;
    }
  }

  const handleCardPress = () => {
    router.push(`/(app)/(habits)/${habit.id}` as never)
  }

  return (
    <View
      style={{
        borderRadius: borderRadius.lg,
        backgroundColor: getHabitBackgroundColor(),
        padding: spacing.md,
        marginBottom: spacing.md,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {/* Checkbox or status */}
        <Pressable
          onPress={() => {
            onToggleCompletion?.(habit.id, today);
          }}
          style={({ pressed }) => [
            {
              width: 24,
              height: 24,
              borderRadius: 6,
              borderWidth: 2,
              borderColor: colors.primary,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: spacing.md,
              backgroundColor: isCompletedToday
                ? colors.primary
                : 'transparent',
            },
            pressedStyle(pressed),
          ]}
        >
          {isCompletedToday && (
            <Text
              style={{
                color: '#fff',
                fontSize: 14,
                fontWeight: '700',
              }}
            >
              ✓
            </Text>
          )}
        </Pressable>

        {/* Icon and text block - pressable for navigation */}
        <Pressable
          onPress={handleCardPress}
          style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}
        >
          <HabitIcon iconKey={habit.icon} size={24} />

          <View style={{ marginLeft: spacing.md, flex: 1 }}>
            {/* Main habit name */}
            <Text
              numberOfLines={1}
              style={{
                ...typography.bodyLarge,
                color: colors.habitTextPrimary,
              }}
            >
              {habit.name}
            </Text>

            {/* Icon label + frequency + status */}
            <Text
              numberOfLines={1}
              style={{
                ...typography.caption,
                color: colors.habitTextSecondary,
                marginTop: 2,
              }}
            >
              {iconCfg.label} • {frequencyLabel}{' '}
              {isCompletedToday ? '• Done' : '• Pending'}
            </Text>
          </View>
        </Pressable>
      </View>
    </View>
  )
}