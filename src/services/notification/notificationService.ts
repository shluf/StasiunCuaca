/**
 * Notification Service
 * Browser push notification management
 */

import { ALERT_THRESHOLDS } from '@config/sensorConfig';
import type { SensorReading } from '@/types/sensor.types';

export type NotificationSeverity = 'info' | 'warning' | 'danger';

interface CustomNotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  severity?: NotificationSeverity;
}

class NotificationService {
  private permission: NotificationPermission = 'default';

  constructor() {
    if ('Notification' in window) {
      this.permission = Notification.permission;
    }
  }

  /**
   * Request notification permission
   */
  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('[Notification] Not supported in this browser');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      this.permission = permission;
      return permission === 'granted';
    } catch (error) {
      console.error('[Notification] Permission request failed:', error);
      return false;
    }
  }

  /**
   * Send notification
   */
  send(options: CustomNotificationOptions): void {
    if (this.permission !== 'granted') {
      console.warn('[Notification] Permission not granted');
      return;
    }

    try {
      const notification = new Notification(options.title, {
        body: options.body,
        icon: options.icon || '/icons/weather.png',
        badge: options.badge || '/icons/badge.png',
        tag: `weather-${Date.now()}`,
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    } catch (error) {
      console.error('[Notification] Send failed:', error);
    }
  }

  /**
   * Send weather alert notification
   */
  sendWeatherAlert(condition: string, severity: NotificationSeverity): void {
    const severityEmoji = {
      info: 'ℹ️',
      warning: '⚠️',
      danger: '🚨',
    };

    this.send({
      title: `${severityEmoji[severity]} Peringatan Cuaca`,
      body: `${condition} terdeteksi!`,
      severity,
    });
  }

  /**
   * Check sensor data and send alerts if needed
   */
  checkWeatherAlerts(sensorData: SensorReading): void {
    if (this.permission !== 'granted') return;

    // Temperature alerts
    if (sensorData.temperature > ALERT_THRESHOLDS.temperature.veryHot) {
      this.sendWeatherAlert(
        `Suhu sangat panas: ${sensorData.temperature.toFixed(1)}°C`,
        'danger'
      );
    } else if (sensorData.temperature > ALERT_THRESHOLDS.temperature.hot) {
      this.sendWeatherAlert(
        `Suhu panas: ${sensorData.temperature.toFixed(1)}°C`,
        'warning'
      );
    } else if (sensorData.temperature < ALERT_THRESHOLDS.temperature.cold) {
      this.sendWeatherAlert(
        `Suhu dingin: ${sensorData.temperature.toFixed(1)}°C`,
        'warning'
      );
    }

    // Humidity alerts
    if (sensorData.humidity > ALERT_THRESHOLDS.humidity.veryHigh) {
      this.sendWeatherAlert(
        `Kelembapan sangat tinggi: ${sensorData.humidity.toFixed(0)}%`,
        'warning'
      );
    } else if (sensorData.humidity < ALERT_THRESHOLDS.humidity.veryLow) {
      this.sendWeatherAlert(
        `Kelembapan sangat rendah: ${sensorData.humidity.toFixed(0)}%`,
        'warning'
      );
    }

    // CO2 alerts
    if (sensorData.co2 > ALERT_THRESHOLDS.co2.danger) {
      this.sendWeatherAlert(
        `CO₂ berbahaya: ${sensorData.co2} ppm`,
        'danger'
      );
    } else if (sensorData.co2 > ALERT_THRESHOLDS.co2.warning) {
      this.sendWeatherAlert(
        `CO₂ tinggi: ${sensorData.co2} ppm`,
        'warning'
      );
    }

    // Wind speed alerts
    if (sensorData.windSpeed > ALERT_THRESHOLDS.windSpeed.danger) {
      this.sendWeatherAlert(
        `Angin sangat kencang: ${sensorData.windSpeed.toFixed(1)} m/s`,
        'danger'
      );
    } else if (sensorData.windSpeed > ALERT_THRESHOLDS.windSpeed.warning) {
      this.sendWeatherAlert(
        `Angin kencang: ${sensorData.windSpeed.toFixed(1)} m/s`,
        'warning'
      );
    }

    // Rainfall alerts
    if (sensorData.rainfall > ALERT_THRESHOLDS.rainfall.veryHeavy) {
      this.sendWeatherAlert(
        `Hujan sangat deras: ${sensorData.rainfall.toFixed(1)} mm`,
        'danger'
      );
    } else if (sensorData.rainfall > ALERT_THRESHOLDS.rainfall.heavy) {
      this.sendWeatherAlert(
        `Hujan deras: ${sensorData.rainfall.toFixed(1)} mm`,
        'warning'
      );
    }

    // Pressure alerts (barometer falling rapidly)
    if (sensorData.pressure < ALERT_THRESHOLDS.pressure.veryLow) {
      this.sendWeatherAlert(
        `Tekanan sangat rendah: ${sensorData.pressure.toFixed(1)} hPa`,
        'warning'
      );
    }
  }

  /**
   * Get permission status
   */
  getPermission(): NotificationPermission {
    return this.permission;
  }

  /**
   * Check if notifications are supported
   */
  isSupported(): boolean {
    return 'Notification' in window;
  }

  /**
   * Check if notifications are enabled
   */
  isEnabled(): boolean {
    return this.permission === 'granted';
  }
}

// Export singleton instance
export const notificationService = new NotificationService();
export default notificationService;
