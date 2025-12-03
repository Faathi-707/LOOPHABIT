import { useAuthStore } from '@/store/authStore';
import { colors } from '@/theme/colors';

export const useTheme = () => {
  const { isDarkMode, language } = useAuthStore();
  const isRTL = language === 'dv'; // Dhivehi is RTL

  return {
    isDark: isDarkMode,
    isRTL,
    colors: isDarkMode ? colors.dark : colors.light,
  };
};

export { colors } from '@/theme/colors';
export { spacing, typography, borderRadius, shadows } from '@/theme/spacing';