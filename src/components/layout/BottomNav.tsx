import { useTranslation } from '@/i18n';
import { ListIcon, SettingsIcon, ChartIcon } from '@/components/icons';
import { HomeIcon } from '@/components/icons/HomeIcon';
import { NewsIcon } from '@/components/icons/NewsIcon';
import clsx from 'clsx';
import { useNavigate, useLocation } from 'react-router-dom';

export function BottomNav() {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    if (path === '/article') return location.pathname.startsWith('/article');
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 safe-area-bottom pointer-events-none">
      <div className="bg-white/90 dark:bg-forest-900/90 backdrop-blur-xl border-t border-sage-200/40 dark:border-forest-700/40 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.2)] pointer-events-auto pb-safe">
        <div className="max-w-md mx-auto px-4 h-16">
          <div className="grid grid-cols-5 h-full items-center relative">

            {/* News Button - Col 1 */}
            <button
              onClick={() => handleNavigation('/article')}
              className={clsx(
                'flex flex-col items-center justify-center gap-1 transition-all duration-300',
                isActive('/article')
                  ? 'text-forest-600 dark:text-mint-400'
                  : 'text-sage-400 dark:text-sage-500 hover:text-forest-600 dark:hover:text-mint-400'
              )}
              aria-label={t('nav.news')}
              data-tour="nav-news"
            >
              <NewsIcon className="w-6 h-6" />
              <span className="text-[10px] font-medium">{t('nav.news')}</span>
            </button>

            {/* History Button - Col 2 */}
            <button
              onClick={() => handleNavigation('/history')}
              className={clsx(
                'flex flex-col items-center justify-center gap-1 transition-all duration-300',
                isActive('/history')
                  ? 'text-forest-600 dark:text-mint-400'
                  : 'text-sage-400 dark:text-sage-500 hover:text-forest-600 dark:hover:text-mint-400'
              )}
              aria-label={t('nav.history')}
              data-tour="nav-history"
            >
              <ListIcon className="w-6 h-6" />
              <span className="text-[10px] font-medium">{t('nav.history')}</span>
            </button>

            {/* Home Button - Col 3 (Center) */}
            <div className="relative -top-6 flex justify-center">
              <button
                onClick={() => handleNavigation('/')}
                className={clsx(
                  'w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 hover:scale-105 active:scale-95',
                  isActive('/')
                    ? 'bg-gradient-to-br from-forest-600 to-forest-500 text-white shadow-forest-500/30 ring-4 ring-white dark:ring-forest-900'
                    : 'bg-white dark:bg-forest-800 text-sage-400 dark:text-sage-500 shadow-sage-500/10 ring-4 ring-white dark:ring-forest-900'
                )}
                aria-label="Dashboard"
                data-tour="nav-home"
              >
                <HomeIcon className="w-7 h-7" />
              </button>
            </div>

            {/* Insights Button - Col 4 (Replaces Alerts) */}
            <button
              onClick={() => handleNavigation('/insights')}
              className={clsx(
                'flex flex-col items-center justify-center gap-1 transition-all duration-300',
                isActive('/insights')
                  ? 'text-forest-600 dark:text-mint-400'
                  : 'text-sage-400 dark:text-sage-500 hover:text-forest-600 dark:hover:text-mint-400'
              )}
              aria-label={t('nav.insights')}
              data-tour="nav-insights"
            >
              <ChartIcon className="w-6 h-6" />
              <span className="text-[10px] font-medium">{t('nav.insights')}</span>
            </button>

            {/* Settings Button - Col 5 */}
            <button
              onClick={() => handleNavigation('/settings')}
              className={clsx(
                'flex flex-col items-center justify-center gap-1 transition-all duration-300',
                isActive('/settings')
                  ? 'text-forest-600 dark:text-mint-400'
                  : 'text-sage-400 dark:text-sage-500 hover:text-forest-600 dark:hover:text-mint-400'
              )}
              aria-label={t('nav.settings')}
              data-tour="nav-settings"
            >
              <SettingsIcon className="w-6 h-6" />
              <span className="text-[10px] font-medium">{t('nav.settings')}</span>
            </button>

          </div>
        </div>
      </div>
    </nav>
  );
}
