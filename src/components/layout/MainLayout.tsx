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
                "flex-1 transition-all duration-300 ease-in-out relative bg-gradient-sage-light dark:bg-gradient-forest-dark bg-mesh-light dark:bg-mesh-dark",
            )}>


                {children}
                {/* Logo */}
                <div className="flex w-full justify-center bg-black/20 backdrop-blur-md pt-8 shadow-lg animate-fade-in pb-32 md:pb-4 rounded-t-3xl">
                    <div className="max-w-lg mx-4">
                        <img
                            src="/plat.png"
                            alt="Logo"
                            className="rounded-full shadow-lg object-cover"
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}
