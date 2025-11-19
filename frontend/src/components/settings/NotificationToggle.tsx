import { useSettings } from '@/contexts/SettingsContext';
import { useTranslation } from '@/i18n';
import { notificationService } from '@/services/notification/notificationService';
import { useState, useEffect } from 'react';
import clsx from 'clsx';

export function NotificationToggle() {
  const { notificationsEnabled, toggleNotifications } = useSettings();
  const { t } = useTranslation('settings');
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const handleToggle = async () => {
    if (!notificationsEnabled && Notification.permission === 'default') {
      // Request permission first
      const granted = await notificationService.requestNotificationPermission();
      if (granted) {
        setPermission('granted');
        toggleNotifications();
      } else {
        alert(t('notificationPermissionDenied'));
      }
    } else if (!notificationsEnabled && Notification.permission === 'denied') {
      alert(t('notificationPermissionBlocked'));
    } else {
      toggleNotifications();
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-900 dark:text-white">
            {t('notifications')}
          </label>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {notificationsEnabled ? t('notificationsOn') : t('notificationsOff')}
          </p>
        </div>

        <button
          onClick={handleToggle}
          disabled={!('Notification' in window)}
          className={clsx(
            'relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900',
            notificationsEnabled ? 'bg-blue-600' : 'bg-gray-300',
            !('Notification' in window) && 'opacity-50 cursor-not-allowed'
          )}
          aria-label={t('toggleNotifications')}
        >
          <span
            className={clsx(
              'inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform',
              notificationsEnabled ? 'translate-x-7' : 'translate-x-1'
            )}
          >
            <span className="flex h-full w-full items-center justify-center text-xs">
              {notificationsEnabled ? '🔔' : '🔕'}
            </span>
          </span>
        </button>
      </div>

      {permission === 'denied' && (
        <p className="mt-2 text-xs text-red-500 dark:text-red-400">
          {t('notificationPermissionBlocked')}
        </p>
      )}

      {!('Notification' in window) && (
        <p className="mt-2 text-xs text-yellow-600 dark:text-yellow-400">
          {t('notificationNotSupported')}
        </p>
      )}
    </div>
  );
}
