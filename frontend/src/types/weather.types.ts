/**
 * Weather API Types
 * For external weather API (e.g., OpenWeatherMap)
 */

export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface WeatherMain {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
}

export interface WeatherWind {
  speed: number;
  deg: number;
  gust?: number;
}

export interface WeatherClouds {
  all: number;
}

export interface WeatherRain {
  '1h'?: number;
  '3h'?: number;
}

export interface WeatherCurrent {
  dt: number;
  weather: WeatherCondition[];
  main: WeatherMain;
  wind: WeatherWind;
  clouds: WeatherClouds;
  rain?: WeatherRain;
  visibility: number;
}

export interface WeatherForecastItem {
  dt: number;
  temp: {
    day: number;
    night: number;
    min: number;
    max: number;
  };
  weather: WeatherCondition[];
  humidity: number;
  wind_speed: number;
  pop: number; // Probability of precipitation
}

export interface WeatherForecast {
  daily: WeatherForecastItem[];
}
