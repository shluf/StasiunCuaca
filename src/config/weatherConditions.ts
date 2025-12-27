export type WeatherCondition =
  | 'clear-day'
  | 'clear-night'
  | 'partly-cloudy-day'
  | 'partly-cloudy-night'
  | 'cloudy'
  | 'rain'
  | 'heavy-rain'
  | 'thunderstorm'
  | 'drizzle'
  | 'snow'
  | 'fog'
  | 'mist'
  | 'wind'
  | 'hot'
  | 'cold';

export interface WeatherConditionConfig {
  icon: string; // Emoji or icon identifier
  color: string; // Tailwind color class
  bgGradient: string; // Background gradient classes
  description: {
    id: string;
    en: string;
    jv: string;
  };
}

export const WEATHER_CONDITIONS: Record<WeatherCondition, WeatherConditionConfig> = {
  'clear-day': {
    icon: '☀️',
    color: 'text-yellow-500',
    bgGradient: 'from-yellow-400 to-orange-400',
    description: {
      id: 'Cerah',
      en: 'Clear',
      jv: 'Padhang',
    },
  },
  'clear-night': {
    icon: '🌙',
    color: 'text-indigo-400',
    bgGradient: 'from-indigo-900 to-purple-900',
    description: {
      id: 'Cerah Malam',
      en: 'Clear Night',
      jv: 'Padhang Wengi',
    },
  },
  'partly-cloudy-day': {
    icon: '⛅',
    color: 'text-yellow-400',
    bgGradient: 'from-blue-400 to-yellow-300',
    description: {
      id: 'Berawan Sebagian',
      en: 'Partly Cloudy',
      jv: 'Mendhung Sithik',
    },
  },
  'partly-cloudy-night': {
    icon: '🌙☁️',
    color: 'text-indigo-300',
    bgGradient: 'from-indigo-800 to-gray-800',
    description: {
      id: 'Berawan Malam',
      en: 'Partly Cloudy Night',
      jv: 'Mendhung Wengi',
    },
  },
  cloudy: {
    icon: '☁️',
    color: 'text-gray-400',
    bgGradient: 'from-gray-400 to-gray-500',
    description: {
      id: 'Berawan',
      en: 'Cloudy',
      jv: 'Mendhung',
    },
  },
  rain: {
    icon: '🌧️',
    color: 'text-blue-500',
    bgGradient: 'from-gray-600 to-blue-700',
    description: {
      id: 'Hujan',
      en: 'Rain',
      jv: 'Udan',
    },
  },
  'heavy-rain': {
    icon: '⛈️',
    color: 'text-blue-700',
    bgGradient: 'from-gray-700 to-blue-900',
    description: {
      id: 'Hujan Lebat',
      en: 'Heavy Rain',
      jv: 'Udan Deres',
    },
  },
  thunderstorm: {
    icon: '⚡',
    color: 'text-purple-500',
    bgGradient: 'from-gray-800 to-purple-900',
    description: {
      id: 'Badai Petir',
      en: 'Thunderstorm',
      jv: 'Bledhek',
    },
  },
  drizzle: {
    icon: '🌦️',
    color: 'text-sky-400',
    bgGradient: 'from-gray-400 to-sky-500',
    description: {
      id: 'Gerimis',
      en: 'Drizzle',
      jv: 'Grimis',
    },
  },
  snow: {
    icon: '❄️',
    color: 'text-cyan-300',
    bgGradient: 'from-cyan-200 to-blue-300',
    description: {
      id: 'Salju',
      en: 'Snow',
      jv: 'Salju',
    },
  },
  fog: {
    icon: '🌫️',
    color: 'text-gray-300',
    bgGradient: 'from-gray-300 to-gray-400',
    description: {
      id: 'Kabut',
      en: 'Fog',
      jv: 'Pedhut',
    },
  },
  mist: {
    icon: '🌁',
    color: 'text-gray-400',
    bgGradient: 'from-gray-200 to-gray-400',
    description: {
      id: 'Berkabut',
      en: 'Mist',
      jv: 'Pedhut Tipis',
    },
  },
  wind: {
    icon: '💨',
    color: 'text-cyan-500',
    bgGradient: 'from-cyan-400 to-sky-500',
    description: {
      id: 'Berangin',
      en: 'Windy',
      jv: 'Angine Kenceng',
    },
  },
  hot: {
    icon: '🌡️',
    color: 'text-red-500',
    bgGradient: 'from-orange-500 to-red-600',
    description: {
      id: 'Panas',
      en: 'Hot',
      jv: 'Panas',
    },
  },
  cold: {
    icon: '🧊',
    color: 'text-blue-300',
    bgGradient: 'from-blue-300 to-cyan-400',
    description: {
      id: 'Dingin',
      en: 'Cold',
      jv: 'Adhem',
    },
  },
};

/**
 * Determine weather condition based on sensor data
 */
export function determineWeatherCondition(data: {
  temperature: number;
  rainfall: number;
  windSpeed: number;
  humidity: number;
  hour?: number; // 0-23
}): WeatherCondition {
  const { temperature, rainfall, windSpeed, humidity, hour = new Date().getHours() } = data;
  const isNight = hour < 6 || hour >= 18;

  // Heavy rain or thunderstorm
  if (rainfall > 20) {
    return 'heavy-rain';
  }
  if (rainfall > 10) {
    return 'thunderstorm';
  }
  if (rainfall > 5) {
    return 'rain';
  }
  if (rainfall > 0.5) {
    return 'drizzle';
  }

  // Fog/Mist conditions
  if (humidity > 95 && temperature < 25) {
    return 'fog';
  }
  if (humidity > 90) {
    return 'mist';
  }

  // Temperature extremes
  if (temperature > 35) {
    return 'hot';
  }
  if (temperature < 15) {
    return 'cold';
  }

  // Windy
  if (windSpeed > 15) {
    return 'wind';
  }

  // Cloudy conditions
  if (humidity > 70) {
    return isNight ? 'partly-cloudy-night' : 'partly-cloudy-day';
  }
  if (humidity > 60) {
    return 'cloudy';
  }

  // Clear conditions
  return isNight ? 'clear-night' : 'clear-day';
}

/**
 * Get temperature category
 */
export function getTemperatureCategory(temp: number): 'freezing' | 'cold' | 'cool' | 'mild' | 'warm' | 'hot' | 'extreme' {
  if (temp < 0) return 'freezing';
  if (temp < 15) return 'cold';
  if (temp < 20) return 'cool';
  if (temp < 25) return 'mild';
  if (temp < 30) return 'warm';
  if (temp < 35) return 'hot';
  return 'extreme';
}

/**
 * Get humidity category
 */
export function getHumidityCategory(humidity: number): 'very-dry' | 'dry' | 'comfortable' | 'humid' | 'very-humid' {
  if (humidity < 30) return 'very-dry';
  if (humidity < 40) return 'dry';
  if (humidity < 60) return 'comfortable';
  if (humidity < 80) return 'humid';
  return 'very-humid';
}

/**
 * Get wind speed category (Beaufort scale simplified)
 */
export function getWindCategory(windSpeed: number): 'calm' | 'light' | 'moderate' | 'strong' | 'gale' | 'storm' {
  if (windSpeed < 2) return 'calm';
  if (windSpeed < 6) return 'light';
  if (windSpeed < 12) return 'moderate';
  if (windSpeed < 20) return 'strong';
  if (windSpeed < 28) return 'gale';
  return 'storm';
}
