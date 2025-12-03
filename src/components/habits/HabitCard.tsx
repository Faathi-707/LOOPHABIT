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
import { useAuthStore } from '@/store/authStore';

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
  const { colors, isRTL, isDark } = useTheme()
  const { language } = useAuthStore();
  const iconCfg = getHabitIconConfig(habit.icon)
  const frequencyLabel = habit.frequency // daily weekly monthly

  // Map user's chosen color to theme-appropriate variant
  const getHabitBackgroundColor = () => {
    // Use frequency-based theme colors which already have light/dark variants
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
  };

  const handleCardPress = () => {
    router.push(`/(app)/(habits)/${habit.id}` as never)
  }

  const getFrequencyInLanguage = () => {
    if (language === 'dv') {
      switch (habit.frequency) {
        case 'daily':
          return 'ދިވެހި';
        case 'weekly':
          return 'ހަފުތާ';
        case 'monthly':
          return 'މަސްވަރީ';
        default:
          return habit.frequency;
      }
    }
    return habit.frequency;
  };

  const getStatusInLanguage = () => {
    if (language === 'dv') {
      return isCompletedToday ? 'ސާފާ' : 'ސަްވާބާރ';
    }
    return isCompletedToday ? 'Done' : 'Pending';
  };

  return (
    <View
      style={{
        borderRadius: borderRadius.lg,
        backgroundColor: getHabitBackgroundColor(),
        padding: spacing.md,
        marginBottom: spacing.md,
      }}
    >
      <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center' }}>
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
              marginRight: isRTL ? 0 : spacing.md,
              marginLeft: isRTL ? spacing.md : 0,
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
          style={{ flex: 1, flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center' }}
        >
          <HabitIcon iconKey={habit.icon} size={24} />

          <View style={{ marginLeft: isRTL ? 0 : spacing.md, marginRight: isRTL ? spacing.md : 0, flex: 1 }}>
            {/* Main habit name */}
            <Text
              numberOfLines={1}
              style={{
                ...typography.bodyLarge,
                color: colors.habitTextPrimary,
                textAlign: isRTL ? 'right' : 'left',
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
                textAlign: isRTL ? 'right' : 'left',
              }}
            >
              {iconCfg.label} • {getFrequencyInLanguage()}{' '}
              • {getStatusInLanguage()}
            </Text>
          </View>
        </Pressable>
      </View>
    </View>
  )
}