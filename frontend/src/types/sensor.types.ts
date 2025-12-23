/**
 * Sensor Data Types
 * Based on ESP32/Arduino sensor readings
 */

export interface SensorReading {
  id?: number; // Optional ID from backend
  timestamp: string; // ISO 8601 format
  temperature: number; // °C (suhu)
  humidity: number; // % (lembap)
  pressure: number; // hPa (tekanan)
  altitude: number; // meters (ketinggian)
  co2: number; // ppm
  distance: number; // cm (jarak)
  windSpeed: number; // m/s (angin)
  windDirection: number; // degrees 0-360 (arahAngin)
  rainfall: number; // mm (rain)
  voltage: number; // V (voltSensor)
  busVoltage: number; // V (INA219)
  current: number; // mA (INA219)
}

export interface SensorMetadata {
  sensorId: string;
  location: string;
  calibrationDate: string;
  status: 'online' | 'offline' | 'error';
}

export interface SensorData extends SensorReading {
  metadata: SensorMetadata;
}

export interface SensorHistory {
  readings: SensorReading[];
  start: string;
  end: string;
  count: number;
}

export interface DataInsights {
  minTemp: number;
  maxTemp: number;
  avgTemp: number;
  minHum: number;
  maxHum: number;
  avgHum: number;
  prevMonthDiff: number;
  peakHour: number;
  peakHourAvg: number;
}
