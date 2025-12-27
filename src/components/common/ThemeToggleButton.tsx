/**
 * ThemeToggleButton Component
 * Floating button for quick theme switching in dashboard
 */

import { useTheme } from '@/contexts/ThemeContext';
import { SunIcon, MoonIcon } from '@/components/icons';
import clsx from 'clsx';

export function ThemeToggleButton() {
  const { toggleTheme, isDark } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={clsx(
        'p-3 rounded-xl transition-all duration-300',
        'bg-gradient-glass-light dark:bg-gradient-glass-dark',
        'backdrop-blur-md border border-sage-200/40 dark:border-forest-700/40',
        'shadow-glass-light dark:shadow-glass-dark',
        'hover:shadow-glow-sage dark:hover:shadow-glow-green',
        'text-forest-700 dark:text-mint-400'
      )}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light Mode' : 'Dark Mode'}
    >
      {isDark ? (
        <SunIcon className="w-5 h-5" />
      ) : (
        <MoonIcon className="w-5 h-5" />
      )}
    </button>
  );
}
