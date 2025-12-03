// app/(app)/(habits)/new.tsx

import React from 'react'
import {
  ScrollView,
  View,
  Text,
  Alert,
  Pressable,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  habitSchema,
  habitColors,
  type HabitFormData,
} from '@/utils/validation'
import { Input, Button } from '@/components/ui'
import { Chip } from '@/components/ui/Chip'
import { useRouter } from 'expo-router'
import { useHabitStore } from '@/store/habitStore'
import { useAuthStore } from '@/store/authStore'
import { spacing, typography, useTheme, borderRadius } from '@/theme'
import { t } from '@/i18n'
import { pressedStyle } from '@/utils/pressedStyle'
import { HabitIconPicker } from '@/components/habits/HabitIconPicker'
import { DEFAULT_HABIT_ICON_KEY } from '@/constants/habitIcons'

export default function NewHabitScreen() {
  const router = useRouter()
  const addHabit = useHabitStore((s) => s.addHabit)
  const { language, isLoggedIn } = useAuthStore()
  const { colors } = useTheme()

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<HabitFormData>({
    resolver: zodResolver(habitSchema),
    defaultValues: {
      frequency: 'daily',
      icon: DEFAULT_HABIT_ICON_KEY,
      color: '#FFB3D9', // or habitColors[0]
    },
  })

  const selectedIconKey = watch('icon') || DEFAULT_HABIT_ICON_KEY

  const onSubmit = async (data: HabitFormData) => {
      try {
      await addHabit({
        name: data.name,
        icon: data.icon,        
        color: data.color,
        frequency: data.frequency,
        notes: data.notes,
      })
      router.back()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      console.warn('[habits/create]', err)
      Alert.alert(
        t('error.title', language) || 'Error',
        message,
      )
    }
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
      edges={['top', 'left', 'right']}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: spacing.lg, paddingTop: spacing.sm }}
      >
        <Text
          style={{
            ...typography.h2,
            marginBottom: spacing.md,
            color: colors.text,
          }}
        >
          {t('form.create', language)}
        </Text>

        {/* Name Field */}
        <View style={{ marginBottom: spacing.xl }}>
          <Text
            style={{
              ...typography.label,
              color: colors.text,
            }}
          >
          </Text>
          <Controller
            control={control}
            name="name"
            render={({ field: { value, onChange } }) => (
              <Input
                placeholder={t('form.namePlaceholder', language)}
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {errors.name && (
            <Text style={{ color: colors.danger, marginTop: spacing.sm }}>
              {errors.name.message}
            </Text>
          )}
        </View>

        {/* Frequency Field */}
        <View style={{ marginBottom: spacing.xl }}>
          <Text
            style={{
              ...typography.label,
              marginBottom: spacing.sm,
              color: colors.text,
            }}
          >
            {t('form.frequency', language)}
          </Text>
          <Controller
            control={control}
            name="frequency"
            render={({ field: { value, onChange } }) => (
              <View style={{ flexDirection: 'row', gap: spacing.md }}
              >
                {(['daily', 'weekly', 'monthly'] as const).map((freq) => (
                  <Chip
                    key={freq}
                    label={t(`form.${freq}`, language)}
                    selected={value === freq}
                    onPress={() => onChange(freq)}
                  />
                ))}
              </View>
            )}
          />
        </View>

        {/* Icon Field using HabitIconPicker */}
        <View style={{ marginBottom: spacing.xl }}>
          <HabitIconPicker
            value={selectedIconKey}
            onChange={(iconKey) => setValue('icon', iconKey, { shouldValidate: true })}
            label={t('form.icon', language) || 'Icon'}
          />
        </View>

        {/* Color Field */}
        <View style={{ marginBottom: spacing.xl }}>
          <Text
            style={{
              ...typography.label,
              marginBottom: spacing.sm,
              color: colors.text,
            }}
          >
            {t('form.color', language)}
          </Text>
          <Controller
            control={control}
            name="color"
            render={({ field: { value, onChange } }) => (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View
                  style={{
                    flexDirection: 'row',
                    gap: spacing.sm,
                  }}
                >
                  {habitColors.map((c) => {
                    const isSelected = value === c
                    return (
                      <Pressable
                        key={c}
                        onPress={() => onChange(c)}
                        style={({ pressed }) => [
                          {
                            width: 40,
                            height: 40,
                            borderRadius: borderRadius.md,
                            backgroundColor: c,
                            borderWidth: isSelected ? 2 : 1,
                            borderColor: isSelected
                              ? colors.primary
                              : colors.border,
                          },
                          pressedStyle(pressed, 0.95, 0.8),
                        ]}
                        accessibilityRole="button"
                        accessibilityLabel={`Select color ${c}`}
                        accessibilityState={{ selected: isSelected }}
                      />
                    )
                  })}
                </View>
              </ScrollView>
            )}
          />
        </View>

        {/* Notes Field */}
        <View style={{ marginBottom: spacing.xl }}>
          <Text
            style={{
              ...typography.label,
              marginBottom: spacing.sm,
              color: colors.text,
            }}
          >
            {t('form.notes', language)}
          </Text>
          <Controller
            control={control}
            name="notes"
            render={({ field: { value, onChange } }) => (
              <Input
                placeholder={t('form.notesPlaceholder', language)}
                value={value || ''}
                onChangeText={onChange}
                multiline
                style={{ height: 50 }}
              />
            )}
          />
        </View>

        {/* Submit Button */}
        <Button
          label={t('form.create', language)}
          onPress={handleSubmit(onSubmit)}
        />
      </ScrollView>
    </SafeAreaView>
  )
}