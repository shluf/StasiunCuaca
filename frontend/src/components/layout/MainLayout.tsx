import { useLocalStorage } from '@/hooks/useLocalStorage';
import { STORAGE_KEYS } from '@/config/constants';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { ForecastPanelDesktop } from '@/components/drawer/ForecastPanel';
import clsx from 'clsx';

interface MainLayoutProps {
    children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
    const [isForecastOpen, setIsForecastOpen] = useLocalStorage(STORAGE_KEYS.FORECAST_OPEN, false);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-forest-950 flex flex-col md:flex-row">
            {/* Mobile Navigation */}
            <BottomNav />

            {/* Desktop Sidebar */}
            <Sidebar
                onToggleForecast={() => setIsForecastOpen(!isForecastOpen)}
                isForecastOpen={isForecastOpen}
            />

            {/* Desktop Forecast Panel */}
            <ForecastPanelDesktop
                isOpen={isForecastOpen}
                onToggle={() => setIsForecastOpen(!isForecastOpen)}
            />

            {/* Main Content Area */}
            <main className={clsx(
                "flex-1 transition-all duration-300 ease-in-out relative",
            )}>


                {children}
            </main>
        </div>
    );
}
