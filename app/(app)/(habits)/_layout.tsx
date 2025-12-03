// app/(app)/(habits)/_layout.tsx
import React from 'react'
import { Stack } from 'expo-router'
import { useTheme } from '@/theme'

export default function HabitsLayout() {
  const { colors } = useTheme()

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen
        name="new"
        options={{
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          presentation: 'modal',
        }}
      />
    </Stack>
  )
}
