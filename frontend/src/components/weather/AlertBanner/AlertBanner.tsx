import { useTranslation } from '@/i18n';
import clsx from 'clsx';
import { useState } from 'react';

export type AlertSeverity = 'info' | 'warning' | 'danger' | 'success';

export interface WeatherAlert {
  id: string;
  severity: AlertSeverity;
  title: string;
  message: string;
  timestamp?: Date;
  dismissible?: boolean;
}

export interface AlertBannerProps {
  alerts: WeatherAlert[];
  onDismiss?: (alertId: string) => void;
  className?: string;
}

const SEVERITY_STYLES: Record<AlertSeverity, {
  bg: string;
  border: string;
  text: string;
  icon: string;
}> = {
  info: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-200 dark:border-blue-800',
    text: 'text-blue-800 dark:text-blue-200',
    icon: 'ℹ️',
  },
  warning: {
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    border: 'border-yellow-200 dark:border-yellow-800',
    text: 'text-yellow-800 dark:text-yellow-200',
    icon: '⚠️',
  },
  danger: {
    bg: 'bg-red-50 dark:bg-red-900/20',
    border: 'border-red-200 dark:border-red-800',
    text: 'text-red-800 dark:text-red-200',
    icon: '🚨',
  },
  success: {
    bg: 'bg-green-50 dark:bg-green-900/20',
    border: 'border-green-200 dark:border-green-800',
    text: 'text-green-800 dark:text-green-200',
    icon: '✅',
  },
};

export function AlertBanner({ alerts, onDismiss, className }: AlertBannerProps) {
  const { t } = useTranslation('common');
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());

  const visibleAlerts = alerts.filter((alert) => !dismissedAlerts.has(alert.id));

  const handleDismiss = (alertId: string) => {
    setDismissedAlerts((prev) => new Set(prev).add(alertId));
    onDismiss?.(alertId);
  };

  if (visibleAlerts.length === 0) {
    return null;
  }

  return (
    <div className={clsx('space-y-3', className)}>
      {visibleAlerts.map((alert) => {
        const styles = SEVERITY_STYLES[alert.severity];

        return (
          <div
            key={alert.id}
            className={clsx(
              'rounded-lg border-l-4 p-4',
              styles.bg,
              styles.border,
              'shadow-md',
              'animate-fadeIn'
            )}
            role="alert"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">{styles.icon}</span>

              <div className="flex-1 min-w-0">
                <h3 className={clsx('font-semibold text-sm mb-1', styles.text)}>
                  {alert.title}
                </h3>
                <p className={clsx('text-sm', styles.text, 'opacity-90')}>
                  {alert.message}
                </p>
                {alert.timestamp && (
                  <p className={clsx('text-xs mt-2', styles.text, 'opacity-70')}>
                    {new Date(alert.timestamp).toLocaleTimeString('id-ID', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                )}
              </div>

              {alert.dismissible && (
                <button
                  onClick={() => handleDismiss(alert.id)}
                  className={clsx(
                    'flex-shrink-0 p-1 rounded hover:bg-black/10 dark:hover:bg-white/10',
                    styles.text,
                    'transition-colors'
                  )}
                  aria-label={t('close')}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Compact inline alert for small spaces
 */
export interface InlineAlertProps {
  severity: AlertSeverity;
  message: string;
  className?: string;
}

export function InlineAlert({ severity, message, className }: InlineAlertProps) {
  const styles = SEVERITY_STYLES[severity];

  return (
    <div
      className={clsx(
        'inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm',
        styles.bg,
        styles.text,
        className
      )}
      role="alert"
    >
      <span className="text-base">{styles.icon}</span>
      <span>{message}</span>
    </div>
  );
}
