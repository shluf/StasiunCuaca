/**
 * Weather History View
 * Displays historical weather data with charts and search functionality
 */

import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from '@/i18n';
import { SearchIcon, TemperatureIcon, HumidityIcon, WindIcon, RainfallIcon, CalendarIcon, PressureIcon, AirQualityIcon } from '@/components/icons';
import clsx from 'clsx';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { useSensorHistory, useSensorInsights } from '@/hooks/useSensorData';
import { format, subDays, startOfDay, startOfWeek, startOfMonth } from 'date-fns';
import { id, enUS } from 'date-fns/locale';
import { useLanguage } from '@/contexts/LanguageContext';

// Sensor Types for Filter
type SensorType = 'temperature' | 'humidity' | 'pressure' | 'windSpeed' | 'rainfall' | 'co2' | 'altitude';
type AggregationInterval = 'raw' | 'hourly' | 'daily' | 'weekly' | 'monthly';

interface SensorConfig {
  key: SensorType;
  label: string;
  unit: string;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
}

export function WeatherHistory() {
  const { t } = useTranslation('history');
  const { t: commonT } = useTranslation('common');
  const { language } = useLanguage();
  const locale = language === 'id' ? id : enUS;

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSensor, setSelectedSensor] = useState<SensorType>('temperature');
  const [aggregationInterval, setAggregationInterval] = useState<AggregationInterval>('raw');

  // Date Filter State
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  // Default to last 7 days
  const [startDate, setStartDate] = useState(format(subDays(new Date(), 7), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  // Temp state for popup inputs
  const [tempStartDate, setTempStartDate] = useState('');
  const [tempEndDate, setTempEndDate] = useState('');

  // Sensor Dropdown State
  const [isSensorDropdownOpen, setIsSensorDropdownOpen] = useState(false);

  // Fetch History Data
  const { history: data, isLoading } = useSensorHistory(
    startDate ? new Date(startDate).toISOString() : undefined,
    endDate ? new Date(endDate).toISOString() : undefined,
    aggregationInterval
  );

  // Fetch Insights
  const { insights } = useSensorInsights();

  // Sensor Configurations
  const sensorConfigs: SensorConfig[] = [
    { key: 'temperature', label: commonT('dashboard.temperature'), unit: '°C', color: '#10B981', icon: TemperatureIcon }, // Emerald-500
    { key: 'humidity', label: commonT('dashboard.humidity'), unit: '%', color: '#3B82F6', icon: HumidityIcon }, // Blue-500
    { key: 'pressure', label: commonT('dashboard.pressure'), unit: 'hPa', color: '#8B5CF6', icon: PressureIcon }, // Violet-500
    { key: 'windSpeed', label: commonT('dashboard.windSpeed'), unit: 'm/s', color: '#F59E0B', icon: WindIcon }, // Amber-500
    { key: 'rainfall', label: commonT('dashboard.rainfall'), unit: 'mm', color: '#0EA5E9', icon: RainfallIcon }, // Sky-500
    { key: 'co2', label: commonT('dashboard.co2'), unit: 'ppm', color: '#EF4444', icon: AirQualityIcon }, // Red-500
    // { key: 'altitude', label: commonT('dashboard.altitude'), unit: 'm', color: '#64748B', icon: TemperatureIcon }, // Slate-500
  ];

  // Open popup and sync temp state
  const openFilter = () => {
    setTempStartDate(startDate);
    setTempEndDate(endDate);
    setShowFilterPopup(true);
  };

  // Apply filter
  const applyFilter = () => {
    setStartDate(tempStartDate);
    setEndDate(tempEndDate);
    setShowFilterPopup(false);
  };

  // Clear filter (Reset to default 7 days)
  const clearFilter = () => {
    setStartDate(format(subDays(new Date(), 7), 'yyyy-MM-dd'));
    setEndDate(format(new Date(), 'yyyy-MM-dd'));
    setShowFilterPopup(false);
  };

  // Date Presets Handler
  const handlePreset = (preset: 'today' | 'week' | 'month') => {
    const now = new Date();
    let start = now;

    if (preset === 'today') start = startOfDay(now);
    if (preset === 'week') start = startOfWeek(now, { locale, weekStartsOn: 1 }); // Force Monday start for clearer UX? Or use locale default. usage of locale in startOfWeek handles it.
    if (preset === 'month') start = startOfMonth(now);

    setTempStartDate(format(start, 'yyyy-MM-dd'));
    setTempEndDate(format(now, 'yyyy-MM-dd'));
  };

  // Filter Data Logic (Client-side search)
  const filteredData = useMemo(() => {
    if (!data) return [];

    let result = [...data];

    // Note: Date range is already handled by the API request via useSensorHistory hook
    // We double check here or just rely on API. Assuming API returns correct range.

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (record) =>
          new Date(record.timestamp).toLocaleString().toLowerCase().includes(query)
        // Add more search fields if needed
      );
    }

    // Sort by timestamp descending for list view, ascending for chart
    return result.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [data, searchQuery]);

  // Data is now aggregated by backend
  const processedData = useMemo(() => {
    if (!data) return [];
    return filteredData; // Or just data if we want to search over aggregated results? 
    // Revisit: filteredData filters 'data' based on search query. 
    // If 'data' is already aggregated from backend, we just return filteredData.
    return filteredData;
  }, [filteredData]);

  // Chart Data (Ascending for chart)
  // Chart Data (Ascending for chart)
  const chartData = useMemo(() => {
    return [...processedData].reverse().map(item => ({
      ...item,
      formattedTime: format(new Date(item.timestamp), aggregationInterval === 'hourly' || aggregationInterval === 'raw' ? 'dd MMM HH:mm' : 'dd MMM yyyy', { locale }),
    }));
  }, [processedData, locale, aggregationInterval]);


  const currentConfig = sensorConfigs.find(c => c.key === selectedSensor) || sensorConfigs[0];

  // Custom Chart Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/90 dark:bg-forest-900/90 backdrop-blur-md p-3 rounded-lg border border-sage-200 dark:border-forest-700 shadow-xl">
          <p className="text-xs text-sage-500 dark:text-sage-400 mb-1">{label}</p>
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: currentConfig.color }}
            />
            <p className="font-bold text-forest-900 dark:text-forest-50">
              {payload[0].value.toFixed(1)} {currentConfig.unit}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  // Lazy Load State
  const [displayLimit, setDisplayLimit] = useState(20);

  // Reset limit when filter changes
  useEffect(() => {
    setDisplayLimit(20);
  }, [processedData.length]);

  // Data to render
  const visibleData = useMemo(() => {
    return processedData.slice(0, displayLimit);
  }, [processedData, displayLimit]);

  // Load more handler
  const loadMore = () => {
    setDisplayLimit(prev => Math.min(prev + 20, processedData.length));
  };

  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleData.length < filteredData.length) {
          loadMore();
        }
      },
      { threshold: 1.0 }
    );

    const target = document.getElementById('load-more-trigger');
    if (target) observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
    };
    return () => {
      if (target) observer.unobserve(target);
    };
  }, [visibleData.length, processedData.length]);

  const formatDateLabel = (dateString: string) => {
    const date = new Date(dateString);
    if (aggregationInterval === 'raw') return format(date, 'dd MMM yyyy, HH:mm', { locale });
    if (aggregationInterval === 'hourly') return format(date, 'dd MMM, HH:00', { locale });
    return format(date, 'dd MMM yyyy', { locale });
  };

  // Lazy Load State


  return (
    <div className="min-h-screen  pb-32">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div className="text-center mb-6 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-forest-900 dark:text-forest-50 mb-2">
            {t('title')}
          </h1>
          <p className="text-sm text-sage-600 dark:text-sage-400 font-body">
            {t('subtitle')}
          </p>
        </div>

        {/* Filters & Controls */}
        <div className="flex flex-col md:flex-row gap-4 animate-scale-in relative z-20">
          {/* Search Bar */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
              <SearchIcon className="w-5 h-5 text-sage-600 dark:text-sage-300" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className={clsx(
                'w-full pl-12 pr-4 py-3 rounded-xl',
                'bg-white/80 dark:bg-forest-900/80 backdrop-blur-md',
                'border border-sage-200/40 dark:border-forest-700/40',
                'shadow-glass-light dark:shadow-glass-dark',
                'text-forest-900 dark:text-forest-50 font-body',
                'placeholder:text-sage-500 dark:placeholder:text-sage-400',
                'focus:outline-none focus:ring-2 focus:ring-forest-500 dark:focus:ring-mint-500',
                'transition-all duration-300'
              )}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-sage-500 hover:text-forest-700 dark:hover:text-mint-400 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Date Filter Button */}
          <div className="relative">
            <button
              onClick={openFilter}
              className={clsx(
                'w-full md:w-auto px-6 py-3 rounded-xl flex items-center gap-2 justify-center',
                'bg-white/80 dark:bg-forest-900/80 backdrop-blur-md',
                'border border-sage-200/40 dark:border-forest-700/40',
                'shadow-glass-light dark:shadow-glass-dark',
                'text-forest-900 dark:text-forest-50 font-medium',
                'hover:bg-white dark:hover:bg-forest-800 transition-all cursor-pointer',
                (startDate || endDate) && 'ring-2 ring-forest-500 dark:ring-mint-500'
              )}
            >
              <CalendarIcon className="w-5 h-5 text-sage-500 dark:text-sage-400" />
              <span>
                {startDate || endDate
                  ? `${startDate ? format(new Date(startDate), 'dd MMM') : '...'} - ${endDate ? format(new Date(endDate), 'dd MMM') : '...'}`
                  : commonT('common.filterDate')}
              </span>
            </button>

            {/* Filter Popup */}
            {showFilterPopup && (
              <div className="absolute top-full right-0 mt-2 z-50 w-full md:w-80 animate-fade-in">
                <div className="bg-white dark:bg-forest-900 rounded-2xl shadow-xl border border-sage-200 dark:border-forest-700 p-4">
                  <h3 className="font-bold text-forest-900 dark:text-forest-50 mb-4">{commonT('common.filterDate')}</h3>

                  <div className="space-y-4">
                    {/* Presets */}
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => handlePreset('today')}
                        className="px-2 py-1.5 rounded-lg bg-sage-100 dark:bg-forest-800 text-xs font-medium text-sage-600 dark:text-sage-400 hover:bg-forest-100 dark:hover:bg-forest-700 hover:text-forest-700 dark:hover:text-forest-200 transition-colors"
                      >
                        {commonT('common.today')}
                      </button>
                      <button
                        onClick={() => handlePreset('week')}
                        className="px-2 py-1.5 rounded-lg bg-sage-100 dark:bg-forest-800 text-xs font-medium text-sage-600 dark:text-sage-400 hover:bg-forest-100 dark:hover:bg-forest-700 hover:text-forest-700 dark:hover:text-forest-200 transition-colors"
                      >
                        {commonT('common.thisWeek')}
                      </button>
                      <button
                        onClick={() => handlePreset('month')}
                        className="px-2 py-1.5 rounded-lg bg-sage-100 dark:bg-forest-800 text-xs font-medium text-sage-600 dark:text-sage-400 hover:bg-forest-100 dark:hover:bg-forest-700 hover:text-forest-700 dark:hover:text-forest-200 transition-colors"
                      >
                        {commonT('common.thisMonth')}
                      </button>
                    </div>

                    <div>
                      <label className="text-xs text-sage-500 dark:text-sage-400 mb-1 block">{commonT('common.startDate')}</label>
                      <input
                        type="date"
                        value={tempStartDate}
                        onChange={(e) => setTempStartDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-sage-50 dark:bg-forest-800 border border-sage-200 dark:border-forest-700 text-forest-900 dark:text-forest-50 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-sage-500 dark:text-sage-400 mb-1 block">{commonT('common.endDate')}</label>
                      <input
                        type="date"
                        value={tempEndDate}
                        onChange={(e) => setTempEndDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-sage-50 dark:bg-forest-800 border border-sage-200 dark:border-forest-700 text-forest-900 dark:text-forest-50 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
                      />
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={clearFilter}
                        className="flex-1 px-3 py-2 rounded-lg border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        {commonT('common.clearFilter')}
                      </button>
                      <button
                        onClick={applyFilter}
                        className="flex-1 px-3 py-2 rounded-lg bg-forest-600 text-white text-sm font-bold hover:bg-forest-700 transition-colors"
                      >
                        {commonT('common.apply')}
                      </button>
                    </div>
                  </div>
                </div>
                {/* Backdrop to close on click outside */}
                <div className="fixed inset-0 z-[-1]" onClick={() => setShowFilterPopup(false)}></div>
              </div>
            )}
          </div>
        </div>

        {/* Insights Section */}
        {insights && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-slide-up">
            {/* Max Temp */}
            <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 p-5 rounded-2xl border border-red-100 dark:border-red-900/30">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center text-red-600 dark:text-red-400">
                  <TemperatureIcon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-medium text-red-900 dark:text-red-100">{commonT('common.insights.maxTemp')}</h3>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-red-700 dark:text-red-300">{insights.maxTemp.toFixed(1)}°C</span>
              </div>
            </div>

            {/* Min Temp */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-5 rounded-2xl border border-blue-100 dark:border-blue-900/30">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <TemperatureIcon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100">{commonT('common.insights.minTemp')}</h3>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-blue-700 dark:text-blue-300">{insights.minTemp.toFixed(1)}°C</span>
              </div>
            </div>

            {/* Avg Temp */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 p-5 rounded-2xl border border-emerald-100 dark:border-emerald-900/30">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <TemperatureIcon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-medium text-emerald-900 dark:text-emerald-100">{commonT('common.insights.avgTemp')}</h3>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{insights.avgTemp.toFixed(1)}°C</span>
                {insights.prevMonthDiff !== 0 && (
                  <span className={clsx("text-xs font-medium", insights.prevMonthDiff > 0 ? "text-red-500" : "text-blue-500")}>
                    {insights.prevMonthDiff > 0 ? "+" : ""}{insights.prevMonthDiff.toFixed(1)} {commonT('common.insights.vsPrevMonth')}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Chart Section */}
        <div className="bg-white/80 dark:bg-forest-900/40 backdrop-blur-xl rounded-3xl p-6 border border-sage-200/40 dark:border-forest-700/40 shadow-glass-light dark:shadow-glass-dark animate-slide-up">

          {/* Controls Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            {/* Sensor Type Tabs */}
            {/* Sensor Type Dropdown */}
            <div className="relative z-30 w-full sm:w-auto">
              <button
                onClick={() => setIsSensorDropdownOpen(!isSensorDropdownOpen)}
                className={clsx(
                  'flex items-center justify-between w-full sm:w-auto gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300',
                  'bg-white dark:bg-forest-800 border border-sage-200 dark:border-forest-700',
                  'text-forest-900 dark:text-forest-50 hover:bg-sage-50 dark:hover:bg-forest-700',
                  'shadow-sm hover:shadow-md'
                )}
              >
                <div className="flex items-center gap-2">
                  {(() => {
                    const Icon = currentConfig.icon;
                    return <Icon className={clsx("w-4 h-4", "text-forest-600 dark:text-mint-400")} />;
                  })()}
                  <span>{currentConfig.label}</span>
                </div>
                <svg
                  className={clsx(
                    "w-4 h-4 ml-1 transition-transform duration-200",
                    isSensorDropdownOpen ? "rotate-180" : ""
                  )}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isSensorDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setIsSensorDropdownOpen(false)}
                  />
                  <div className="absolute top-full left-0 mt-2 w-full sm:w-56 bg-white dark:bg-forest-900 rounded-xl shadow-xl border border-sage-200 dark:border-forest-700 p-2 z-30 animate-fade-in flex flex-col gap-1">
                    {sensorConfigs.map(config => {
                      const Icon = config.icon;
                      const isSelected = selectedSensor === config.key;
                      return (
                        <button
                          key={config.key}
                          onClick={() => {
                            setSelectedSensor(config.key);
                            setIsSensorDropdownOpen(false);
                          }}
                          className={clsx(
                            'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all w-full text-left',
                            isSelected
                              ? 'bg-forest-50 dark:bg-forest-800/50 text-forest-700 dark:text-mint-400'
                              : 'text-sage-600 dark:text-sage-400 hover:bg-sage-50 dark:hover:bg-forest-800'
                          )}
                        >
                          <div className={clsx(
                            "w-8 h-8 rounded-full flex items-center justify-center",
                            isSelected ? "bg-forest-100 dark:bg-forest-800 text-forest-600 dark:text-mint-400" : "bg-sage-100 dark:bg-forest-800/50 text-sage-500 dark:text-sage-500"
                          )}>
                            <Icon className="w-4 h-4" />
                          </div>
                          {config.label}
                        </button>
                      )
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Aggregation Filter */}
            <div className="flex flex-wrap gap-1 bg-sage-100 dark:bg-forest-800 rounded-lg p-1 w-full sm:w-auto">
              {(['raw', 'hourly', 'daily', 'weekly', 'monthly'] as AggregationInterval[]).map((interval) => (
                <button
                  key={interval}
                  onClick={() => setAggregationInterval(interval)}
                  className={clsx(
                    'px-3 py-1.5 rounded-md text-xs font-medium transition-all flex-1 sm:flex-none text-center',
                    aggregationInterval === interval
                      ? 'bg-white dark:bg-forest-600 text-forest-900 dark:text-white shadow-sm'
                      : 'text-sage-600 dark:text-sage-400 hover:text-forest-900 dark:hover:text-forest-200'
                  )}
                >
                  {commonT(interval === 'raw' ? 'common.raw' : `common.${interval}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Chart */}
          <div className="h-[350px] w-full min-w-0">
            {isLoading ? (
              <div className="h-full w-full flex items-center justify-center">
                <div className="flex flex-col items-center gap-2 text-sage-400">
                  <div className="w-8 h-8 border-4 border-current border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm">{commonT('common.loading')}...</p>
                </div>
              </div>
            ) : chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id={`gradient-${selectedSensor}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={currentConfig.color} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={currentConfig.color} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.1)" />
                  <XAxis
                    dataKey="formattedTime"
                    tick={{ fill: '#94a3b8', fontSize: 10 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fill: '#94a3b8', fontSize: 10 }}
                    tickFormatter={(value) => `${value}`}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: currentConfig.color, strokeDasharray: '5 5' }} />
                  <Area
                    type="monotone"
                    dataKey={selectedSensor}
                    stroke={currentConfig.color}
                    strokeWidth={3}
                    fill={`url(#gradient-${selectedSensor})`}
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full flex flex-col items-center justify-center text-sage-400 opacity-60">
                <div className="text-5xl mb-2">📉</div>
                <p>{t('noResults')}</p>
              </div>
            )}
          </div>
        </div>

        {/* History List */}
        <div className="space-y-4 animate-slide-up-delayed">
          <h3 className="font-display font-bold text-xl text-forest-900 dark:text-forest-50 px-2">
            {t('recentReadings')}
          </h3>









          {filteredData.length > 0 ? (
            <div className="grid gap-3">
              {visibleData.map((record) => (
                <div
                  key={record.id}
                  className={clsx(
                    'rounded-xl p-4',
                    'bg-white/60 dark:bg-forest-900/60 backdrop-blur-sm',
                    'border border-sage-200/40 dark:border-forest-700/40',
                    'hover:bg-white/80 dark:hover:bg-forest-900/80',
                    'transition-all duration-300'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-sage-100 dark:bg-forest-800 flex items-center justify-center text-forest-600 dark:text-mint-400">
                        {/* Dynamic Icon based on selected sensor or generic weather icon */}
                        {(() => {
                          const ConfigIcon = currentConfig.icon;
                          return <ConfigIcon className="w-5 h-5" />;
                        })()}
                      </div>
                      <div>
                        <div className="font-semibold text-forest-900 dark:text-forest-50">
                          {formatDateLabel(record.timestamp)}
                        </div>
                        <div className="text-xs text-sage-500 dark:text-sage-400 flex gap-2">
                          <span>{currentConfig.label}: <span className="font-medium text-forest-700 dark:text-forest-300">{(record as any)[selectedSensor]?.toFixed(1)} {currentConfig.unit}</span></span>
                        </div>
                      </div>
                    </div>

                    {/* Detailed Mini Values for other metrics */}
                    <div className="hidden sm:flex gap-4 text-xs text-sage-500">
                      {sensorConfigs.filter(c => c.key !== selectedSensor).slice(0, 3).map(config => (
                        <div key={config.key} className="flex items-center gap-1">
                          <config.icon className="w-3 h-3 opacity-70" />
                          <span>{(record as any)[config.key]?.toFixed(0)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              {/* Load More Trigger */}
              {visibleData.length < processedData.length && (
                <div id="load-more-trigger" className="h-10 flex items-center justify-center text-sage-400 text-sm">
                  {commonT('common.loading')}...
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-sage-600 dark:text-sage-400">{t('noResults')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
