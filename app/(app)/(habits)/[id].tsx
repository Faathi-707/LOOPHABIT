// app/(app)/(habits)/[id].tsx
import React from 'react'
import {
  ScrollView,
  View,
  Text,
  Alert,
  Pressable,
  TextInput,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { habitSchema, habitColors, type HabitFormData } from '@/utils/validation'
import { Button } from '@/components/ui'
import { useHabitStore } from '@/store/habitStore'
import { useAuthStore } from '@/store/authStore'
import { t } from '@/i18n'
import { useTheme, spacing, typography, borderRadius } from '@/theme'
import { HabitIconPicker } from '@/components/habits/HabitIconPicker'
import { pressedStyle } from '@/utils/pressedStyle'

export default function EditHabitScreen() {
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id: string }>()
  const { colors } = useTheme()

  const habit = useHabitStore((s) => (id ? s.getHabitById(id) : undefined))
  const updateHabit = useHabitStore((s) => s.updateHabit)
  const deleteHabit = useHabitStore((s) => s.deleteHabit)
  const { language } = useAuthStore()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<HabitFormData>({
    resolver: zodResolver(habitSchema),
    defaultValues: habit
      ? {
          name: habit.name,
          icon: habit.icon,
          color: habit.color,
          frequency: habit.frequency,
          notes: habit.notes ?? '',
        }
      : undefined,
  })

  const onSubmit = async (data: HabitFormData) => {
    try {
      await updateHabit(id, {
        name: data.name,
        icon: data.icon,
        color: data.color,
        frequency: data.frequency,
        notes: data.notes,
      })
      router.back()
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to update habit'
      Alert.alert(t('error.title', language) || 'Error', msg)
    }
  }

  const onDelete = () => {
    Alert.alert(
      t('form.delete', language) || 'Delete habit',
      t('form.deleteConfirm', language) || 'Are you sure you want to delete?',
      [
        {
          text: t('common.cancel', language) || 'Cancel',
          style: 'cancel',
        },
        {
          text: t('form.delete', language) || 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteHabit(id)
              router.back()
            } catch (err) {
              const msg =
                err instanceof Error ? err.message : 'Failed to delete habit'
              Alert.alert(t('error.title', language) || 'Error', msg)
            }
          },
        },
      ],
    )
  }

  return (
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
        <Text
          style={{
            ...typography.h2,
            color: colors.text,
            marginBottom: spacing.md,
          }}
        >
          {t('form.update', language) || 'Edit habit'}
        </Text>

        {/* Name */}
        <View style={{ marginBottom: spacing.lg }}>
          <Text
            style={{
              ...typography.label,
              color: colors.textSecondary,
              marginBottom: spacing.xs,
            }}
          >
            {t('form.name', language) || 'Name'}
          </Text>
          <Controller
            control={control}
            name="name"
            render={({ field: { value, onChange } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                placeholder={
                  t('form.namePlaceholder', language) ||
                  'Drink 8 glasses of water'
                }
                placeholderTextColor={colors.textTertiary}
                style={{
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: borderRadius.lg,
                  paddingHorizontal: spacing.md,
                  paddingVertical: spacing.sm,
                  color: colors.text,
                  backgroundColor: colors.surface,
                }}
              />
            )}
          />
          {errors.name && (
            <Text
              style={{
                ...typography.bodySmall,
                color: colors.danger,
                marginTop: spacing.xs,
              }}
            >
              {errors.name.message}
            </Text>
          )}
        </View>

        {/* Frequency */}
        <View style={{ marginBottom: spacing.lg }}>
          <Text
            style={{
              ...typography.label,
              color: colors.textSecondary,
              marginBottom: spacing.xs,
            }}
          >
            {t('form.frequency', language) || 'Frequency'}
          </Text>
          <Controller
            control={control}
            name="frequency"
            render={({ field: { value, onChange } }) => (
              <View
                style={{
                  flexDirection: 'row',
                  gap: spacing.sm,
                  marginBottom: spacing.sm,
                }}
              >
                {(['daily', 'weekly', 'monthly'] as const).map((freq) => {
                  const active = value === freq
                  return (
                    <Pressable
                      key={freq}
                      onPress={() => onChange(freq)}
                      style={({ pressed }: { pressed: boolean }) => [
                        {
                          paddingHorizontal: spacing.md,
                          paddingVertical: spacing.sm,
                          borderRadius: borderRadius.full,
                          borderWidth: 1,
                          borderColor: active
                            ? colors.primary
                            : colors.border,
                          backgroundColor: active
                            ? colors.primary + '15'
                            : colors.surface,
                        },
                        pressedStyle(pressed, 0.97, 0.8),
                      ]}
                    >
                      <Text
                        style={{
                          ...typography.bodySmall,
                          color: active ? colors.primary : colors.text,
                        }}
                      >
                        {t(`form.${freq}`, language) ||
                          freq.charAt(0).toUpperCase() + freq.slice(1)}
                      </Text>
                    </Pressable>
                  )
                })}
              </View>
            )}
          />
        </View>

        {/* Icon picker */}
        <View style={{ marginBottom: spacing.lg }}>
          <Text
            style={{
              ...typography.label,
              color: colors.textSecondary,
              marginBottom: spacing.xs,
            }}
          >
            {t('form.icon', language) || 'Icon'}
          </Text>
          <Controller
            control={control}
            name="icon"
            render={({ field: { value, onChange } }) => (
              <HabitIconPicker value={value} onChange={onChange} />
            )}
          />
        </View>

        {/* Color */}
        <View style={{ marginBottom: spacing.lg }}>
          <Text
            style={{
              ...typography.label,
              color: colors.textSecondary,
              marginBottom: spacing.xs,
            }}
          >
            {t('form.color', language) || 'Color'}
          </Text>
          <Controller
            control={control}
            name="color"
            render={({ field: { value, onChange } }) => (
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: spacing.sm,
                }}
              >
                {habitColors.map((c) => {
                  const selected = value === c
                  return (
                    <Pressable
                      key={c}
                      onPress={() => onChange(c)}
                      style={({ pressed }: { pressed: boolean }) => [
                        {
                          width: 44,
                          height: 44,
                          borderRadius: borderRadius.lg,
                          backgroundColor: c,
                          borderWidth: selected ? 3 : 1,
                          borderColor: selected
                            ? colors.primary
                            : colors.border,
                        },
                        pressedStyle(pressed, 0.95, 0.8),
                      ]}
                    />
                  )
                })}
              </View>
            )}
          />
        </View>

        {/* Notes */}
        <View style={{ marginBottom: spacing.lg }}>
          <Text
            style={{
              ...typography.label,
              color: colors.textSecondary,
              marginBottom: spacing.xs,
            }}
          >
            {t('form.notes', language) || 'Notes'}
          </Text>
          <Controller
            control={control}
            name="notes"
            render={({ field: { value, onChange } }) => (
              <TextInput
                value={value || ''}
                onChangeText={onChange}
                placeholder={
                  t('form.notesPlaceholder', language) ||
                  'Add any details or rules for this habit'
                }
                placeholderTextColor={colors.textTertiary}
                multiline
                style={{
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: borderRadius.lg,
                  paddingHorizontal: spacing.md,
                  paddingVertical: spacing.sm,
                  color: colors.text,
                  minHeight: 80,
                  textAlignVertical: 'top',
                  backgroundColor: colors.surface,
                }}
              />
            )}
          />
        </View>

        <Button
          label={t('form.update', language) || 'Update habit'}
          onPress={handleSubmit(onSubmit)}
        />

        <Button
          label={t('form.delete', language) || 'Delete habit'}
          onPress={onDelete}
          variant="danger"
          style={{ marginTop: spacing.md }}
        />
      </ScrollView>
    </SafeAreaView>
  )
}
