// File: src/components/ui/index.tsx

import React from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TextInputProps,
  GestureResponderEvent,
} from 'react-native';
import { spacing, borderRadius, useTheme } from '@/theme';

/* -------------------- Button -------------------- */
type ButtonSize = 'sm' | 'md' | 'lg';
type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

export interface ButtonProps {
  label?: string;
  onPress?: (e: GestureResponderEvent) => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  size?: ButtonSize;
  style?: ViewStyle;
  textStyle?: TextStyle;
  children?: React.ReactNode;
  accessibilityLabel?: string;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  size = 'md',
  style,
  textStyle,
  children,
  accessibilityLabel,
}) => {
  const { colors } = useTheme();

  const variants: Record<ButtonVariant, { bg: string; text: string }> = {
    primary: { bg: colors.primary, text: '#fff' },
    secondary: { bg: colors.secondary, text: '#fff' },
    danger: { bg: colors.danger, text: '#fff' },
    ghost: { bg: 'transparent', text: colors.primary },
  };

  const sizes: Record<ButtonSize, { pv: number; ph: number; fs: number; h: number }> = {
    sm: { pv: spacing.sm, ph: spacing.md, fs: 12, h: 36 },
    md: { pv: spacing.md, ph: spacing.lg, fs: 14, h: 44 },
    lg: { pv: spacing.lg, ph: spacing.xl, fs: 16, h: 52 },
  };

  const v = variants[variant];
  const s = sizes[size];

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      style={[
        {
          minHeight: s.h,
          paddingVertical: s.pv,
          paddingHorizontal: s.ph,
          backgroundColor: v.bg,
          borderRadius: borderRadius.lg,
          borderWidth: variant === 'ghost' ? 1 : 0,
          borderColor: variant === 'ghost' ? colors.primary : 'transparent',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      {children ?? (
        <Text
          style={[
            {
              color: v.text,
              fontSize: s.fs,
              fontWeight: '600',
            },
            textStyle,
          ]}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};

/* -------------------- Card -------------------- */
export interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, style, onPress }) => {
  const { colors } = useTheme();

  const base: ViewStyle = {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    elevation: 2,
  };

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [base, pressed ? { opacity: 0.85 } : null, style]}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={[base, style]}>{children}</View>;
};

/* -------------------- Input -------------------- */
export interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  errorText?: string;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  style?: TextStyle; // extra alias for convenience
}

export const Input: React.FC<InputProps> = ({
  label,
  errorText,
  containerStyle,
  inputStyle,
  style,
  ...props
}) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.inputContainer, containerStyle]}>
      {label ? <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>{label}</Text> : null}
      <TextInput
        {...props}
        placeholderTextColor={colors.placeholder}
        style={[
          styles.input,
          {
            borderColor: colors.border,
            color: colors.text,
            backgroundColor: colors.surface,
          },
          inputStyle,
          style,
        ]}
      />
      {errorText ? (
        <Text style={[styles.inputError, { color: colors.danger }]}>{errorText}</Text>
      ) : null}
    </View>
  );
};

/* -------------------- Checkbox -------------------- */
export interface CheckboxProps {
  isChecked: boolean;
  onToggle: () => void;
  size?: number;
  color?: string;
  style?: ViewStyle;
  label?: string;
  labelStyle?: TextStyle;
  disabled?: boolean;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  isChecked,
  onToggle,
  size = 24,
  color,
  style,
  label,
  labelStyle,
  disabled,
}) => {
  const { colors } = useTheme();
  const activeColor = color ?? colors.primary;

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: isChecked, disabled }}
      onPress={() => !disabled && onToggle()}
      style={({ pressed }) => [
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          opacity: pressed && !disabled ? 0.85 : 1,
        },
        style,
      ]}
    >
      <View
        style={{
          width: size,
          height: size,
          borderRadius: 6,
          borderWidth: 2,
          borderColor: isChecked ? activeColor : colors.border,
          backgroundColor: isChecked ? activeColor : 'transparent',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {isChecked ? (
          <Text style={{ color: '#fff', fontSize: 14, fontWeight: '700' }}>✓</Text>
        ) : null}
      </View>
      {label ? (
        <Text style={[{ color: colors.text, fontSize: 15 }, labelStyle]}>{label}</Text>
      ) : null}
    </Pressable>
  );
};

/* -------------------- Styles -------------------- */
const styles = StyleSheet.create({
  inputContainer: { gap: 6 },
  inputLabel: {
    fontSize: 14,
  },
  input: {
    height: 44,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
  },
  inputError: {
    fontSize: 12,
  },
});
