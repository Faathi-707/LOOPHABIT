// File: app/(app)/(habits)/index.tsx

import { ScrollView, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { useHabitStore } from '@/store/habitStore';
import { useAuthStore } from '@/store/authStore';
import { HabitCard } from '@/components/habits/HabitCard';
import { EmptyState } from '@/components/EmptyState';
import { Button } from '@/components/ui';
import { useRouter } from 'expo-router';
import { spacing, typography, useTheme } from '@/theme';
import { t } from '@/i18n';

export default function HabitsScreen() {
  const router = useRouter();
  const habits = useHabitStore((s) => s.habits);
  const completions = useHabitStore((s) => s.completions);
  const toggleCompletion = useHabitStore((s) => s.toggleCompletion);
  const load = useHabitStore((s) => s.load);
  const { language } = useAuthStore();
  const { colors } = useTheme();
  const [selectedDate, setSelectedDate] = useState<string | undefined>();

  // Load habits on mount and when auth state changes
  useEffect(() => {
    load().catch(console.error);
  }, [load]);

  const activeHabits = habits.filter((h) => h.isActive);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top', 'left', 'right']}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1, padding: spacing.lg, paddingTop: spacing.sm }}
      >
        {/* Headline + action */}
        <View
          style={{
            marginBottom: spacing.lg,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: spacing.md,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={{ ...typography.h2, color: colors.text, marginBottom: spacing.xs }}>
              {t('habits.title', language)}
            </Text>
            <Text style={{ ...typography.body, color: colors.textSecondary }}>
              {t('habits.subtitle', language)}
            </Text>
          </View>
          <Button
            label="+ Add"
            onPress={() => router.push('/(app)/(habits)/new')}
            size="sm"
          />
        </View>
        {/* Content */}
        {activeHabits.length === 0 ? (
          <EmptyState
            title={t('habits.empty', language)}
          />
        ) : (
          <View>
            {/* Daily Section */}
            {activeHabits.filter(h => h.frequency === 'daily').length > 0 && (
              <>
                <Text style={{ ...typography.label, color: colors.textSecondary, marginTop: spacing.lg, marginBottom: spacing.md }}>
                  Daily
                </Text>
                <View style={{ gap: spacing.md, marginBottom: spacing.xl }}>
                  {activeHabits.filter(h => h.frequency === 'daily').map((habit) => (
                    <HabitCard
                      key={habit.id}
                      habit={habit}
                      completions={completions}
                      onPress={() => router.push(`/(app)/(habits)/${habit.id}`)}
                      onToggleCompletion={toggleCompletion}
                    />
                  ))}
                </View>
              </>
            )}

            {/* Weekly Section */}
            {activeHabits.filter(h => h.frequency === 'weekly').length > 0 && (
              <>
                <Text style={{ ...typography.label, color: colors.textSecondary, marginTop: spacing.lg, marginBottom: spacing.md }}>
                  Weekly
                </Text>
                <View style={{ gap: spacing.md, marginBottom: spacing.xl }}>
                  {activeHabits.filter(h => h.frequency === 'weekly').map((habit) => (
                    <HabitCard
                      key={habit.id}
                      habit={habit}
                      completions={completions}
                      onPress={() => router.push(`/(app)/(habits)/${habit.id}`)}
                      onToggleCompletion={toggleCompletion}
                    />
                  ))}
                </View>
              </>
            )}

            {/* Monthly Section */}
            {activeHabits.filter(h => h.frequency === 'monthly').length > 0 && (
              <>
                <Text style={{ ...typography.label, color: colors.textSecondary, marginTop: spacing.lg, marginBottom: spacing.md }}>
                  Monthly
                </Text>
                <View style={{ gap: spacing.md, marginBottom: spacing.xl }}>
                  {activeHabits.filter(h => h.frequency === 'monthly').map((habit) => (
                    <HabitCard
                      key={habit.id}
                      habit={habit}
                      completions={completions}
                      onPress={() => router.push(`/(app)/(habits)/${habit.id}`)}
                      onToggleCompletion={toggleCompletion}
                    />
                  ))}
                </View>
              </>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}