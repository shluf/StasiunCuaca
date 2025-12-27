import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { ChevronLeftIcon } from '@/components/icons';
import { ForecastContent } from './ForecastContent';

interface ForecastPanelProps {
    latitude?: number;
    longitude?: number;
}

export function ForecastPanel({ latitude, longitude }: ForecastPanelProps) {
    const { t } = useTranslation('common');
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div
            className={clsx(
                'hidden md:block h-screen fixed top-0 z-30',
                'bg-white/50 dark:bg-forest-900/50 backdrop-blur-md',
                'border-r border-sage-200/40 dark:border-forest-700/40',
                'transition-all duration-300 ease-in-out',
                isCollapsed ? 'w-12 md:left-20' : 'w-80 md:left-64'
            )}
        >
            <div className="flex-none p-4 flex justify-between items-center border-b border-sage-200/40 dark:border-forest-700/40">
                <h2 className={clsx("font-display font-bold text-forest-900 dark:text-forest-50 whitespace-nowrap", isCollapsed && "hidden")}>
                    {t('forecast.title')}
                </h2>
                <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-1 hover:bg-sage-100 dark:hover:bg-forest-800 rounded">
                    <ChevronLeftIcon className={clsx("w-5 h-5 text-sage-600 dark:text-sage-400 transition-transform", isCollapsed && "rotate-180")} />
                </button>
            </div>

            <div className={clsx("flex-1 overflow-y-auto p-4 custom-scrollbar", isCollapsed && "hidden")}>
                <ForecastContent latitude={latitude} longitude={longitude} />
            </div>
        </div>
    );
}

export function ForecastPanelSimple({ className, isCollapsed, onToggle }: { className?: string, isCollapsed: boolean, onToggle: () => void }) {
    const { t } = useTranslation('common');

    return (
        <aside
            className={clsx(
                'hidden md:flex flex-col h-screen overflow-hidden',
                'bg-white/80 dark:bg-forest-900/80 backdrop-blur-xl',
                'border-r border-sage-200/40 dark:border-forest-700/40',
                'transition-all duration-300 ease-in-out',
                isCollapsed ? 'w-0 opacity-0' : 'w-96 opacity-100', // w-0 to minimize fully, or w-12 for icon bar? User said "minimize dashboard utama akan memenuhi kolom", likely w-0 or very small
                className
            )}
        >
            <div className="flex-none p-4 border-b border-sage-200/40 dark:border-forest-700/40 flex justify-between items-center">
                <h2 className="font-display font-bold text-forest-900 dark:text-forest-50 whitespace-nowrap">
                    {t('forecast.title')}
                </h2>
                <button onClick={onToggle} className="p-1 hover:bg-sage-100 dark:hover:bg-forest-800 rounded">
                    <ChevronLeftIcon className="w-5 h-5 text-sage-600 dark:text-sage-400" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                <ForecastContent />
            </div>
        </aside>
    );
}

export function ForecastPanelDesktop({ isOpen, onToggle }: { isOpen: boolean, onToggle: () => void }) {
    const { t } = useTranslation('common');

    return (
        <div
            data-tour="forecast-drawer"
            className={clsx(
                "hidden md:flex flex-row h-screen sticky top-0 z-30 transition-all duration-300",
                isOpen ? "w-96" : "w-0"
            )}>
            {/* Panel Content */}
            <div className={clsx(
                "flex-1 flex flex-col h-full bg-white/80 dark:bg-forest-900/80 backdrop-blur-xl border-r border-sage-200/40 dark:border-forest-700/40 overflow-hidden",
                !isOpen && "hidden"
            )}>
                <div className="flex-none p-4 flex justify-between items-center border-b border-sage-200/40 dark:border-forest-700/40">
                    <h2 className="font-display font-bold text-forest-900 dark:text-forest-50">
                        {t('forecast.title')}
                    </h2>
                    <button onClick={onToggle} className="p-1.5 rounded-lg hover:bg-sage-100 dark:hover:bg-forest-800 text-sage-600 dark:text-sage-400 transition-colors">
                        <ChevronLeftIcon className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-sage-300 dark:scrollbar-thumb-forest-600 p-4">
                    <ForecastContent />
                </div>
            </div>
        </div>
    );
}
