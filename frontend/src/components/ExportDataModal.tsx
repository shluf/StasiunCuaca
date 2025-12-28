/**
 * Export Data Modal Component
 * Allows users to export sensor data to CSV or Excel with date range selection
 */

import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { format, subDays } from 'date-fns';
import { id, enUS } from 'date-fns/locale';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSensorHistory } from '@/hooks/useSensorData';
import { CloseIcon, DownloadIcon, FileSpreadsheetIcon, FileTextIcon } from '@/components/icons';
import clsx from 'clsx';
import * as XLSX from 'xlsx';

interface ExportDataModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type ExportFormat = 'csv' | 'xlsx';
type AggregationInterval = 'raw' | 'hourly' | 'daily' | 'weekly' | 'monthly';

export function ExportDataModal({ isOpen, onClose }: ExportDataModalProps) {
    const { t } = useTranslation('history');
    const { t: commonT } = useTranslation('common');
    const { language } = useLanguage();
    const locale = language === 'id' ? id : enUS;

    // Form state
    const [startDate, setStartDate] = useState(format(subDays(new Date(), 7), 'yyyy-MM-dd'));
    const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [interval, setInterval] = useState<AggregationInterval>('hourly');
    const [exportFormat, setExportFormat] = useState<ExportFormat>('xlsx');
    const [showPreview, setShowPreview] = useState(false);

    // Fetch data for preview/export
    const { history: data, isLoading } = useSensorHistory(
        showPreview ? new Date(startDate).toISOString() : undefined,
        showPreview ? new Date(endDate).toISOString() : undefined,
        interval
    );

    // Preview data (first 5 rows)
    const previewData = useMemo(() => {
        if (!data) return [];
        return data.slice(0, 5);
    }, [data]);

    const handlePreview = () => {
        setShowPreview(true);
    };

    const handleExport = () => {
        if (!data || data.length === 0) return;

        // Prepare data for export
        const exportData = data.map(row => ({
            [commonT('time.date') || 'Timestamp']: format(new Date(row.timestamp), 'yyyy-MM-dd HH:mm:ss'),
            [commonT('dashboard.temperature') || 'Temperature (°C)']: row.temperature?.toFixed(2),
            [commonT('dashboard.humidity') || 'Humidity (%)']: row.humidity?.toFixed(2),
            [commonT('dashboard.pressure') || 'Pressure (hPa)']: row.pressure?.toFixed(2),
            [commonT('dashboard.windSpeed') || 'Wind Speed (m/s)']: row.windSpeed?.toFixed(2),
            [commonT('dashboard.rainfall') || 'Rainfall (mm)']: row.rainfall?.toFixed(2),
            [commonT('dashboard.co2') || 'CO₂ (ppm)']: row.co2?.toFixed(2),
            [commonT('dashboard.altitude') || 'Altitude (m)']: row.altitude?.toFixed(2),
        }));

        const filename = `sensor_data_${format(new Date(startDate), 'yyyyMMdd')}_${format(new Date(endDate), 'yyyyMMdd')}`;

        if (exportFormat === 'csv') {
            exportToCSV(exportData, filename);
        } else {
            exportToExcel(exportData, filename);
        }
    };

    const exportToCSV = (data: any[], filename: string) => {
        const ws = XLSX.utils.json_to_sheet(data);
        const csv = XLSX.utils.sheet_to_csv(ws);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        downloadBlob(blob, `${filename}.csv`);
    };

    const exportToExcel = (data: any[], filename: string) => {
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sensor Data');
        XLSX.writeFile(wb, `${filename}.xlsx`);
    };

    const downloadBlob = (blob: Blob, filename: string) => {
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white dark:bg-forest-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-scale-in">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-sage-200 dark:border-forest-700">
                    <h2 className="text-xl font-bold font-display text-forest-900 dark:text-forest-50">
                        {t('export.title') || 'Export Data'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-sage-100 dark:hover:bg-forest-800 transition-colors"
                    >
                        <CloseIcon className="w-5 h-5 text-sage-500 dark:text-sage-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(90vh-140px)]">
                    {/* Date Range */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs text-sage-500 dark:text-sage-400 mb-1 block">
                                {commonT('common.startDate')}
                            </label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => {
                                    setStartDate(e.target.value);
                                    setShowPreview(false);
                                }}
                                className="w-full px-3 py-2 rounded-lg bg-sage-50 dark:bg-forest-800 border border-sage-200 dark:border-forest-700 text-forest-900 dark:text-forest-50 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-sage-500 dark:text-sage-400 mb-1 block">
                                {commonT('common.endDate')}
                            </label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => {
                                    setEndDate(e.target.value);
                                    setShowPreview(false);
                                }}
                                className="w-full px-3 py-2 rounded-lg bg-sage-50 dark:bg-forest-800 border border-sage-200 dark:border-forest-700 text-forest-900 dark:text-forest-50 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
                            />
                        </div>
                    </div>

                    {/* Interval */}
                    <div>
                        <label className="text-xs text-sage-500 dark:text-sage-400 mb-2 block">
                            {t('export.interval') || 'Interval'}
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {(['raw', 'hourly', 'daily', 'weekly', 'monthly'] as AggregationInterval[]).map((int) => (
                                <button
                                    key={int}
                                    onClick={() => {
                                        setInterval(int);
                                        setShowPreview(false);
                                    }}
                                    className={clsx(
                                        'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                                        interval === int
                                            ? 'bg-forest-600 text-white'
                                            : 'bg-sage-100 dark:bg-forest-800 text-sage-600 dark:text-sage-400 hover:bg-sage-200 dark:hover:bg-forest-700'
                                    )}
                                >
                                    {commonT(int === 'raw' ? 'common.raw' : `common.${int}`)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Format */}
                    <div>
                        <label className="text-xs text-sage-500 dark:text-sage-400 mb-2 block">
                            {t('export.format') || 'Format'}
                        </label>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setExportFormat('xlsx')}
                                className={clsx(
                                    'px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2',
                                    exportFormat === 'xlsx'
                                        ? 'bg-forest-600 text-white'
                                        : 'bg-sage-100 dark:bg-forest-800 text-sage-600 dark:text-sage-400 hover:bg-sage-200 dark:hover:bg-forest-700'
                                )}
                            >
                                <FileSpreadsheetIcon className="w-4 h-4" /> Excel (.xlsx)
                            </button>
                            <button
                                onClick={() => setExportFormat('csv')}
                                className={clsx(
                                    'px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2',
                                    exportFormat === 'csv'
                                        ? 'bg-forest-600 text-white'
                                        : 'bg-sage-100 dark:bg-forest-800 text-sage-600 dark:text-sage-400 hover:bg-sage-200 dark:hover:bg-forest-700'
                                )}
                            >
                                <FileTextIcon className="w-4 h-4" /> CSV (.csv)
                            </button>
                        </div>
                    </div>

                    {/* Preview Button */}
                    <button
                        onClick={handlePreview}
                        disabled={isLoading}
                        className="w-full py-2 rounded-lg border border-forest-500 text-forest-600 dark:text-mint-400 font-medium hover:bg-forest-50 dark:hover:bg-forest-800 transition-colors disabled:opacity-50"
                    >
                        {isLoading ? (commonT('common.loading') || 'Loading...') : (t('export.preview') || 'Preview Data')}
                    </button>

                    {/* Preview Table */}
                    {showPreview && previewData.length > 0 && (
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs">
                                <thead>
                                    <tr className="bg-sage-100 dark:bg-forest-800">
                                        <th className="px-2 py-2 text-left text-sage-600 dark:text-sage-400 font-medium">
                                            {commonT('time.date') || 'Time'}
                                        </th>
                                        <th className="px-2 py-2 text-right text-sage-600 dark:text-sage-400 font-medium">Temp</th>
                                        <th className="px-2 py-2 text-right text-sage-600 dark:text-sage-400 font-medium">Hum</th>
                                        <th className="px-2 py-2 text-right text-sage-600 dark:text-sage-400 font-medium">Press</th>
                                        <th className="px-2 py-2 text-right text-sage-600 dark:text-sage-400 font-medium">Wind</th>
                                        <th className="px-2 py-2 text-right text-sage-600 dark:text-sage-400 font-medium">Rain</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {previewData.map((row, idx) => (
                                        <tr key={idx} className="border-b border-sage-100 dark:border-forest-800">
                                            <td className="px-2 py-2 text-forest-900 dark:text-forest-50">
                                                {format(new Date(row.timestamp), 'dd MMM HH:mm', { locale })}
                                            </td>
                                            <td className="px-2 py-2 text-right text-forest-900 dark:text-forest-50">{row.temperature?.toFixed(1)}°</td>
                                            <td className="px-2 py-2 text-right text-forest-900 dark:text-forest-50">{row.humidity?.toFixed(0)}%</td>
                                            <td className="px-2 py-2 text-right text-forest-900 dark:text-forest-50">{row.pressure?.toFixed(0)}</td>
                                            <td className="px-2 py-2 text-right text-forest-900 dark:text-forest-50">{row.windSpeed?.toFixed(1)}</td>
                                            <td className="px-2 py-2 text-right text-forest-900 dark:text-forest-50">{row.rainfall?.toFixed(1)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {data && data.length > 5 && (
                                <p className="text-xs text-sage-500 dark:text-sage-400 mt-2 text-center">
                                    {t('export.previewNote', { count: data.length })}
                                </p>
                            )}
                        </div>
                    )}

                    {showPreview && previewData.length === 0 && !isLoading && (
                        <div className="py-4 text-center text-sage-500 dark:text-sage-400">
                            {t('noResults') || 'No data found for selected date range'}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex gap-3 p-4 border-t border-sage-200 dark:border-forest-700">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2 rounded-lg border border-sage-200 dark:border-forest-700 text-sage-600 dark:text-sage-400 font-medium hover:bg-sage-50 dark:hover:bg-forest-800 transition-colors"
                    >
                        {commonT('common.cancel') || 'Cancel'}
                    </button>
                    <button
                        onClick={handleExport}
                        disabled={!showPreview || !data || data.length === 0 || isLoading}
                        className="flex-1 py-2 rounded-lg bg-forest-600 text-white font-bold hover:bg-forest-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        <DownloadIcon className="w-4 h-4" />
                        {t('export.download') || 'Download'}
                    </button>
                </div>
            </div>
        </div>
    );
}
