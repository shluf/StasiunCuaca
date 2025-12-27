import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/i18n';
import clsx from 'clsx';
import type { Language } from '@/types/settings.types';

const LANGUAGES: Array<{ code: Language; name: string; nativeName: string; flag: string }> = [
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'jv', name: 'Javanese', nativeName: 'Basa Jawa', flag: '☕' },
];

export function LanguageSelector() {
  const { language, changeLanguage } = useLanguage();
  const { t } = useTranslation('settings');

  return (
    <div>
      <label className="block text-sm font-medium text-gray-900 dark:text-white mb-3">
        {t('language')}
      </label>

      <div className="grid grid-cols-1 gap-2">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={clsx(
              'flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all',
              'hover:bg-gray-50 dark:hover:bg-gray-800',
              language === lang.code
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700'
            )}
          >
            <span className="text-2xl">{lang.flag}</span>
            <div className="flex-1 text-left">
              <div className="font-medium text-gray-900 dark:text-white">
                {lang.nativeName}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {lang.name}
              </div>
            </div>
            {language === lang.code && (
              <svg
                className="w-5 h-5 text-blue-500"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M5 13l4 4L19 7"></path>
              </svg>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
