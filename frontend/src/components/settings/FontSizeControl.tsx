import { useSettings } from '@/contexts/SettingsContext';
import { useTranslation } from '@/i18n';
import clsx from 'clsx';
import type { FontSize } from '@/types/settings.types';

const FONT_SIZES: Array<{ value: FontSize; label: string; preview: string }> = [
  { value: 'small', label: 'Kecil / Small', preview: 'A' },
  { value: 'medium', label: 'Sedang / Medium', preview: 'A' },
  { value: 'large', label: 'Besar / Large', preview: 'A' },
  { value: 'xlarge', label: 'Sangat Besar / X-Large', preview: 'A' },
];

export function FontSizeControl() {
  const { fontSize, setFontSize } = useSettings();
  const { t } = useTranslation('settings');

  return (
    <div>
      <label className="block text-sm font-medium text-gray-900 dark:text-white mb-3">
        {t('fontSize')}
      </label>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {FONT_SIZES.map((size) => (
          <button
            key={size.value}
            onClick={() => setFontSize(size.value)}
            className={clsx(
              'flex flex-col items-center gap-2 px-4 py-3 rounded-lg border-2 transition-all',
              'hover:bg-gray-50 dark:hover:bg-gray-800',
              fontSize === size.value
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700'
            )}
          >
            <span
              className={clsx(
                'font-bold text-gray-900 dark:text-white',
                size.value === 'small' && 'text-sm',
                size.value === 'medium' && 'text-base',
                size.value === 'large' && 'text-lg',
                size.value === 'xlarge' && 'text-xl'
              )}
            >
              {size.preview}
            </span>
            <span className="text-xs text-gray-600 dark:text-gray-400 text-center">
              {size.label}
            </span>
          </button>
        ))}
      </div>

      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        {t('fontSizeDescription')}
      </p>
    </div>
  );
}
