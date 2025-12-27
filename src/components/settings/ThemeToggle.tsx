import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from '@/i18n';
import clsx from 'clsx';

export function ThemeToggle() {
  const { toggleTheme, isDark } = useTheme();
  const { t } = useTranslation('settings');

  return (
    <div className="flex items-center justify-between">
      <div>
        <label className="block text-sm font-medium text-gray-900 dark:text-white">
          {t('theme')}
        </label>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {isDark ? t('themeDark') : t('themeLight')}
        </p>
      </div>

      <button
        onClick={toggleTheme}
        className={clsx(
          'relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900',
          isDark ? 'bg-blue-600' : 'bg-gray-300'
        )}
        aria-label={t('toggleTheme')}
      >
        <span
          className={clsx(
            'inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform',
            isDark ? 'translate-x-7' : 'translate-x-1'
          )}
        >
          <span className="flex h-full w-full items-center justify-center text-xs">
            {isDark ? '🌙' : '☀️'}
          </span>
        </span>
      </button>
    </div>
  );
}
