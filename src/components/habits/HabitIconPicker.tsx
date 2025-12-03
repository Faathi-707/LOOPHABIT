// src/components/habits/HabitIconPicker.tsx
import React, { useMemo, useState } from 'react'
import {
  Modal,
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import {
  HABIT_ICONS,
  getHabitIconConfig,
  DEFAULT_HABIT_ICON_KEY,
} from '@/constants/habitIcons'
import { useTheme, spacing, typography, borderRadius } from '@/theme'
import { pressedStyle } from '@/utils/pressedStyle'

type Props = {
  value?: string | null
  onChange: (iconKey: string) => void
  label?: string
}

export const HabitIconPicker: React.FC<Props> = ({
  value,
  onChange,
  label = 'Icon',
}) => {
  const { colors } = useTheme()
  const [visible, setVisible] = useState(false)

  const activeKey = value || DEFAULT_HABIT_ICON_KEY

  const selected = useMemo(
    () => getHabitIconConfig(activeKey),
    [activeKey],
  )

  const handleSelect = (key: string) => {
    onChange(key)
    setVisible(false)
  }

  const selectedIconName = selected?.icon ?? 'sparkles-outline'
  const selectedLabel = selected?.label ?? 'Select icon'

  return (
    <>
      {/* Field label in the form */}
      <Text
        style={{
          ...typography.label,
          color: colors.textSecondary,
          marginBottom: spacing.xs,
        }}
      >
        {label}
      </Text>

      {/* Tappable field showing current selection */}
      <Pressable
        onPress={() => setVisible(true)}
        style={({ pressed }) => [
          {
            flexDirection: 'row',
            alignItems: 'center',
            padding: spacing.md,
            borderRadius: borderRadius.lg,
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.surface,
          },
          pressedStyle(pressed),
        ]}
      >
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: borderRadius.full,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.border,
            marginRight: spacing.md,
          }}
        >
          <Ionicons
            name={selectedIconName as any}
            size={20}
            color={colors.text}
          />
        </View>

        <View style={{ flex: 1 }}>
          <Text
            style={{
              ...typography.bodySmall,
              color: colors.textSecondary,
            }}
          >
            Tap to choose icon
          </Text>
        </View>

        <Ionicons
          name="chevron-forward"
          size={18}
          color={colors.textTertiary}
        />
      </Pressable>

      {/* Modal with flat icon grid */}
      <Modal
        animationType="slide"
        visible={visible}
        transparent
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.backdrop}>
          <View
            style={[
              styles.sheet,
              {
                backgroundColor: colors.surface,
                borderTopColor: colors.border,
              },
            ]}
          >
            {/* Header */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: spacing.md,
              }}
            >
              <Text
                style={{
                  ...typography.h3,
                  color: colors.text,
                }}
              >
                Choose icon
              </Text>
              <Pressable
                onPress={() => setVisible(false)}
                style={({ pressed }) => [
                  {
                    paddingHorizontal: spacing.md,
                    paddingVertical: spacing.xs,
                    borderRadius: borderRadius.full,
                    borderWidth: 1,
                    borderColor: colors.border,
                  },
                  pressedStyle(pressed),
                ]}
              >
                <Text
                  style={{
                    ...typography.bodySmall,
                    color: colors.textSecondary,
                  }}
                >
                  Close
                </Text>
              </Pressable>
            </View>

            {/* Icon grid (all icons, no categories) */}
            <ScrollView
              contentContainerStyle={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: spacing.md,
                paddingBottom: spacing.lg,
                justifyContent: 'flex-start',
              }}
            >
              {HABIT_ICONS.map((icon) => {
                const isActive = icon.key === activeKey
                return (
                  <Pressable
                    key={icon.key}
                    onPress={() => handleSelect(icon.key)}
                    style={({ pressed }) => [
                      {
                        width: '20%',
                        minHeight: 60,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: borderRadius.md,
                        borderWidth: isActive ? 2 : 1,
                        borderColor: isActive
                          ? colors.primary
                          : colors.border,
                        backgroundColor: isActive
                          ? colors.primarySoft
                          : colors.background,
                      },
                      pressedStyle(pressed),
                    ]}
                  >
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Ionicons
                        name={icon.icon as any}
                        size={28}
                        color={isActive ? colors.primary : colors.text}
                      />
                    </View>
                  </Pressable>
                )
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    maxHeight: '70%',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
  },
})
