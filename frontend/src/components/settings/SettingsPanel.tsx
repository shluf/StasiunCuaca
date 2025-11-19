import { useTranslation } from '@/i18n';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSelector } from './LanguageSelector';
import { FontSizeControl } from './FontSizeControl';
import { NotificationToggle } from './NotificationToggle';
import clsx from 'clsx';
import { useEffect } from 'react';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const { t } = useTranslation('settings');

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div
            className={clsx(
              'relative w-full max-w-2xl transform overflow-hidden rounded-2xl',
              'bg-white dark:bg-gray-900 shadow-2xl transition-all',
              'border border-gray-200 dark:border-gray-700'
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {t('title')}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t('subtitle')}
                </p>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300 transition-colors"
                aria-label={t('close')}
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-6 space-y-8 max-h-[calc(100vh-200px)] overflow-y-auto">
              {/* Theme Section */}
              <section>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {t('appearance')}
                </h3>
                <div className="space-y-4">
                  <ThemeToggle />
                </div>
              </section>

              {/* Language Section */}
              <section>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {t('languageSection')}
                </h3>
                <LanguageSelector />
              </section>

              {/* Font Size Section */}
              <section>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {t('accessibility')}
                </h3>
                <FontSizeControl />
              </section>

              {/* Notifications Section */}
              <section>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {t('notificationsSection')}
                </h3>
                <div className="space-y-4">
                  <NotificationToggle />
                </div>
              </section>

              {/* App Info */}
              <section className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                  <p className="font-semibold text-gray-900 dark:text-white mb-1">
                    StasiunCuaca
                  </p>
                  <p>Aplikasi Monitoring Cuaca Real-time</p>
                  <p className="mt-2">© 2025 All rights reserved</p>
                </div>
              </section>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-800/50">
              <button
                onClick={onClose}
                className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors"
              >
                {t('done')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
