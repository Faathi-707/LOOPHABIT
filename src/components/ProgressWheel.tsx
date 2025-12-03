// File: src/components/ProgressWheel.tsx

import React from 'react';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';
import { spacing, typography, borderRadius, useTheme } from '@/theme';
import { View, Text } from 'react-native';


interface ProgressWheelProps {
  percentage: number;
  label: string;
  color: string;
  size?: number;
}

export const ProgressWheel: React.FC<ProgressWheelProps> = ({
  percentage,
  label,
  color,
  size = 120,
}) => {
  const { colors } = useTheme();
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <View style={{ alignItems: 'center', gap: spacing.md }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.border}
          strokeWidth={4}
          fill="none"
        />
        {/* Progress circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={4}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        {/* Percentage text */}
        <SvgText
          x={size / 2}
          y={size / 2 + 8}
          textAnchor="middle"
          fontSize={20}
          fontWeight="bold"
          fill={colors.text}
        >
          {Math.round(percentage)}%
        </SvgText>
      </Svg>
      <Text style={{ ...typography.label, color: colors.textSecondary }}>{label}</Text>
    </View>
  );
};