/**
 * Dashboard Page
 * Main weather monitoring dashboard with real-time sensor data
 * Features green theme, expandable forecast drawer, and professional SVG icons
 */

import { useSensorData } from '@/hooks/useSensorData';
import { TemperatureIcon, HumidityIcon, WindIcon, PressureIcon, RainfallIcon, AirQualityIcon } from '@/components/icons';
import { ForecastDrawer } from '@/components/drawer';
import { ThemeToggleButton } from '@/components/common';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

interface SensorCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit: string;
}

function SensorCard({ icon, label, value, unit }: SensorCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-glass-light dark:bg-gradient-glass-dark backdrop-blur-xs border border-sage-200/40 dark:border-forest-700/40 p-4 shadow-glass-light dark:shadow-glass-dark transition-all duration-300 hover:shadow-glow-sage dark:hover:shadow-glow-green">
      {/* Icon */}
      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-sage-100/80 dark:bg-forest-800/80 text-forest-700 dark:text-mint-400 mb-3">
        {icon}
      </div>

      {/* Label */}
      <div className="text-xs font-medium text-sage-700 dark:text-sage-300 mb-1">
        {label}
      </div>

      {/* Value */}
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold font-display text-forest-900 dark:text-forest-50">
          {value}
        </span>
        <span className="text-sm text-sage-600 dark:text-sage-400">
          {unit}
        </span>
      </div>
    </div>
  );
}

export function Dashboard() {
  const { t } = useTranslation('common');
  const { data, metadata, isLoading, error, isConnected } = useSensorData();

  // Main content wrapper
  return (
    <div className="min-h-screen bg-gradient-sage-light dark:bg-gradient-forest-dark bg-mesh-light dark:bg-mesh-dark pb-48">
      {/* Theme Toggle - Fixed Top Right */}
      <div className="fixed top-4 right-4 z-30 animate-fade-in">
        <ThemeToggleButton />
      </div>

      <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Loading State */}
        {isLoading && !data && (
          <div className="space-y-4">
            {/* Skeleton cards */}
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-white/60 dark:bg-white/5 rounded-2xl animate-pulse" />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !data && (
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center bg-white/80 dark:bg-forest-900/80 backdrop-blur-md rounded-3xl p-8 shadow-glass-light dark:shadow-glass-dark max-w-md">
              <div className="text-5xl mb-4">
                <svg className="w-16 h-16 mx-auto text-forest-700 dark:text-mint-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold font-display text-forest-900 dark:text-forest-50 mb-2">
                {t('dashboard.noData')}
              </h2>
              <p className="text-sage-700 dark:text-sage-300">{error}</p>
            </div>
          </div>
        )}

        {/* Data State */}
        {!isLoading && !error && data && (
          <>
            {/* Header */}
            <div className="text-center mb-8 animate-fade-in">
              <h1 className="text-4xl sm:text-5xl font-bold font-display text-forest-900 dark:text-forest-50 mb-2">
                {metadata?.location || t('app.name')}
              </h1>
              <div className="flex items-center justify-center gap-2 text-sm">
                <div
                  className={clsx(
                    'w-2 h-2 rounded-full',
                    isConnected ? 'bg-mint-500 animate-pulse-soft shadow-glow-green' : 'bg-red-500'
                  )}
                />
                <span className="text-sage-700 dark:text-sage-300 font-body">
                  {isConnected ? t('dashboard.connected') : t('dashboard.disconnected')}
                </span>
              </div>
            </div>

            {/* Main Temperature Card */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-glass-light dark:bg-gradient-glass-dark backdrop-blur-md border border-sage-200/40 dark:border-forest-700/40 p-8 shadow-glass-light dark:shadow-glass-dark mb-6 animate-scale-in" data-tour="weather-card">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-sage-400/10 dark:bg-mint-500/10 rounded-full blur-3xl -z-10" />

              <div className="text-center">
                <div className="text-7xl sm:text-8xl font-bold font-display text-forest-900 dark:text-forest-50 mb-2 min-h-[6rem]">
                  {data ? `${data.temperature.toFixed(1)}°` : '--°'}
                </div>
                <div className="text-xl text-sage-700 dark:text-sage-300 font-body">
                  {t('dashboard.realtimeTemp')}
                </div>
                <div className="text-sm text-sage-600 dark:text-sage-400 mt-2 font-body">
                  {t('dashboard.lastUpdated')} {data ? new Date(data.timestamp).toLocaleTimeString() : '--:--:--'}
                </div>
              </div>
            </div>

            {/* Sensor Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 animate-slide-up" data-tour="sensors-grid">
              <SensorCard
                icon={<HumidityIcon className="w-6 h-6" />}
                label={t('dashboard.humidity')}
                value={data ? data.humidity.toFixed(0) : '--'}
                unit="%"
              />
              <SensorCard
                icon={<PressureIcon className="w-6 h-6" />}
                label={t('dashboard.pressure')}
                value={data ? data.pressure.toFixed(0) : '--'}
                unit="hPa"
              />
              <SensorCard
                icon={<WindIcon className="w-6 h-6" />}
                label={t('dashboard.windSpeed')}
                value={data ? data.windSpeed.toFixed(1) : '--'}
                unit="m/s"
              />
              <SensorCard
                icon={<RainfallIcon className="w-6 h-6" />}
                label={t('dashboard.rainfall')}
                value={data ? data.rainfall.toFixed(1) : '--'}
                unit="mm"
              />
              <SensorCard
                icon={<AirQualityIcon className="w-6 h-6" />}
                label={t('dashboard.co2')}
                value={data ? data.co2.toFixed(0) : '--'}
                unit="ppm"
              />
              <SensorCard
                icon={<TemperatureIcon className="w-6 h-6" />}
                label={t('dashboard.altitude')}
                value={data ? data.altitude.toFixed(0) : '--'}
                unit="m"
              />
            </div>
          </>
        )}
      </div>

      {/* Forecast Drawer - Expandable from bottom - Always rendered now */}
      <ForecastDrawer />
    </div>
  );
}
