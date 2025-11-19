import { Card } from '@/components/common';
import { useTranslation } from '@/i18n';
import clsx from 'clsx';

export type SensorType =
  | 'temperature'
  | 'humidity'
  | 'pressure'
  | 'altitude'
  | 'co2'
  | 'windSpeed'
  | 'windDirection'
  | 'rainfall'
  | 'voltage'
  | 'current';

export interface SensorDisplayProps {
  type: SensorType;
  value: number;
  unit?: string;
  label?: string;
  icon?: string;
  trend?: 'up' | 'down' | 'stable';
  variant?: 'default' | 'compact' | 'detailed';
  showTrend?: boolean;
  className?: string;
}

// Sensor configuration with icons and formatting
const SENSOR_CONFIG: Record<SensorType, {
  icon: string;
  defaultUnit: string;
  color: string;
  formatter?: (value: number) => string;
}> = {
  temperature: {
    icon: '🌡️',
    defaultUnit: '°C',
    color: 'text-red-500',
    formatter: (v) => v.toFixed(1),
  },
  humidity: {
    icon: '💧',
    defaultUnit: '%',
    color: 'text-blue-500',
    formatter: (v) => v.toFixed(0),
  },
  pressure: {
    icon: '🔽',
    defaultUnit: 'hPa',
    color: 'text-purple-500',
    formatter: (v) => v.toFixed(1),
  },
  altitude: {
    icon: '⛰️',
    defaultUnit: 'm',
    color: 'text-green-500',
    formatter: (v) => v.toFixed(0),
  },
  co2: {
    icon: '💨',
    defaultUnit: 'ppm',
    color: 'text-gray-600',
    formatter: (v) => v.toFixed(0),
  },
  windSpeed: {
    icon: '💨',
    defaultUnit: 'm/s',
    color: 'text-cyan-500',
    formatter: (v) => v.toFixed(1),
  },
  windDirection: {
    icon: '🧭',
    defaultUnit: '°',
    color: 'text-indigo-500',
    formatter: (v) => v.toFixed(0),
  },
  rainfall: {
    icon: '🌧️',
    defaultUnit: 'mm',
    color: 'text-blue-600',
    formatter: (v) => v.toFixed(1),
  },
  voltage: {
    icon: '⚡',
    defaultUnit: 'V',
    color: 'text-yellow-500',
    formatter: (v) => v.toFixed(2),
  },
  current: {
    icon: '🔌',
    defaultUnit: 'mA',
    color: 'text-orange-500',
    formatter: (v) => v.toFixed(2),
  },
};

const TREND_ICONS = {
  up: '↗',
  down: '↘',
  stable: '→',
};

export function SensorDisplay({
  type,
  value,
  unit,
  label,
  icon,
  trend,
  variant = 'default',
  showTrend = false,
  className,
}: SensorDisplayProps) {
  const { t } = useTranslation('dashboard');
  const config = SENSOR_CONFIG[type];
  const displayValue = config.formatter ? config.formatter(value) : value.toFixed(2);
  const displayUnit = unit || config.defaultUnit;
  const displayIcon = icon || config.icon;
  const displayLabel = label || t(`sensors.${type}`);

  if (variant === 'compact') {
    return (
      <div className={clsx('flex items-center gap-2', className)}>
        <span className="text-lg">{displayIcon}</span>
        <div className="flex flex-col">
          <span className="text-xs text-gray-500 dark:text-gray-400">{displayLabel}</span>
          <span className={clsx('text-sm font-semibold', config.color)}>
            {displayValue} {displayUnit}
          </span>
        </div>
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <Card variant="bordered" className={className}>
        <div className="flex flex-col items-center text-center p-4">
          <span className="text-3xl mb-2">{displayIcon}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
            {displayLabel}
          </span>
          <div className="flex items-baseline gap-1">
            <span className={clsx('text-3xl font-bold', config.color)}>
              {displayValue}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">{displayUnit}</span>
          </div>
          {showTrend && trend && (
            <div className={clsx(
              'mt-2 flex items-center gap-1 text-xs',
              trend === 'up' && 'text-red-500',
              trend === 'down' && 'text-blue-500',
              trend === 'stable' && 'text-gray-500'
            )}>
              <span>{TREND_ICONS[trend]}</span>
              <span>{t(`trends.${trend}`)}</span>
            </div>
          )}
        </div>
      </Card>
    );
  }

  // Default variant
  return (
    <Card variant="elevated" className={className}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-2xl">{displayIcon}</span>
          {showTrend && trend && (
            <span className={clsx(
              'text-xl',
              trend === 'up' && 'text-red-500',
              trend === 'down' && 'text-blue-500',
              trend === 'stable' && 'text-gray-500'
            )}>
              {TREND_ICONS[trend]}
            </span>
          )}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
          {displayLabel}
        </div>
        <div className="flex items-baseline gap-1">
          <span className={clsx('text-2xl font-bold', config.color)}>
            {displayValue}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">{displayUnit}</span>
        </div>
      </div>
    </Card>
  );
}

/**
 * Grid layout for multiple sensors
 */
export interface SensorGridProps {
  sensors: Array<{
    type: SensorType;
    value: number;
    trend?: 'up' | 'down' | 'stable';
  }>;
  variant?: 'default' | 'compact' | 'detailed';
  showTrend?: boolean;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export function SensorGrid({
  sensors,
  variant = 'default',
  showTrend = false,
  columns = 2,
  className,
}: SensorGridProps) {
  const gridClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
  }[columns];

  return (
    <div className={clsx('grid gap-4', gridClass, className)}>
      {sensors.map((sensor, index) => (
        <SensorDisplay
          key={`${sensor.type}-${index}`}
          type={sensor.type}
          value={sensor.value}
          trend={sensor.trend}
          variant={variant}
          showTrend={showTrend}
        />
      ))}
    </div>
  );
}

/**
 * Convert wind direction degrees to compass direction
 */
export function getWindDirection(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}
