import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSensorInsights, useSensorHistory } from '@/hooks/useSensorData';
import {
    TemperatureIcon,
    HumidityIcon,
    WindIcon,
    RainfallIcon,
    BrainIcon,
    ClockIcon,
    FlameIcon,
    SnowflakeIcon,
    LightbulbIcon,
    AlertTriangleIcon
} from '@/components/icons';
import clsx from 'clsx';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    AreaChart,
    Area
} from 'recharts';
import { format } from 'date-fns';
import { id, enUS } from 'date-fns/locale';
import { useLanguage } from '@/contexts/LanguageContext';
import { calculateComfortIndex, comfortLabel } from '@/utils/comfort';
import { generateAlerts } from '@/utils/alerts';

export function InsightsView() {
    const { t } = useTranslation('common');
    const { insights, isLoading } = useSensorInsights();
    const { language } = useLanguage();
    const locale = language === 'id' ? id : enUS;

    // Fetch history for charts (last 30 days for monthly insights)
    // We'll use "daily" aggregation for the charts
    const { startDate, endDate } = React.useMemo(() => {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 30);
        return { startDate: start.toISOString(), endDate: end.toISOString() };
    }, []);

    const { history: historyData } = useSensorHistory(
        startDate,
        endDate,
        'daily'
    );

    if (isLoading || !insights) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-mesh-light dark:bg-mesh-dark">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-forest-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-sage-500 dark:text-sage-400 font-medium">{t('common.insights.analyzing')}</p>
                </div>
            </div>
        );
    }

    // Logic: Comfort Index (Numeric)
    const comfortIndex = calculateComfortIndex(insights.avgTemp, insights.avgHum);
    const comfortStatus = comfortLabel(comfortIndex);

    const comfortUI = {
        very_comfortable: {
            label: t('common.insights.comfortLabels.very_comfortable'),
            color: 'text-emerald-500',
            bg: 'bg-emerald-500'
        },
        comfortable: {
            label: t('common.insights.comfortLabels.comfortable'),
            color: 'text-green-500',
            bg: 'bg-green-500'
        },
        less_comfortable: {
            label: t('common.insights.comfortLabels.less_comfortable'),
            color: 'text-orange-500',
            bg: 'bg-orange-500'
        },
        uncomfortable: {
            label: t('common.insights.comfortLabels.uncomfortable'),
            color: 'text-red-500',
            bg: 'bg-red-500'
        }
    };

    // Logic: Rule Engine Alerts
    const nowHour = new Date().getHours();
    const alerts = generateAlerts({
        temp: insights.avgTemp,
        hum: insights.avgHum,
        comfortIndex,
        peakHour: insights.peakHour,
        nowHour,
        t
    });

    // Format chart data
    const chartData = historyData?.map(item => ({
        ...item,
        date: format(new Date(item.timestamp), 'dd MMM', { locale }),
    })).reverse() || [];

    return (
        <div className="min-h-screen  pb-32">
            <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-8">

                {/* Header */}
                <div className="text-center animate-fade-in">
                    <h1 className="text-3xl font-bold font-display text-forest-900 dark:text-forest-50 mb-2">
                        {t('common.insights.headerTitle')}
                    </h1>
                    <p className="text-sage-600 dark:text-sage-400">
                        {t('common.insights.headerSubtitle')}
                    </p>
                </div>

                {/* 1. Monthly Overview Cards */}
                <section className="animate-slide-up">
                    <h2 className="text-lg font-bold text-forest-800 dark:text-mint-100 mb-4 flex items-center gap-2">
                        <span className="w-1 h-6 bg-forest-500 rounded-full" />
                        {t('common.insights.currentMonth')}
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                        <StatCard
                            label={t('common.insights.minTemp')}
                            value={`${insights.minTemp.toFixed(1)}°`}
                            icon={<TemperatureIcon className="w-4 h-4" />}
                            color="blue"
                        />
                        <StatCard
                            label={t('common.insights.avgTemp')}
                            value={`${insights.avgTemp.toFixed(1)}°`}
                            icon={<TemperatureIcon className="w-4 h-4" />}
                            color="emerald"
                        />
                        <StatCard
                            label={t('common.insights.maxTemp')}
                            value={`${insights.maxTemp.toFixed(1)}°`}
                            icon={<TemperatureIcon className="w-4 h-4" />}
                            color="red"
                        />
                        <StatCard
                            label={t('common.insights.minHum')}
                            value={`${insights.minHum.toFixed(0)}%`}
                            icon={<HumidityIcon className="w-4 h-4" />}
                            color="amber"
                        />
                        <StatCard
                            label={t('common.insights.avgHum')}
                            value={`${insights.avgHum.toFixed(0)}%`}
                            icon={<HumidityIcon className="w-4 h-4" />}
                            color="cyan"
                        />
                        <StatCard
                            label={t('common.insights.maxHum')}
                            value={`${insights.maxHum.toFixed(0)}%`}
                            icon={<HumidityIcon className="w-4 h-4" />}
                            color="indigo"
                        />
                    </div>
                    <div className="mt-3 bg-white/60 dark:bg-forest-900/60 backdrop-blur rounded-xl p-3 border border-sage-200/50 dark:border-forest-700/50 text-sm text-sage-600 dark:text-sage-300 flex items-start gap-2">
                        <LightbulbIcon className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-500" />
                        <span><strong>{t('common.insights.insightPrefix')}</strong> {t('common.insights.insightTemp', { avg: insights.avgTemp.toFixed(1), max: insights.maxTemp.toFixed(1) })}
                            {insights.avgHum > 80 ? ` ${t('common.insights.insightHumHigh')}` : ` ${t('common.insights.insightHumNormal')}`}</span>
                    </div>
                </section>

                {/* 2. Comparisons & Peak Hour */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-up-delayed">

                    {/* Month over Month */}
                    <section className="bg-white/80 dark:bg-forest-900/80 backdrop-blur-xl rounded-2xl p-6 border border-sage-200 dark:border-forest-700 shadow-sm relative overflow-hidden">
                        {/* Decor */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />

                        <h3 className="font-bold text-forest-900 dark:text-forest-50 mb-4">{t('common.insights.vsPrevMonth')}</h3>
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-4xl font-bold font-display text-forest-900 dark:text-forest-50 mb-1">
                                    {insights.prevMonthDiff > 0 ? '+' : ''}{insights.prevMonthDiff.toFixed(1)}°C
                                </div>
                                <div className={clsx(
                                    "inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold",
                                    insights.prevMonthDiff > 0 ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300" : "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                                )}>
                                    {insights.prevMonthDiff > 0 ? t('common.insights.warmer') : t('common.insights.cooler')} {t('common.insights.thanLastMonth')}
                                </div>
                            </div>
                            <div className="text-5xl opacity-20">
                                {insights.prevMonthDiff > 0 ? <FlameIcon className="w-12 h-12" /> : <SnowflakeIcon className="w-12 h-12" />}
                            </div>
                        </div>

                        <p className="mt-4 text-sm text-sage-600 dark:text-sage-400">
                            {insights.prevMonthDiff > 0
                                ? t('common.insights.impactWarmer')
                                : t('common.insights.impactCooler')}
                        </p>
                    </section>

                    {/* Peak Hour */}
                    <section className="bg-white/80 dark:bg-forest-900/80 backdrop-blur-xl rounded-2xl p-6 border border-sage-200 dark:border-forest-700 shadow-sm relative overflow-hidden">
                        {/* Decor */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />

                        <h3 className="font-bold text-forest-900 dark:text-forest-50 mb-4">{t('common.insights.peakHeatHour')}</h3>
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-4xl font-bold font-display text-forest-900 dark:text-forest-50 mb-1">
                                    {String(insights.peakHour).padStart(2, '0')}:00
                                </div>
                                <div className="text-xs text-sage-500 dark:text-sage-400">
                                    {t('common.insights.highestAvgTemp')} {insights.peakHourAvg.toFixed(1)}°C
                                </div>
                            </div>
                            <div className="text-5xl opacity-20">
                                <ClockIcon className="w-12 h-12" />
                            </div>
                        </div>

                        <div className="mt-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3 text-xs text-orange-800 dark:text-orange-200 border border-orange-100 dark:border-orange-900/30 flex items-start gap-2">
                            <AlertTriangleIcon className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            <span>{t('common.insights.peakAdvice')}</span>
                        </div>
                    </section>
                </div>

                {/* 3. Detailed Charts */}
                <section className="space-y-6 animate-slide-up-delayed">
                    <h2 className="text-lg font-bold text-forest-800 dark:text-mint-100 mb-4 flex items-center gap-2">
                        <span className="w-1 h-6 bg-forest-500 rounded-full" />
                        {t('common.insights.sensorDeepDives')}
                    </h2>

                    {/* Temperature Trend */}
                    <ChartCard title={t('common.insights.tempTrend')} icon={<TemperatureIcon className="w-5 h-5 text-emerald-500" />}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.1)" />
                                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ background: 'rgba(255,255,255,0.8)', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                                <Area type="monotone" dataKey="temperature" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorTemp)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </ChartCard>

                    {/* Humidity Trend */}
                    <ChartCard title={t('common.insights.humAnalysis')} icon={<HumidityIcon className="w-5 h-5 text-blue-500" />}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.1)" />
                                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ background: 'rgba(255,255,255,0.8)', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                                <Bar dataKey="humidity" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartCard>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ChartCard title={t('dashboard.windSpeed')} icon={<WindIcon className="w-5 h-5 text-amber-500" />} height="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.1)" />
                                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                    <Tooltip contentStyle={{ background: 'rgba(255,255,255,0.8)', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                                    <Line type="monotone" dataKey="windSpeed" stroke="#F59E0B" strokeWidth={2} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </ChartCard>

                        <ChartCard title={t('dashboard.rainfall')} icon={<RainfallIcon className="w-5 h-5 text-sky-500" />} height="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.1)" />
                                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                    <Tooltip contentStyle={{ background: 'rgba(255,255,255,0.8)', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                                    <Bar dataKey="rainfall" fill="#0EA5E9" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartCard>
                    </div>
                </section>

                {/* 4. Advanced Combined Insights */}
                <section className="bg-gradient-to-br from-forest-800 to-forest-900 rounded-3xl p-6 text-white shadow-xl animate-scale-in">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <BrainIcon className="w-6 h-6" /> {t('common.insights.smartAnalysis')}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Comfort Index */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="font-medium text-forest-200">{t('common.insights.comfortIndex')}</h3>
                                <span className={clsx("px-3 py-1 rounded-full text-xs font-bold bg-white text-forest-900", comfortUI[comfortStatus as keyof typeof comfortUI]?.color || 'text-forest-900')}>
                                    {comfortUI[comfortStatus as keyof typeof comfortUI]?.label} ({comfortIndex})
                                </span>
                            </div>
                            <div className="h-4 bg-forest-700 rounded-full overflow-hidden">
                                <div className={clsx("h-full transition-all duration-1000", comfortUI[comfortStatus as keyof typeof comfortUI]?.bg || 'bg-forest-500')} style={{ width: `${comfortIndex}%` }} />
                            </div>
                            <p className="text-sm text-forest-300">
                                {t('common.insights.insightTemp', { avg: insights.avgTemp.toFixed(1), max: insights.maxTemp.toFixed(1) })}
                                ({insights.avgHum.toFixed(0)}% Hum).
                            </p>
                        </div>

                        {/* Recommendations / Alerts */}
                        <div className="space-y-3">
                            <h3 className="font-medium text-forest-200">{t('common.insights.alerts')}</h3>

                            {alerts.length === 0 && (
                                <p className="text-sm text-forest-300">
                                    {t('common.insights.noAlerts')}
                                </p>
                            )}

                            {alerts.map((alert, idx) => (
                                <div
                                    key={idx}
                                    className={clsx(
                                        "flex gap-3 items-start rounded-lg p-3 text-sm",
                                        alert.level === 'critical' && "bg-red-500/20 text-red-200",
                                        alert.level === 'warning' && "bg-orange-500/20 text-orange-200",
                                        alert.level === 'info' && "bg-blue-500/20 text-blue-200"
                                    )}
                                >
                                    <span className="flex-shrink-0">{alert.icon}</span>
                                    <span>{alert.message}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

// Sub-components for cleaner file
function StatCard({ label, value, icon, color }: { label: string, value: string, icon: React.ReactNode, color: string }) {
    // Mapping color names to Tailwind types safe logic
    // Just hardcoding some classes for speed
    const bgColors: Record<string, string> = {
        blue: 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/30 text-blue-900 dark:text-blue-100',
        emerald: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-900/30 text-emerald-900 dark:text-emerald-100',
        red: 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-900/30 text-red-900 dark:text-red-100',
        amber: 'bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-900/30 text-amber-900 dark:text-amber-100',
        cyan: 'bg-cyan-50 dark:bg-cyan-900/20 border-cyan-100 dark:border-cyan-900/30 text-cyan-900 dark:text-cyan-100',
        indigo: 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-900/30 text-indigo-900 dark:text-indigo-100',
    };

    const iconColors: Record<string, string> = {
        blue: 'bg-blue-200 dark:bg-blue-800 text-blue-700 dark:text-blue-200',
        emerald: 'bg-emerald-200 dark:bg-emerald-800 text-emerald-700 dark:text-emerald-200',
        red: 'bg-red-200 dark:bg-red-800 text-red-700 dark:text-red-200',
        amber: 'bg-amber-200 dark:bg-amber-800 text-amber-700 dark:text-amber-200',
        cyan: 'bg-cyan-200 dark:bg-cyan-800 text-cyan-700 dark:text-cyan-200',
        indigo: 'bg-indigo-200 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-200',
    };

    return (
        <div className={clsx("rounded-2xl p-3 border flex flex-col items-center justify-center text-center", bgColors[color] || bgColors.blue)}>
            <div className={clsx("w-8 h-8 rounded-full flex items-center justify-center mb-2", iconColors[color] || iconColors.blue)}>
                {icon}
            </div>
            <div className="text-xs opacity-70 mb-1">{label}</div>
            <div className="text-lg font-bold">{value}</div>
        </div>
    )
}

function ChartCard({ title, icon, children, height = "h-72" }: { title: string, icon: React.ReactNode, children: React.ReactNode, height?: string }) {
    return (
        <div className="bg-white/80 dark:bg-forest-900/80 backdrop-blur-xl rounded-3xl p-6 border border-sage-200/50 dark:border-forest-700/50 shadow-glass-light dark:shadow-glass-dark">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-xl bg-sage-50 dark:bg-forest-800 flex items-center justify-center">
                    {icon}
                </div>
                <h3 className="font-bold text-forest-900 dark:text-forest-50">{title}</h3>
            </div>
            <div className={clsx("w-full", height)}>
                {children}
            </div>
        </div>
    )
}
