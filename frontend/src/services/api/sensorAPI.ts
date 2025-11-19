/**
 * Sensor API Service
 * Backend sensor data API integration
 */

import { apiCall } from './axiosInstance';
import { API_ENDPOINTS } from '@config/apiConfig';
import type { SensorData, SensorReading, SensorHistory } from '@/types/sensor.types';

/**
 * Get all sensors
 */
export async function getAllSensors(): Promise<SensorData[]> {
  return apiCall<SensorData[]>({
    method: 'GET',
    url: API_ENDPOINTS.SENSORS,
  });
}

/**
 * Get sensor by ID
 */
export async function getSensorById(id: string): Promise<SensorData> {
  return apiCall<SensorData>({
    method: 'GET',
    url: API_ENDPOINTS.SENSOR_BY_ID(id),
  });
}

/**
 * Get latest sensor readings
 */
export async function getLatestReadings(): Promise<SensorReading> {
  return apiCall<SensorReading>({
    method: 'GET',
    url: API_ENDPOINTS.SENSOR_READINGS,
  });
}

/**
 * Get sensor history
 */
export async function getSensorHistory(
  start: string,
  end: string,
  interval?: number
): Promise<SensorHistory> {
  return apiCall<SensorHistory>({
    method: 'GET',
    url: API_ENDPOINTS.SENSOR_HISTORY,
    params: {
      start,
      end,
      interval,
    },
  });
}

/**
 * Submit sensor reading (for testing/manual entry)
 */
export async function submitSensorReading(
  reading: Partial<SensorReading>
): Promise<{ success: boolean; id: string }> {
  return apiCall<{ success: boolean; id: string }>({
    method: 'POST',
    url: API_ENDPOINTS.SENSOR_READINGS,
    data: reading,
  });
}
