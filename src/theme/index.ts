import { useAuthStore } from '@/store/authStore';
import { colors } from '@/theme/colors';

export const useTheme = () => {
  const { isDarkMode } = useAuthStore();

  return {
    isDark: isDarkMode,
    colors: isDarkMode ? colors.dark : colors.light,
  };
};

export { colors } from '@/theme/colors';
export { spacing, typography, borderRadius, shadows } from '@/theme/spacing';