export const colors = {
  light: {
    // Backgrounds
    background: '#F8F8FB',
    surface: '#FFFFFF',
    surfaceAlt: '#F3F4F6',

    // Text
    text: '#111827',
    textSecondary: '#6B7280',
    textTertiary: '#9CA3AF',

    // Brand / semantic
    primary: '#F97373',       // main brand, buttons, active states
    primarySoft: '#FEE2E2',
    secondary: '#3B82F6',     // weekly / secondary actions
    secondaryLight: '#DBEAFE',
    accent: '#FBBF24',
    success: '#22C55E',
    warning: '#f6b98eff',
    danger: '#b45555ff',

    // Habit cards (light, category specific)
    habitDaily:  '#F7C4D4',   // soft rose
    habitWeekly: '#D6E4FF',   // muted blue
    habitMonthly:'#D3F3E0',   // muted green
    habitExtra1: '#FCECC5',   // soft amber
    habitExtra2: '#E6D6F2',   // soft violet
    habitExtra3: '#D4EFF5',   // soft cyan

    // Text on habit cards in light mode
    habitTextPrimary: '#0F172A',
    habitTextSecondary: 'rgba(15, 23, 42, 0.7)',

    // Progress rings and bars
    progressDaily: '#f694cf',
    progressWeekly: '#f6d194',
    progressMonthly: '#bae7fc',
    progressTrack: '#E5E7EB',
    
    // UI elements
    border: '#E5E7EB',
    placeholder: '#D1D5DB',
    disabled: '#F3F4F6',

    // Shadows
    shadow: 'rgba(0, 0, 0, 0.05)',
  },

  dark: {
    // Backgrounds
    background: '#020617',    // slightly darker than before
    surface: '#132529ff',
    surfaceAlt: '#1E293B',

    // Text
    text: '#F9FAFB',
    textSecondary: '#CBD5E1',
    textTertiary: '#94A3B8',

    // Brand / semantic (richer in dark mode)
    primary: '#F97373',
    primarySoft: '#7C2D38',
    secondary: '#38BDF8',
    secondaryLight: '#0C2D48',
    accent: '#FACC15',
    success: '#56b87aff',
    warning: '#b17042ff',
    danger: '#cd6363ff',

    // Habit cards in dark mode
    // These are darker, desaturated tints. No neon.
    habitDaily:  '#a77191ff',
    habitWeekly: '#717ba7ff',
    habitMonthly:'#6cad8dff',
    habitExtra1: '#c1a762ff',
    habitExtra2: '#904ea1ff',
    habitExtra3: '#426d8d',

    habitTextPrimary: '#F9FAFB',
    habitTextSecondary: 'rgba(241, 245, 249, 0.72)',
    
    progressDaily: '#c96977ff',
    progressWeekly: '#326e88ff',
    progressMonthly: '#3f945eff',
    progressTrack: '#223349ff',
    
    border: '#334155',
    placeholder: '#475569',
    disabled: '#1F2937',

    // Shadows
    shadow: 'rgba(0, 0, 0, 0.5)',
  },
};

export type ColorScheme = keyof typeof colors;

export const getColor = (
  isDarkMode: boolean,
  colorKey: keyof typeof colors.light
): string => {
  const scheme = isDarkMode ? colors.dark : colors.light;
  return (scheme as any)[colorKey] ?? (colors.light as any)[colorKey];
};