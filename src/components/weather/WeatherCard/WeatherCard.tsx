import { Card } from '@/components/common';
import { AnimatedWeatherIcon } from '../WeatherIcon';
import { useTranslation } from '@/i18n';
import { useLanguage } from '@/contexts/LanguageContext';
import { determineWeatherCondition, WEATHER_CONDITIONS } from '@/config/weatherConditions';
import type { SensorReading } from '@/types/sensor.types';
import type { WeatherCondition } from '@/config/weatherConditions';
import clsx from 'clsx';
import { format } from 'date-fns';
import { id as idLocale, enUS as enLocale } from 'date-fns/locale';

export interface WeatherCardProps {
  data: SensorReading;
  location?: string;
  showDetails?: boolean;
  variant?: 'default' | 'compact' | 'hero';
  className?: string;
}

export function WeatherCard({
  data,
  location = 'Stasiun Cuaca',
  showDetails = true,
  variant = 'hero',
  className,
}: WeatherCardProps) {
  const { t } = useTranslation('dashboard');
  const { language } = useLanguage();

  // Determine current weather condition
  const condition: WeatherCondition = determineWeatherCondition({
    temperature: data.temperature,
    rainfall: data.rainfall,
    windSpeed: data.windSpeed,
    humidity: data.humidity,
    hour: new Date(data.timestamp).getHours(),
  });

  const weatherConfig = WEATHER_CONDITIONS[condition];
  const dateLocale = language === 'id' ? idLocale : enLocale;

  if (variant === 'compact') {
    return (
      <Card variant="elevated" className={className}>
        <div className="p-4 flex items-center gap-4">
          <AnimatedWeatherIcon condition={condition} size="md" withBackground={false} />
          <div className="flex-1">
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {data.temperature.toFixed(1)}°C
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {weatherConfig.description[language]}
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Hero variant (default)
  return (
    <Card
      variant="elevated"
      noPadding
      className={clsx('overflow-hidden', className)}
    >
      {/* Gradient Background Header */}
      <div
        className={clsx(
          'relative p-8 text-white',
          'bg-gradient-to-br',
          weatherConfig.bgGradient
        )}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/10" />

        <div className="relative z-10">
          {/* Location and Time */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-1">{location}</h2>
              <p className="text-sm opacity-90">
                {format(new Date(data.timestamp), 'EEEE, d MMMM yyyy', { locale: dateLocale })}
              </p>
              <p className="text-xs opacity-75">
                {format(new Date(data.timestamp), 'HH:mm:ss')}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-90">{t('currentWeather')}</div>
            </div>
          </div>

          {/* Main Weather Display */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-7xl font-bold mb-2">
                {data.temperature.toFixed(1)}°C
              </div>
              <div className="text-xl font-medium mb-1">
                {weatherConfig.description[language]}
              </div>
              <div className="text-sm opacity-90">
                {t('feelsLike')}: {(data.temperature + (data.humidity > 70 ? 2 : -2)).toFixed(1)}°C
              </div>
            </div>

            <AnimatedWeatherIcon
              condition={condition}
              size="2xl"
              withBackground={false}
              className="drop-shadow-lg"
            />
          </div>

          {/* Quick Stats Row */}
          {showDetails && (
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/20">
              <div>
                <div className="text-xs opacity-75 mb-1">💧 {t('sensors.humidity')}</div>
                <div className="text-lg font-semibold">{data.humidity.toFixed(0)}%</div>
              </div>
              <div>
                <div className="text-xs opacity-75 mb-1">💨 {t('sensors.windSpeed')}</div>
                <div className="text-lg font-semibold">{data.windSpeed.toFixed(1)} m/s</div>
              </div>
              <div>
                <div className="text-xs opacity-75 mb-1">🔽 {t('sensors.pressure')}</div>
                <div className="text-lg font-semibold">{data.pressure.toFixed(0)} hPa</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Additional Details Section */}
      {showDetails && (
        <div className="p-6 bg-white dark:bg-gray-800">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <DetailItem
              icon="🌧️"
              label={t('sensors.rainfall')}
              value={`${data.rainfall.toFixed(1)} mm`}
            />
            <DetailItem
              icon="🧭"
              label={t('sensors.windDirection')}
              value={`${data.windDirection.toFixed(0)}°`}
            />
            <DetailItem
              icon="⛰️"
              label={t('sensors.altitude')}
              value={`${data.altitude.toFixed(0)} m`}
            />
            <DetailItem
              icon="💨"
              label={t('sensors.co2')}
              value={`${data.co2.toFixed(0)} ppm`}
            />
          </div>
        </div>
      )}
    </Card>
  );
}

/**
 * Detail item for additional weather information
 */
interface DetailItemProps {
  icon: string;
  label: string;
  value: string;
}

function DetailItem({ icon, label, value }: DetailItemProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-2xl">{icon}</span>
      <div className="flex-1 min-w-0">
        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{label}</div>
        <div className="text-sm font-semibold text-gray-900 dark:text-white">{value}</div>
      </div>
    </div>
  );
}

/**
 * Simple weather summary card
 */
export interface WeatherSummaryProps {
  temperature: number;
  condition: WeatherCondition;
  location?: string;
  className?: string;
}

export function WeatherSummary({
  temperature,
  condition,
  location,
  className,
}: WeatherSummaryProps) {
  const { language } = useLanguage();
  const weatherConfig = WEATHER_CONDITIONS[condition];

  return (
    <div
      className={clsx(
        'flex items-center gap-3 p-4 rounded-lg',
        'bg-gradient-to-r',
        weatherConfig.bgGradient,
        'text-white shadow-md',
        className
      )}
    >
      <span className="text-4xl">{weatherConfig.icon}</span>
      <div className="flex-1">
        {location && <div className="text-sm font-medium opacity-90">{location}</div>}
        <div className="text-3xl font-bold">{temperature.toFixed(1)}°C</div>
        <div className="text-sm opacity-90">{weatherConfig.description[language]}</div>
      </div>
    </div>
  );
}
