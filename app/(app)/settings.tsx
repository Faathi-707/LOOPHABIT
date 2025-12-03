// app/(app)/settings.tsx
import React from 'react';
import {
  ScrollView,
  View,
  Text,
  Switch,
  Pressable,
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store';
import { useHabitStore } from '@/store/habitStore';
import { spacing, typography, useTheme, borderRadius } from '@/theme';
import { Button } from '@/components/ui';
import { t } from '@/i18n';
import { pressedStyle } from '@/utils/pressedStyle';

export default function SettingsScreen() {
  const router = useRouter()
  const {
    logout,
    toggleDarkMode,
    setLanguage,
    isDarkMode,
    language, 
    isLoggedIn,
    user,
  } = useAuthStore()
  const { clearAll } = useHabitStore()
  const { colors, isDark, isRTL } = useTheme()

  const handleLogout = () => {
    Alert.alert(
      t('settings.logoutConfirm', language) || 'Confirm Logout',
      t('settings.logoutConfirmMessage', language) ||
        'Are you sure you want to logout?',
      [
        { text: t('common.cancel', language) || 'Cancel', style: 'cancel' },
        {
          text: t('auth.logout', language) || 'Log Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearAll()
              await logout()
              router.replace('/(auth)/login')
            } catch (err) {
              Alert.alert(
                t('error.title', language) || 'Error',
                err instanceof Error ? err.message : 'Failed to logout',
              )
            }
          },
        },
      ],
    )
  }

  return (
    <>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      <SafeAreaView
        style={{ flex: 1, backgroundColor: colors.background }}
        edges={['top', 'left', 'right']}
      >
        <ScrollView
          contentContainerStyle={{
            padding: spacing.lg,
            paddingTop: spacing.sm,
            paddingBottom: spacing.xl,
          }}
        >
          {/* User Info Card */}
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: borderRadius.lg,
              padding: spacing.xxl,
              marginBottom: spacing.lg,
              borderLeftWidth: 4,
              borderLeftColor: colors.primary,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            {isLoggedIn && user ? (
              <>
                <Text
                  style={{
                    ...typography.label,
                    color: colors.textSecondary,
                    marginBottom: spacing.xs,
                    textAlign: isRTL ? 'right' : 'left',
                  }}
                >
                  {t('auth.name', language) || 'Name'}
                </Text>
                <Text
                  style={{
                    ...typography.bodyLarge,
                    color: colors.text,
                    marginBottom: spacing.md,
                    textAlign: isRTL ? 'right' : 'left',
                  }}
                >
                  {user.name}
                </Text>

                <Text
                  style={{
                    ...typography.label,
                    color: colors.textSecondary,
                    marginBottom: spacing.xs,
                    textAlign: isRTL ? 'right' : 'left',
                  }}
                >
                  {t('auth.email', language) || 'Email'}
                </Text>
                <Text
                  style={{
                    ...typography.bodyLarge,
                    color: colors.text,
                    marginBottom: spacing.lg,
                    textAlign: isRTL ? 'right' : 'left',
                  }}
                >
                  {user.email}
                </Text>

                <Button
                  label={t('auth.logout', language) || 'Log Out'}
                  onPress={handleLogout}
                  variant="danger"
                />
              </>
            ) : (
              <>
                <Text
                  style={{
                    ...typography.body,
                    color: colors.textSecondary,
                    marginBottom: spacing.md,
                    textAlign: isRTL ? 'right' : 'left',
                  }}
                >
                  {t('auth.noAccount', language) || 'Not signed in'}
                </Text>
                <Button
                  label={t('auth.signup', language) || 'Sign In'}
                  onPress={() => router.push('/(auth)/signup')}
                />
              </>
            )}
          </View>

          {/* Theme Section */}
          <Text
            style={{
              ...typography.label,
              color: colors.textSecondary,
              marginBottom: spacing.md,
              marginTop: spacing.lg,
              textAlign: isRTL ? 'right' : 'left',
            }}
          >
            {t('settings.theme', language) || 'Theme'}
          </Text>

          <View
            style={{
              flexDirection: isRTL ? 'row-reverse' : 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderWidth: 1,
              padding: spacing.lg,
              borderRadius: borderRadius.lg,
              marginBottom: spacing.lg,
            }}
          >
            <Text
              style={{
                ...typography.body,
                color: colors.text,
                textAlign: isRTL ? 'right' : 'left',
              }}
            >
              {t('settings.darkMode', language) || 'Dark Mode'}
            </Text>
            <Switch
              value={isDarkMode}
              onValueChange={toggleDarkMode}
              thumbColor={isDarkMode ? colors.primary : colors.secondary}
              trackColor={{
                false: colors.border,
                true: colors.primary + '40',
              }}
            />
          </View>

          {/* Language Section */}
          <Text
            style={{
              ...typography.label,
              color: colors.textSecondary,
              marginBottom: spacing.md,
              textAlign: isRTL ? 'right' : 'left',
            }}
          >
            {t('settings.language', language) || 'Language'}
          </Text>

          <View style={{ gap: spacing.md, marginBottom: spacing.xl }}>
            {/* English */}
            <Pressable
              onPress={() => setLanguage('en')}
              style={({ pressed }) => [
                {
                  backgroundColor:
                    language === 'en' ? colors.primary : colors.surface,
                  padding: spacing.md,
                  borderRadius: borderRadius.lg,
                  borderWidth: language === 'en' ? 0 : 1,
                  borderColor: colors.border,
                },
                pressedStyle(pressed, 0.98, 0.7),
              ]}
              accessibilityRole="button"
              accessibilityLabel="Select English language"
              accessibilityState={{ selected: language === 'en' }}
            >
              <Text
                style={{
                  ...typography.body,
                  color: language === 'en' ? '#fff' : colors.text,
                  textAlign: 'center',
                }}
              >
                {t('settings.english', language) || 'English'}
              </Text>
            </Pressable>

            {/* Dhivehi */}
            <Pressable
              onPress={() => setLanguage('dv')}
              style={({ pressed }) => [
                {
                  backgroundColor:
                    language === 'dv' ? colors.primary : colors.surface,
                  padding: spacing.md,
                  borderRadius: borderRadius.lg,
                  borderWidth: language === 'dv' ? 0 : 1,
                  borderColor: colors.border,
                },
                pressedStyle(pressed, 0.98, 0.7),
              ]}
              accessibilityRole="button"
              accessibilityLabel="Select Dhivehi language"
              accessibilityState={{ selected: language === 'dv' }}
            >
              <Text
                style={{
                  ...typography.body,
                  color: language === 'dv' ? '#fff' : colors.text,
                  textAlign: 'center',
                }}
              >
                {t('settings.dhivehi', language) || 'ދިވެހި'}
              </Text>
            </Pressable>
          </View>

          {/* About Section */}
          <Text
            style={{
              ...typography.label,
              color: colors.textSecondary,
              marginBottom: spacing.md,
              textAlign: isRTL ? 'right' : 'left',
            }}
          >
            {t('settings.about', language) || 'About'}
          </Text>
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: borderRadius.lg,
              borderColor: colors.border,
              borderWidth: 1,
              padding: spacing.lg,
              marginBottom: spacing.xl,
            }}
          >
            <View
              style={{
                flexDirection: isRTL ? 'row-reverse' : 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Text style={{ ...typography.body, color: colors.text, textAlign: isRTL ? 'right' : 'left' }}>
                App Version
              </Text>
              <Text
                style={{
                  ...typography.bodySmall,
                  color: colors.textSecondary,
                  textAlign: isRTL ? 'right' : 'left',
                }}
              >
                1.0.0
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  )
}
