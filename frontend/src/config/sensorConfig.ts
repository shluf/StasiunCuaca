export const SENSOR_RANGES = {
  temperature: { min: -40, max: 85, unit: '°C' },
  humidity: { min: 0, max: 100, unit: '%' },
  pressure: { min: 300, max: 1100, unit: 'hPa' },
  altitude: { min: -500, max: 9000, unit: 'm' },
  co2: { min: 400, max: 5000, unit: 'ppm' },
  windSpeed: { min: 0, max: 50, unit: 'm/s' },
  windDirection: { min: 0, max: 360, unit: '°' },
  rainfall: { min: 0, max: 500, unit: 'mm' },
  distance: { min: 0, max: 400, unit: 'cm' },
  voltage: { min: 0, max: 30, unit: 'V' },
  busVoltage: { min: 0, max: 30, unit: 'V' },
  current: { min: 0, max: 3200, unit: 'mA' },
} as const;

export const ALERT_THRESHOLDS = {
  temperature: {
    freezing: 0,
    cold: 10,
    normal: { min: 15, max: 30 },
    hot: 35,
    veryHot: 40,
  },
  humidity: {
    veryLow: 20,
    low: 30,
    normal: { min: 40, max: 70 },
    high: 80,
    veryHigh: 90,
  },
  co2: {
    excellent: { min: 400, max: 600 },
    good: { min: 600, max: 800 },
    fair: { min: 800, max: 1000 },
    warning: 1000,
    danger: 2000,
  },
  windSpeed: {
    calm: 0.5,
    light: 3.3,
    moderate: 7.9,
    fresh: 13.8,
    strong: 17.1,
    warning: 20,
    danger: 25,
  },
  rainfall: {
    light: 2.5,
    moderate: 10,
    heavy: 50,
    veryHeavy: 100,
  },
  pressure: {
    veryLow: 980,
    low: 1000,
    normal: { min: 1013, max: 1020 },
    high: 1030,
    veryHigh: 1040,
  },
} as const;

// Sensor display configuration
export const SENSOR_DISPLAY = {
  temperature: {
    label: { id: 'Suhu', en: 'Temperature', jv: 'Suhu' },
    icon: '🌡️',
    color: '#ef4444',
  },
  humidity: {
    label: { id: 'Kelembapan', en: 'Humidity', jv: 'Kalemman' },
    icon: '💧',
    color: '#3b82f6',
  },
  pressure: {
    label: { id: 'Tekanan', en: 'Pressure', jv: 'Tekanan' },
    icon: '🔽',
    color: '#8b5cf6',
  },
  altitude: {
    label: { id: 'Ketinggian', en: 'Altitude', jv: 'Dhuwur' },
    icon: '⛰️',
    color: '#84cc16',
  },
  co2: {
    label: { id: 'CO₂', en: 'CO₂', jv: 'CO₂' },
    icon: '💨',
    color: '#06b6d4',
  },
  windSpeed: {
    label: { id: 'Kecepatan Angin', en: 'Wind Speed', jv: 'Kacepetan Angin' },
    icon: '🌬️',
    color: '#14b8a6',
  },
  windDirection: {
    label: { id: 'Arah Angin', en: 'Wind Direction', jv: 'Arah Angin' },
    icon: '🧭',
    color: '#0ea5e9',
  },
  rainfall: {
    label: { id: 'Curah Hujan', en: 'Rainfall', jv: 'Udan' },
    icon: '🌧️',
    color: '#6366f1',
  },
} as const;
