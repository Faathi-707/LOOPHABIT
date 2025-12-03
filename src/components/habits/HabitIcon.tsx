// src/components/habits/HabitIcon.tsx
import React from 'react'
import { View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { getHabitIconConfig } from '@/constants/habitIcons'
import { useTheme, borderRadius, spacing } from '@/theme'

type Props = {
  iconKey?: string | null
  size?: number
  withBackground?: boolean
}

export const HabitIcon: React.FC<Props> = ({
  iconKey,
  size = 24,
  withBackground = true,
}) => {
  const { colors } = useTheme()
  const cfg = getHabitIconConfig(iconKey ?? undefined)

  if (!withBackground) {
    return (
      <Ionicons
        name={cfg.icon as any}
        size={size}
        color={colors.text}
      />
    )
  }

  return (
    <View
      style={{
        width: size + spacing.md,
        height: size + spacing.md,
        borderRadius: borderRadius.full,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Ionicons
        name={cfg.icon as any}
        size={size}
        color={colors.text}
      />
    </View>
  )
}
