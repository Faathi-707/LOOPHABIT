// File: app/(auth)/login.tsx

import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Pressable,
  Alert,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '@/utils/validation';
import { Button, Input } from '@/components/ui';
import { t } from '@/i18n';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'expo-router';
import { spacing, typography, useTheme, borderRadius } from '@/theme';

export default function LoginScreen() {
  const router = useRouter();
  const { login, continueAsGuest, isLoadingAuth, language } = useAuthStore();
  const { colors } = useTheme();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
      router.replace('/(app)/(habits)');
    } catch (err) {
      Alert.alert(
        t('error.title', language),
        err instanceof Error ? err.message : 'Login failed',
      );
    }
  };

  const handleGuestMode = () => {
    continueAsGuest();
    router.replace('/(app)/(habits)');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.xl,
          flexGrow: 1,
          justifyContent: 'center',
        }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Title */}
        <Text
          style={{
            ...typography.h1,
            textAlign: 'center',
            marginBottom: spacing.xl,
            color: colors.text,
            fontWeight: '700',
          }}
        >
          {t('auth.login', language)}
        </Text>

        {/* Email */}
        <View style={{ marginBottom: spacing.lg }}>
          <Text
            style={{
              ...typography.bodyLarge,
              marginBottom: spacing.sm,
              color: colors.text,
              fontWeight: '600',
            }}
          >
            {t('auth.email', language)}
          </Text>
          <Controller
            control={control}
            name="email"
            render={({ field: { value, onChange } }) => (
              <Input
                placeholder={t('auth.emailPlaceholder', language)}
                value={value}
                onChangeText={onChange}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            )}
          />
          {errors.email && (
            <Text style={{ color: colors.danger, marginTop: spacing.sm }}>
              {errors.email.message}
            </Text>
          )}
        </View>

        {/* Password */}
        <View style={{ marginBottom: spacing.xl }}>
          <Text
            style={{
              ...typography.bodyLarge,
              marginBottom: spacing.sm,
              color: colors.text,
              fontWeight: '600',
            }}
          >
            {t('auth.password', language)}
          </Text>
          <Controller
            control={control}
            name="password"
            render={({ field: { value, onChange } }) => (
              <Input
                placeholder={t('auth.passwordPlaceholder', language)}
                value={value}
                onChangeText={onChange}
                secureTextEntry
              />
            )}
          />
          {errors.password && (
            <Text style={{ color: colors.danger, marginTop: spacing.sm }}>
              {errors.password.message}
            </Text>
          )}
        </View>

        {/* Login Button */}
        <Pressable
          onPress={handleSubmit(onSubmit)}
          disabled={isLoadingAuth}
          style={({ pressed }) => ({
            backgroundColor: colors.primary,
            paddingVertical: spacing.lg,
            paddingHorizontal: spacing.lg,
            borderRadius: borderRadius.lg,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: spacing.md,
            opacity: pressed || isLoadingAuth ? 0.7 : 1,
          })}
        >
          <Text
            style={{
              ...typography.bodyLarge,
              color: '#fff',
              fontWeight: '600',
            }}
          >
            {isLoadingAuth
              ? t('common.loading', language)
              : t('auth.signinButton', language)}
          </Text>
        </Pressable>

        {/* Guest Mode Button */}
        <Pressable
          onPress={handleGuestMode}
          style={({ pressed }) => ({
            borderWidth: 2,
            borderColor: colors.primary,
            paddingVertical: spacing.lg,
            paddingHorizontal: spacing.lg,
            borderRadius: borderRadius.lg,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <Text
            style={{
              ...typography.bodyLarge,
              color: colors.primary,
              fontWeight: '600',
            }}
          >
            {t('auth.guestMode', language) || 'Guest Mode'}
          </Text>
        </Pressable>

        {/* Switch to Signup */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: spacing.xl,
            gap: spacing.xs,
          }}
        >
          <Text
            style={{
              ...typography.body,
              color: colors.textSecondary,
            }}
          >
            {t('auth.noAccount', language)}
          </Text>
          <Pressable onPress={() => router.push('/(auth)/signup')}>
            <Text
              style={{
                ...typography.body,
                color: colors.primary,
                fontWeight: '600',
              }}
            >
              {t('auth.switchToSignup', language)}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}