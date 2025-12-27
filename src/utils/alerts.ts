import type { TFunction } from 'i18next';
import React from 'react';
import { FlameIcon, DropletIcon, LungsIcon, ClockIcon } from '@/components/icons';

export type AlertLevel = 'info' | 'warning' | 'critical';

export type Alert = {
    level: AlertLevel;
    message: string;
    icon: React.ReactNode;
};

export function generateAlerts({
    temp,
    hum,
    comfortIndex,
    peakHour,
    nowHour,
    t
}: {
    temp: number;
    hum: number;
    comfortIndex: number;
    peakHour: number;
    nowHour: number;
    t: TFunction;
}): Alert[] {

    const alerts: Alert[] = [];

    // 🔥 Panas ekstrem / Extreme Heat
    if (temp >= 35) {
        alerts.push({
            level: 'critical',
            icon: React.createElement(FlameIcon, { className: 'w-5 h-5' }),
            message: t('common.insights.alertMessages.heatCritical')
        });
    }

    // 💧 Lembap ekstrem / Extreme Humidity
    if (hum >= 85) {
        alerts.push({
            level: 'warning',
            icon: React.createElement(DropletIcon, { className: 'w-5 h-5' }),
            message: t('common.insights.alertMessages.humidityWarning')
        });
    }

    // 🧠 Kenyamanan rendah / Low Comfort
    if (comfortIndex < 50) {
        alerts.push({
            level: 'warning',
            icon: React.createElement(LungsIcon, { className: 'w-5 h-5' }),
            message: t('common.insights.alertMessages.comfortWarning')
        });
    }

    // ⏰ Jam puncak panas / Peak Heat Hour
    if (nowHour === peakHour) {
        alerts.push({
            level: 'info',
            icon: React.createElement(ClockIcon, { className: 'w-5 h-5' }),
            message: t('common.insights.alertMessages.peakHourInfo')
        });
    }

    return alerts;
}
