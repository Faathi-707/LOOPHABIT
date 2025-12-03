import React, { useState, useEffect } from 'react'
import { ScrollView, View, Text, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useHabitStore } from '@/store/habitStore'
import { useAuthStore } from '@/store/authStore'
import { spacing, typography, borderRadius, useTheme } from '@/theme'
import { t } from '@/i18n'
// Types for readability
type Bucket = {
  completed: number
  total: number
  percentage: number
}

interface RingProps {
  title: string
  bucket: Bucket
  accentColor: string
}

const Ring: React.FC<RingProps> = ({ title, bucket, accentColor }) => {
  const { colors } = useTheme()

  const pct = bucket.total > 0 ? Math.round(bucket.percentage) : 0
  const ringColor = bucket.total > 0 ? accentColor : colors.border

  return (
    <View style={{ width: '30%', alignItems: 'center' }}>
      <View
        style={{
          width: 110,
          height: 110,
          borderRadius: 55,
          borderWidth: 8,
          borderColor: ringColor,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.surface,
        }}
      >
        <Text style={{ ...typography.h3, color: colors.text, fontWeight: '600' }}>{pct} %</Text>
      </View>

      <Text
        style={{
          ...typography.label,
          marginTop: spacing.md,
          color: colors.text,
          textAlign: 'center',
          fontWeight: '600',
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          ...typography.bodySmall,
          color: colors.textSecondary,
          marginTop: spacing.xs,
        }}
      >
        {bucket.completed}/{bucket.total}
      </Text>
    </View>
  )
}

interface StatCardProps {
  label: string
  accentColor: string
  completed: number
  total: number
}

const StatCard: React.FC<StatCardProps> = ({ label, accentColor, completed, total }) => {
  const { colors, isRTL } = useTheme()
  const percentage = total > 0 ? (completed / total) * 100 : 0

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        padding: spacing.lg,
        marginBottom: spacing.md,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <View
        style={{
          position: 'absolute',
          left: isRTL ? 'auto' : 0,
          right: isRTL ? 0 : 'auto',
          top: 0,
          bottom: 0,
          width: `${percentage}%`,
          backgroundColor: accentColor,
          opacity: 0.15,
          zIndex: 0,
        }}
      />
      <Text
        style={{
          ...typography.body,
          color: colors.text,
          fontWeight: '600',
          zIndex: 1,
          textAlign: isRTL ? 'right' : 'left',
        }}
      >
        {label}
      </Text>
    </View>
  )
}

export default function ProgressScreen() {
  const { getProgress } = useHabitStore()
  const { language } = useAuthStore()
  const { colors, isRTL } = useTheme()

  const progress = getProgress()
  const totalHabits =
    progress.daily.total + progress.weekly.total + progress.monthly.total

  const dailyLabel = t('stats.daily', language) || 'Daily Habits'
  const weeklyLabel = t('stats.weekly', language) || 'Weekly Habits'
  const monthlyLabel = t('stats.monthly', language) || 'Monthly Habits'

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
      edges={['top', 'left', 'right']}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          padding: spacing.lg,
          paddingTop: spacing.sm,
          paddingBottom: spacing.xl,
        }}
      >
        <Text
          style={{
            ...typography.h2,
            color: colors.text,
            marginBottom: spacing.md,
            textAlign: isRTL ? 'right' : 'left',
          }}
        >
          {t('stats.title', language) || 'Progress'}
        </Text>
        {/* Habit Progress Section */}
        <>
          <Text
            style={{
              ...typography.body,
              color: colors.textSecondary,
              marginBottom: spacing.md,
              fontWeight: '600',
              textAlign: isRTL ? 'right' : 'left',
            }}
          >
            Habit Progress
          </Text>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: spacing.xl,
              }}
            >
              <Ring
                title={dailyLabel}
                bucket={progress.daily as Bucket}
                accentColor={
                  progress.daily.total > 0 ? colors.progressDaily : colors.progressTrack
                }
              />
              <Ring
                title={weeklyLabel}
                bucket={progress.weekly as Bucket}
                accentColor={
                  progress.weekly.total > 0 ? colors.progressWeekly : colors.progressTrack
                }
              />
              <Ring
                title={monthlyLabel}
                bucket={progress.monthly as Bucket}
                accentColor={
                  progress.monthly.total > 0 ? colors.progressMonthly : colors.progressTrack
                }
              />
            </View>

            <View style={{ marginTop: spacing.sm }}>
              <StatCard
                label={`${dailyLabel}: ${progress.daily.completed}/${progress.daily.total}`}
                accentColor={
                  progress.daily.total > 0 ? colors.progressDaily : colors.progressTrack
                }
                completed={progress.daily.completed}
                total={progress.daily.total}
              />
              <StatCard
                label={`${weeklyLabel}: ${progress.weekly.completed}/${progress.weekly.total}`}
                accentColor={
                  progress.weekly.total > 0 ? colors.progressWeekly : colors.progressTrack
                }
                completed={progress.weekly.completed}
                total={progress.weekly.total}
              />
              <StatCard
                label={`${monthlyLabel}: ${progress.monthly.completed}/${progress.monthly.total}`}
                accentColor={
                  progress.monthly.total > 0 ? colors.progressMonthly : colors.progressTrack
                }
                completed={progress.monthly.completed}
                total={progress.monthly.total}
              />
            </View>
          </>
        </ScrollView>
      </SafeAreaView>
    )
  }
