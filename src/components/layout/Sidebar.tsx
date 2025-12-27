import { useLocalStorage } from '@/hooks/useLocalStorage';
import { STORAGE_KEYS } from '@/config/constants';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import {
    HomeIcon,
    NewsIcon,
    ListIcon,
    ChartIcon,
    SettingsIcon,
    ChevronLeftIcon,
    CloudyIcon
} from '@/components/icons';

interface SidebarProps {
    onToggleForecast?: () => void;
    isForecastOpen?: boolean;
}

export function Sidebar({ onToggleForecast, isForecastOpen }: SidebarProps) {
    const { t } = useTranslation('common');
    const navigate = useNavigate();
    const location = useLocation();
    const [isCollapsed, setIsCollapsed] = useLocalStorage(STORAGE_KEYS.SIDEBAR_COLLAPSED, true);

    const handleNavigation = (path: string) => {
        navigate(path);
    };

    const isActive = (path: string) => {
        if (path === '/') return location.pathname === '/';
        if (path === '/article') return location.pathname.startsWith('/article');
        return location.pathname.startsWith(path);
    };

    const navItems = [
        { path: '/', label: 'Dashboard', icon: HomeIcon },
        { path: '/history', label: t('nav.history'), icon: ListIcon },
        { path: '/insights', label: t('nav.insights'), icon: ChartIcon },
        { path: '/article', label: t('nav.news'), icon: NewsIcon },
        { path: '/settings', label: t('nav.settings'), icon: SettingsIcon },
    ];

    return (
        <aside
            className={clsx(
                'hidden md:flex flex-col h-screen sticky top-0 z-40',
                'bg-white/90 dark:bg-forest-900/95 backdrop-blur-xl',
                'border-r border-sage-200/40 dark:border-forest-700/40',
                'transition-all duration-300 ease-in-out',
                isCollapsed ? 'w-20' : 'w-64'
            )}
        >
            {/* Header / Logo Area */}
            <div className="flex items-center justify-between p-4 border-b border-sage-200/40 dark:border-forest-700/40">
                {!isCollapsed && (
                    <span className="font-display font-bold text-xl text-forest-900 dark:text-forest-50 animate-fade-in">
                        StasiunCuaca
                    </span>
                )}

                <div className={clsx("flex items-center gap-1", isCollapsed ? "mx-auto flex-col gap-3" : "")}>
                    {onToggleForecast && (
                        <button
                            onClick={onToggleForecast}
                            className={clsx(
                                "p-2 rounded-lg transition-colors",
                                isForecastOpen
                                    ? "bg-forest-500/10 text-forest-600 dark:text-forest-400"
                                    : "hover:bg-sage-100 dark:hover:bg-forest-800 text-sage-600 dark:text-sage-400"
                            )}
                            title={t('forecast.title')}
                        >
                            <CloudyIcon className="w-5 h-5" />
                        </button>
                    )}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="p-2 rounded-lg hover:bg-sage-100 dark:hover:bg-forest-800 text-sage-600 dark:text-sage-400 transition-colors"
                    >
                        <ChevronLeftIcon className={clsx('w-5 h-5 transition-transform', isCollapsed && 'rotate-180')} />
                    </button>
                </div>
            </div>

            {/* Nav Items */}
            <nav className="flex-1 py-6 px-3 space-y-2">
                {navItems.map((item) => {
                    const active = isActive(item.path);
                    return (
                        <button
                            key={item.path}
                            onClick={() => handleNavigation(item.path)}
                            className={clsx(
                                'w-full flex items-center p-3 rounded-xl transition-all duration-200 group relative',
                                active
                                    ? 'bg-gradient-to-r from-forest-500/10 to-forest-500/5 dark:from-mint-500/10 dark:to-mint-500/5 text-forest-700 dark:text-mint-400'
                                    : 'text-sage-600 dark:text-sage-400 hover:bg-sage-100 dark:hover:bg-forest-800'
                            )}
                            title={isCollapsed ? item.label : undefined}
                            data-tour={`nav-${item.path === '/' ? 'home' : item.path === '/article' ? 'news' : item.path.substring(1)}`}
                        >
                            <div className={`flex items-center justify-center ${!isCollapsed ? 'w-auto' : 'w-full'}`}>
                                <item.icon className={clsx('w-6 h-6 flex-shrink-0', active && 'animate-pulse-soft')} />
                            </div>

                            {!isCollapsed && (
                                <span className="ml-3 font-medium text-sm whitespace-nowrap overflow-hidden animate-fade-in">
                                    {item.label}
                                </span>
                            )}

                            {/* Active Indicator Bar */}
                            {active && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-forest-500 dark:bg-mint-500 rounded-r-full" />
                            )}
                        </button>
                    );
                })}
            </nav>
        </aside>
    );
}
