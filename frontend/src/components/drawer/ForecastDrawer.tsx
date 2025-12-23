/**
 * Forecast Drawer Component
 * Expandable drawer showing weather forecast from Open Meteo API
 * Can be pulled up from bottom to reveal detailed forecast
 */

import { useState, useRef, useEffect } from 'react';
import { useForecast } from '@/hooks/useForecast';
import { SunnyIcon, CloudyIcon, PartlyCloudyIcon, RainyIcon, StormyIcon, UVIcon, WindIcon, SunriseIcon } from '@/components/icons';
import { getWeatherCondition, getWeatherIcon } from '@/services/api/openMeteoAPI';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

interface ForecastDrawerProps {
  latitude?: number;
  longitude?: number;
}

export function ForecastDrawer({ latitude, longitude }: ForecastDrawerProps) {
  const { t } = useTranslation('common');

  const [isExpanded, setIsExpanded] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const drawerRef = useRef<HTMLDivElement>(null);

  const { data: forecast, isLoading } = useForecast({ latitude, longitude });

  // Handle touch/mouse drag
  const handleDragStart = (clientY: number) => {
    setDragStartY(clientY);
  };

  const handleDragMove = (clientY: number) => {
    const offset = dragStartY - clientY;
    setDragOffset(offset);

    // Auto-expand if dragged up enough
    if (offset > 50 && !isExpanded) {
      setIsExpanded(true);
      setDragOffset(0);
    } else if (offset < -50 && isExpanded) {
      setIsExpanded(false);
      setDragOffset(0);
    }
  };

  const handleDragEnd = () => {
    setDragOffset(0);
    setDragStartY(0);
  };

  // Global mouse move/up handlers for desktop drag
  useEffect(() => {
    const handleWindowMouseMove = (e: MouseEvent) => {
      if (dragStartY !== 0) {
        handleDragMove(e.clientY);
      }
    };

    const handleWindowMouseUp = () => {
      if (dragStartY !== 0) {
        handleDragEnd();
      }
    };

    if (dragStartY !== 0) {
      window.addEventListener('mousemove', handleWindowMouseMove);
      window.addEventListener('mouseup', handleWindowMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('mouseup', handleWindowMouseUp);
    };
  }, [dragStartY]);

  const getWeatherIconComponent = (code: number) => {
    const iconType = getWeatherIcon(code);
    const iconClass = "w-8 h-8";

    switch (iconType) {
      case 'sunny':
        return <SunnyIcon className={iconClass} />;
      case 'partly-cloudy':
        return <PartlyCloudyIcon className={iconClass} />;
      case 'cloudy':
        return <CloudyIcon className={iconClass} />;
      case 'rainy':
        return <RainyIcon className={iconClass} />;
      case 'stormy':
        return <StormyIcon className={iconClass} />;
      default:
        return <CloudyIcon className={iconClass} />;
    }
  };

  return (
    <div
      ref={drawerRef}
      className={clsx(
        'fixed left-0 right-0 z-40 transition-all duration-500 ease-out overflow-hidden',
        isExpanded ? 'bottom-16 top-0 rounded-none' : 'bottom-16 rounded-t-3xl',
        'bg-white/90 dark:bg-forest-950/95 backdrop-blur-md',
        'border-t border-sage-200/40 dark:border-forest-700/40',
        'shadow-glass-light dark:shadow-glass-dark'
      )}
      style={{
        transform: `translateY(${isExpanded ? 0 : `calc(100% - 120px + ${-dragOffset}px)`})`,
      }}
    >
      {/* Drag Handle */}
      <div
        className="sticky top-0 bg-white/95 dark:bg-forest-950/95 backdrop-blur-md border-b border-sage-200/40 dark:border-forest-700/40 z-10"
      >
        {/* Handle */}
        <div
          className="absolute top-0 left-0 right-0 h-6 flex justify-center py-2 cursor-grab active:cursor-grabbing touch-none z-[60]"
          onMouseDown={(e) => handleDragStart(e.clientY)}
          onTouchStart={(e) => handleDragStart(e.touches[0].clientY)}
          onTouchMove={(e) => handleDragMove(e.touches[0].clientY)}
          onTouchEnd={handleDragEnd}
          data-tour="forecast-drawer"
        >
          <div className="w-12 h-1.5 bg-sage-300 dark:bg-forest-600 rounded-full" />
        </div>

        {/* Global mouse move/up listener for desktop drag is handled by window/document usually, 
            but for simple drawer we can rely on React events on container if size permits,
            or better yet, listen on window when dragging starts. 
            For now restoring the original valid inline logic but applied to the handle div properly. 
        */}

        <div className="max-w-4xl mx-auto p-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold font-display text-forest-900 dark:text-forest-50">
                {t('forecast.title')}
              </h2>
              <p className="text-xs text-sage-600 dark:text-sage-400 font-body">
                {isExpanded ? t('forecast.swipeDown') : t('forecast.swipeUp')}
              </p>
            </div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-lg hover:bg-sage-100 dark:hover:bg-forest-800 transition-colors"
            >
              <svg
                className={clsx(
                  'w-5 h-5 text-forest-700 dark:text-mint-400 transition-transform duration-300',
                  isExpanded ? 'rotate-180' : ''
                )}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Drawer Content */}
      <div className="overflow-y-auto h-full pb-32">
        <div className="max-w-4xl mx-auto p-4 space-y-6">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-sage-100/50 dark:bg-forest-800/50 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : forecast ? (
            <>
              {/* Hourly Forecast */}
              <section>
                <h3 className="text-sm font-semibold font-display text-forest-900 dark:text-forest-50 mb-3">
                  {t('forecast.next24Hours')}
                </h3>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {forecast.hourly.slice(0, 24).map((hour, index) => (
                    <div
                      key={index}
                      className="flex-shrink-0 w-20 p-3 rounded-xl bg-gradient-glass-light dark:bg-gradient-glass-dark backdrop-blur-xs border border-sage-200/40 dark:border-forest-700/40"
                    >
                      <div className="text-xs text-sage-600 dark:text-sage-400 font-body text-center mb-2">
                        {new Date(hour.time).getHours()}:00
                      </div>
                      <div className="flex justify-center mb-2 text-forest-700 dark:text-mint-400">
                        {getWeatherIconComponent(hour.weatherCode)}
                      </div>
                      <div className="text-sm font-bold font-display text-forest-900 dark:text-forest-50 text-center">
                        {hour.temperature.toFixed(0)}°
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Daily Forecast */}
              <section>
                <h3 className="text-sm font-semibold font-display text-forest-900 dark:text-forest-50 mb-3">
                  {t('forecast.next7Days')}
                </h3>
                <div className="space-y-2">
                  {forecast.daily.map((day, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-xl bg-gradient-glass-light dark:bg-gradient-glass-dark backdrop-blur-xs border border-sage-200/40 dark:border-forest-700/40"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="text-forest-700 dark:text-mint-400">
                          {getWeatherIconComponent(day.weatherCode)}
                        </div>
                        <div>
                          <div className="text-sm font-medium font-display text-forest-900 dark:text-forest-50">
                            {new Date(day.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                          </div>
                          <div className="text-xs text-sage-600 dark:text-sage-400 font-body">
                            {getWeatherCondition(day.weatherCode)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold font-display text-forest-900 dark:text-forest-50">
                          {day.temperatureMax.toFixed(0)}°
                        </span>
                        <span className="text-sm text-sage-500 dark:text-sage-500">
                          {day.temperatureMin.toFixed(0)}°
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Weather Details */}
              <section>
                <h3 className="text-sm font-semibold font-display text-forest-900 dark:text-forest-50 mb-3">
                  {t('forecast.todayDetails')}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl bg-gradient-glass-light dark:bg-gradient-glass-dark backdrop-blur-xs border border-sage-200/40 dark:border-forest-700/40">
                    <div className="flex items-center gap-2 mb-2">
                      <UVIcon className="w-5 h-5 text-forest-700 dark:text-mint-400" />
                      <span className="text-xs text-sage-600 dark:text-sage-400 font-body">{t('forecast.uvIndex')}</span>
                    </div>
                    <div className="text-2xl font-bold font-display text-forest-900 dark:text-forest-50">
                      {forecast.daily[0]?.uvIndexMax.toFixed(0)}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-gradient-glass-light dark:bg-gradient-glass-dark backdrop-blur-xs border border-sage-200/40 dark:border-forest-700/40">
                    <div className="flex items-center gap-2 mb-2">
                      <WindIcon className="w-5 h-5 text-forest-700 dark:text-mint-400" />
                      <span className="text-xs text-sage-600 dark:text-sage-400 font-body">{t('forecast.wind')}</span>
                    </div>
                    <div className="text-2xl font-bold font-display text-forest-900 dark:text-forest-50">
                      {forecast.daily[0]?.windSpeedMax.toFixed(0)}
                      <span className="text-sm text-sage-600 dark:text-sage-400 ml-1">km/h</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-gradient-glass-light dark:bg-gradient-glass-dark backdrop-blur-xs border border-sage-200/40 dark:border-forest-700/40">
                    <div className="flex items-center gap-2 mb-2">
                      <SunriseIcon className="w-5 h-5 text-forest-700 dark:text-mint-400" />
                      <span className="text-xs text-sage-600 dark:text-sage-400 font-body">{t('forecast.sunrise')}</span>
                    </div>
                    <div className="text-lg font-bold font-display text-forest-900 dark:text-forest-50">
                      {forecast.daily[0]?.sunrise ? new Date(forecast.daily[0].sunrise).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-gradient-glass-light dark:bg-gradient-glass-dark backdrop-blur-xs border border-sage-200/40 dark:border-forest-700/40">
                    <div className="flex items-center gap-2 mb-2">
                      <SunriseIcon className="w-5 h-5 text-forest-700 dark:text-mint-400 rotate-180" />
                      <span className="text-xs text-sage-600 dark:text-sage-400 font-body">{t('forecast.sunset')}</span>
                    </div>
                    <div className="text-lg font-bold font-display text-forest-900 dark:text-forest-50">
                      {forecast.daily[0]?.sunset ? new Date(forecast.daily[0].sunset).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                    </div>
                  </div>
                </div>
              </section>

              {/* Disclaimer */}
              <div className="text-center pt-8 pb-4">
                <p className="text-[10px] text-sage-400 dark:text-sage-600 italic">
                  {t('forecast.provider')}
                </p>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-sage-600 dark:text-sage-400 font-body">
                {t('forecast.noData')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
