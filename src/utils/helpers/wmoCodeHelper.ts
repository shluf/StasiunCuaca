/**
 * WMO Weather Code Helper
 * Converts WMO weather codes to human-readable weather conditions
 * Reference: https://open-meteo.com/en/docs
 */

export type WMOCode =
  | 0  // Clear sky
  | 1  // Mainly clear
  | 2  // Partly cloudy
  | 3  // Overcast
  | 45 // Fog
  | 48 // Depositing rime fog
  | 51 // Drizzle: Light
  | 53 // Drizzle: Moderate
  | 55 // Drizzle: Dense
  | 56 // Freezing Drizzle: Light
  | 57 // Freezing Drizzle: Dense
  | 61 // Rain: Slight
  | 63 // Rain: Moderate
  | 65 // Rain: Heavy
  | 66 // Freezing Rain: Light
  | 67 // Freezing Rain: Heavy
  | 71 // Snow fall: Slight
  | 73 // Snow fall: Moderate
  | 75 // Snow fall: Heavy
  | 77 // Snow grains
  | 80 // Rain showers: Slight
  | 81 // Rain showers: Moderate
  | 82 // Rain showers: Violent
  | 85 // Snow showers: Slight
  | 86 // Snow showers: Heavy
  | 95 // Thunderstorm: Slight or moderate
  | 96 // Thunderstorm with slight hail
  | 99; // Thunderstorm with heavy hail

export interface WeatherCondition {
  main: string;
  description: string;
  icon: string;
}

/**
 * Convert WMO weather code to weather condition
 */
export function wmoCodeToCondition(code: number, isDay: boolean = true): WeatherCondition {
  const wmoMap: Record<number, WeatherCondition> = {
    0: {
      main: 'Clear',
      description: isDay ? 'Clear sky' : 'Clear night',
      icon: isDay ? '☀️' : '🌙',
    },
    1: {
      main: 'Clear',
      description: 'Mainly clear',
      icon: isDay ? '🌤️' : '🌙',
    },
    2: {
      main: 'Clouds',
      description: 'Partly cloudy',
      icon: '⛅',
    },
    3: {
      main: 'Clouds',
      description: 'Overcast',
      icon: '☁️',
    },
    45: {
      main: 'Fog',
      description: 'Fog',
      icon: '🌫️',
    },
    48: {
      main: 'Fog',
      description: 'Depositing rime fog',
      icon: '🌫️',
    },
    51: {
      main: 'Drizzle',
      description: 'Light drizzle',
      icon: '🌦️',
    },
    53: {
      main: 'Drizzle',
      description: 'Moderate drizzle',
      icon: '🌦️',
    },
    55: {
      main: 'Drizzle',
      description: 'Dense drizzle',
      icon: '🌧️',
    },
    56: {
      main: 'Drizzle',
      description: 'Freezing drizzle (light)',
      icon: '🌧️',
    },
    57: {
      main: 'Drizzle',
      description: 'Freezing drizzle (dense)',
      icon: '🌧️',
    },
    61: {
      main: 'Rain',
      description: 'Slight rain',
      icon: '🌧️',
    },
    63: {
      main: 'Rain',
      description: 'Moderate rain',
      icon: '🌧️',
    },
    65: {
      main: 'Rain',
      description: 'Heavy rain',
      icon: '⛈️',
    },
    66: {
      main: 'Rain',
      description: 'Freezing rain (light)',
      icon: '🌧️',
    },
    67: {
      main: 'Rain',
      description: 'Freezing rain (heavy)',
      icon: '⛈️',
    },
    71: {
      main: 'Snow',
      description: 'Slight snow fall',
      icon: '❄️',
    },
    73: {
      main: 'Snow',
      description: 'Moderate snow fall',
      icon: '❄️',
    },
    75: {
      main: 'Snow',
      description: 'Heavy snow fall',
      icon: '❄️',
    },
    77: {
      main: 'Snow',
      description: 'Snow grains',
      icon: '❄️',
    },
    80: {
      main: 'Rain',
      description: 'Slight rain showers',
      icon: '🌧️',
    },
    81: {
      main: 'Rain',
      description: 'Moderate rain showers',
      icon: '🌧️',
    },
    82: {
      main: 'Rain',
      description: 'Violent rain showers',
      icon: '⛈️',
    },
    85: {
      main: 'Snow',
      description: 'Slight snow showers',
      icon: '❄️',
    },
    86: {
      main: 'Snow',
      description: 'Heavy snow showers',
      icon: '❄️',
    },
    95: {
      main: 'Thunderstorm',
      description: 'Thunderstorm',
      icon: '⚡',
    },
    96: {
      main: 'Thunderstorm',
      description: 'Thunderstorm with slight hail',
      icon: '⛈️',
    },
    99: {
      main: 'Thunderstorm',
      description: 'Thunderstorm with heavy hail',
      icon: '⛈️',
    },
  };

  return wmoMap[code] || {
    main: 'Unknown',
    description: 'Unknown weather',
    icon: '🌡️',
  };
}

/**
 * Get weather emoji from WMO code
 */
export function getWeatherEmojiFromWMO(code: number, isDay: boolean = true): string {
  return wmoCodeToCondition(code, isDay).icon;
}

/**
 * Get weather description from WMO code
 */
export function getWeatherDescriptionFromWMO(code: number, isDay: boolean = true): string {
  return wmoCodeToCondition(code, isDay).description;
}
