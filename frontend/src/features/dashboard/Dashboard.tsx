import { useSensorData } from '@/hooks/useSensorData';
import { useTranslation } from '@/i18n';
import { WeatherCard, SensorGrid, AlertBanner } from '@/components/weather';
import type { WeatherAlert } from '@/components/weather';
import { SkeletonWeatherCard, SkeletonSensorGrid } from '@/components/common';
import { SettingsPanel } from '@/components/settings';
import { notificationService } from '@/services/notification/notificationService';
import { ALERT_THRESHOLDS } from '@/config/sensorConfig';
import { useEffect, useState } from 'react';
import clsx from 'clsx';

export function Dashboard() {
  const { t } = useTranslation('dashboard');
  const { data, metadata, isLoading, error, isConnected } = useSensorData();
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Generate weather alerts based on sensor data
  useEffect(() => {
    if (!data) return;

    const newAlerts: WeatherAlert[] = [];

    // Temperature alerts
    if (data.temperature > ALERT_THRESHOLDS.temperature.hot) {
      newAlerts.push({
        id: 'temp-hot',
        severity: 'danger',
        title: t('alerts.highTemperature'),
        message: `${t('sensors.temperature')}: ${data.temperature.toFixed(1)}°C`,
        timestamp: new Date(data.timestamp),
        dismissible: true,
      });
    } else if (data.temperature < ALERT_THRESHOLDS.temperature.cold) {
      newAlerts.push({
        id: 'temp-cold',
        severity: 'warning',
        title: t('alerts.lowTemperature'),
        message: `${t('sensors.temperature')}: ${data.temperature.toFixed(1)}°C`,
        timestamp: new Date(data.timestamp),
        dismissible: true,
      });
    }

    // Humidity alerts
    if (data.humidity > ALERT_THRESHOLDS.humidity.high) {
      newAlerts.push({
        id: 'humidity-high',
        severity: 'warning',
        title: t('alerts.highHumidity'),
        message: `${t('sensors.humidity')}: ${data.humidity.toFixed(0)}%`,
        timestamp: new Date(data.timestamp),
        dismissible: true,
      });
    }

    // CO2 alerts
    if (data.co2 > ALERT_THRESHOLDS.co2.danger) {
      newAlerts.push({
        id: 'co2-danger',
        severity: 'danger',
        title: t('alerts.dangerCO2'),
        message: `${t('sensors.co2')}: ${data.co2.toFixed(0)} ppm`,
        timestamp: new Date(data.timestamp),
        dismissible: true,
      });
    } else if (data.co2 > ALERT_THRESHOLDS.co2.warning) {
      newAlerts.push({
        id: 'co2-warning',
        severity: 'warning',
        title: t('alerts.highCO2'),
        message: `${t('sensors.co2')}: ${data.co2.toFixed(0)} ppm`,
        timestamp: new Date(data.timestamp),
        dismissible: true,
      });
    }

    // Wind alerts
    if (data.windSpeed > ALERT_THRESHOLDS.windSpeed.danger) {
      newAlerts.push({
        id: 'wind-danger',
        severity: 'danger',
        title: t('alerts.dangerWind'),
        message: `${t('sensors.windSpeed')}: ${data.windSpeed.toFixed(1)} m/s`,
        timestamp: new Date(data.timestamp),
        dismissible: true,
      });
    } else if (data.windSpeed > ALERT_THRESHOLDS.windSpeed.warning) {
      newAlerts.push({
        id: 'wind-warning',
        severity: 'warning',
        title: t('alerts.strongWind'),
        message: `${t('sensors.windSpeed')}: ${data.windSpeed.toFixed(1)} m/s`,
        timestamp: new Date(data.timestamp),
        dismissible: true,
      });
    }

    // Rainfall alerts
    if (data.rainfall > ALERT_THRESHOLDS.rainfall.heavy) {
      newAlerts.push({
        id: 'rain-heavy',
        severity: 'danger',
        title: t('alerts.veryHeavyRain'),
        message: `${t('sensors.rainfall')}: ${data.rainfall.toFixed(1)} mm`,
        timestamp: new Date(data.timestamp),
        dismissible: true,
      });
    } else if (data.rainfall > ALERT_THRESHOLDS.rainfall.moderate) {
      newAlerts.push({
        id: 'rain-moderate',
        severity: 'warning',
        title: t('alerts.heavyRain'),
        message: `${t('sensors.rainfall')}: ${data.rainfall.toFixed(1)} mm`,
        timestamp: new Date(data.timestamp),
        dismissible: true,
      });
    }

    setAlerts(newAlerts);

    // Trigger browser notifications for critical alerts
    if (newAlerts.length > 0) {
      notificationService.checkWeatherAlerts(data);
    }
  }, [data, t]);

  // Connection status indicator
  const ConnectionStatus = () => (
    <div className="flex items-center gap-2 text-sm">
      <div
        className={clsx(
          'w-2 h-2 rounded-full',
          isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
        )}
      />
      <span className="text-gray-600 dark:text-gray-400">
        {isConnected ? 'Terhubung' : 'Terputus'}
      </span>
    </div>
  );

  // Error state
  if (error && !data) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {t('noData')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading && !data) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header Skeleton */}
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 animate-pulse" />

          {/* Weather Card Skeleton */}
          <SkeletonWeatherCard />

          {/* Sensor Grid Skeleton */}
          <SkeletonSensorGrid count={6} />
        </div>
      </div>
    );
  }

  // Main content
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t('title')}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {t('currentWeather')} • {metadata?.location || 'Stasiun Cuaca'}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <ConnectionStatus />

            {/* Settings Button */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-all shadow-sm hover:shadow"
              aria-label="Pengaturan"
              title="Pengaturan"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Weather Alerts */}
        {alerts.length > 0 && (
          <AlertBanner
            alerts={alerts}
            onDismiss={(id) => setAlerts((prev) => prev.filter((a) => a.id !== id))}
          />
        )}

        {/* Main Weather Card */}
        {data && (
          <WeatherCard
            data={data}
            location={metadata?.location}
            showDetails
            variant="hero"
          />
        )}

        {/* Sensor Grid */}
        {data && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {t('sensorData')}
            </h2>
            <SensorGrid
              sensors={[
                { type: 'temperature', value: data.temperature },
                { type: 'humidity', value: data.humidity },
                { type: 'pressure', value: data.pressure },
                { type: 'altitude', value: data.altitude },
                { type: 'co2', value: data.co2 },
                { type: 'windSpeed', value: data.windSpeed },
                { type: 'windDirection', value: data.windDirection },
                { type: 'rainfall', value: data.rainfall },
                { type: 'voltage', value: data.voltage },
                { type: 'current', value: data.current },
              ]}
              variant="default"
              showTrend={false}
              columns={3}
            />
          </div>
        )}

        {/* Last Update */}
        {data && (
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            {t('lastUpdate')}: {new Date(data.timestamp).toLocaleString('id-ID')}
          </div>
        )}
      </div>

      {/* Settings Panel */}
      <SettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
}
