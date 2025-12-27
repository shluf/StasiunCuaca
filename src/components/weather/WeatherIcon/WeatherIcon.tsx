import { WEATHER_CONDITIONS } from '@/config/weatherConditions';
import type { WeatherCondition } from '@/config/weatherConditions';
import clsx from 'clsx';

export interface WeatherIconProps {
  condition: WeatherCondition;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  animated?: boolean;
  showLabel?: boolean;
  className?: string;
}

const SIZE_CLASSES = {
  sm: 'text-2xl',
  md: 'text-4xl',
  lg: 'text-6xl',
  xl: 'text-8xl',
  '2xl': 'text-9xl',
};

export function WeatherIcon({
  condition,
  size = 'lg',
  animated = true,
  showLabel = false,
  className,
}: WeatherIconProps) {
  const config = WEATHER_CONDITIONS[condition];

  return (
    <div className={clsx('flex flex-col items-center gap-2', className)}>
      <div
        className={clsx(
          'inline-flex items-center justify-center',
          SIZE_CLASSES[size],
          config.color,
          animated && 'animate-bounce-slow',
          'transition-all duration-300'
        )}
        role="img"
        aria-label={config.description.en}
      >
        {config.icon}
      </div>

      {showLabel && (
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {config.description.en}
        </span>
      )}
    </div>
  );
}

/**
 * Animated weather icon with gradient background
 */
export interface AnimatedWeatherIconProps extends WeatherIconProps {
  withBackground?: boolean;
}

export function AnimatedWeatherIcon({
  condition,
  size = 'xl',
  withBackground = true,
  className,
}: AnimatedWeatherIconProps) {
  const config = WEATHER_CONDITIONS[condition];

  if (!withBackground) {
    return <WeatherIcon condition={condition} size={size} animated className={className} />;
  }

  return (
    <div
      className={clsx(
        'relative rounded-full p-8',
        'bg-gradient-to-br',
        config.bgGradient,
        'shadow-lg',
        className
      )}
    >
      <div className="absolute inset-0 rounded-full bg-white/20 dark:bg-black/20" />
      <WeatherIcon condition={condition} size={size} animated className="relative z-10" />
    </div>
  );
}
