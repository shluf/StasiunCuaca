import type { TFunction } from 'i18next';

export type AlertLevel = 'info' | 'warning' | 'critical';

export type Alert = {
    level: AlertLevel;
    message: string;
    icon: string;
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
            icon: '🔥',
            message: t('common.insights.alertMessages.heatCritical')
        });
    }

    // 💧 Lembap ekstrem / Extreme Humidity
    if (hum >= 85) {
        alerts.push({
            level: 'warning',
            icon: '💧',
            message: t('common.insights.alertMessages.humidityWarning')
        });
    }

    // 🧠 Kenyamanan rendah / Low Comfort
    if (comfortIndex < 50) {
        alerts.push({
            level: 'warning',
            icon: '🫁',
            message: t('common.insights.alertMessages.comfortWarning')
        });
    }

    // ⏰ Jam puncak panas / Peak Heat Hour
    if (nowHour === peakHour) {
        alerts.push({
            level: 'info',
            icon: '⏰',
            message: t('common.insights.alertMessages.peakHourInfo')
        });
    }

    return alerts;
}
