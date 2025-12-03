// app/(app)/_layout.tsx
import React from 'react'
import { Tabs, useRouter, Redirect } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Pressable } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme } from '@/theme'
import { useAuthStore } from '@/store/authStore'
import { t } from '@/i18n'

export default function AppTabsLayout() {
  const { colors } = useTheme()
  const { language, isLoggedIn, isGuest } = useAuthStore()
  const insets = useSafeAreaInsets()
  const router = useRouter()

  // Auth guard for everything under (app)
  if (!isLoggedIn && !isGuest) {
    return <Redirect href="/(auth)/login" />
  }

  return (
    <Tabs
      screenOptions={{
        headerTitleAlign: 'left',
        headerTitle: 'Habit Tracker',
        headerStyle: {
          backgroundColor: colors.surface,
          borderBottomColor: colors.border,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 24,
          color: colors.text,
        },
        headerRight: () => (
          <Pressable
            onPress={() => router.push('/(app)/settings')}
            style={{
              marginRight: 16,
              width: 44,
              height: 44,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            hitSlop={8}
          >
            <Ionicons name="settings-outline" size={28} color={colors.text} />
          </Pressable>
        ),
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 64 + (insets.bottom || 0),
          paddingBottom: insets.bottom || 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          paddingBottom: 2,
        },
      }}
    >
      {/* TAB 1: Habits */}
      <Tabs.Screen
        name="(habits)"
        options={{
          tabBarLabel: 'Habits',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="checkmark-circle" color={color} size={size} />
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate({
              name: '(habits)',
              params: {
                screen: 'index',
              },
            } as any);
          },
        })}
      />

      {/* TAB 2: Progress */}
      <Tabs.Screen
        name="progress"
        options={{
          href: '/(app)/progress',
          tabBarLabel: 'Progress',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bar-chart" color={color} size={size} />),
        }}
      />
      {/* Settings is a route, but NOT a tab button */}
      <Tabs.Screen
        name="settings"
        options={{
          href: null, // hides from tab bar
        }}
      />
    </Tabs>
  )
}
