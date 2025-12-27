import { useForecast } from '@/hooks/useForecast';
import { SunnyIcon, CloudyIcon, PartlyCloudyIcon, RainyIcon, StormyIcon, UVIcon, WindIcon, SunriseIcon } from '@/components/icons';
import { getWeatherCondition, getWeatherIcon } from '@/services/api/openMeteoAPI';
import { useTranslation } from 'react-i18next';

interface ForecastContentProps {
    latitude?: number;
    longitude?: number;
}

export function ForecastContent({ latitude, longitude }: ForecastContentProps) {
    const { t } = useTranslation('common');
    const { data: forecast, isLoading } = useForecast({ latitude, longitude });

    const getWeatherIconComponent = (code: number) => {
        const iconType = getWeatherIcon(code);
        const iconClass = "w-8 h-8";

        switch (iconType) {
            case 'sunny': return <SunnyIcon className={iconClass} />;
            case 'partly-cloudy': return <PartlyCloudyIcon className={iconClass} />;
            case 'cloudy': return <CloudyIcon className={iconClass} />;
            case 'rainy': return <RainyIcon className={iconClass} />;
            case 'stormy': return <StormyIcon className={iconClass} />;
            default: return <CloudyIcon className={iconClass} />;
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-24 bg-sage-100/50 dark:bg-forest-800/50 rounded-2xl animate-pulse" />
                ))}
            </div>
        );
    }

    if (!forecast) {
        return (
            <div className="text-center py-8">
                <p className="text-sage-600 dark:text-sage-400 font-body">
                    {t('forecast.noData')}
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-20 md:pb-6">
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
        </div>
    );
}
