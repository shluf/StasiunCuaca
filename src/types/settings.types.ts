/**
 * User Settings Types
 */

export type Theme = 'light' | 'dark';

export type Language = 'id' | 'en' | 'jv';

export type FontSize = 'small' | 'medium' | 'large' | 'xlarge';

export interface UserSettings {
  theme: Theme;
  language: Language;
  fontSize: FontSize;
  notificationsEnabled: boolean;
  temperatureUnit: 'celsius' | 'fahrenheit';
  windSpeedUnit: 'ms' | 'kmh' | 'mph';
  pressureUnit: 'hpa' | 'mbar' | 'inhg';
}

export interface OnboardingState {
  completed: boolean;
  currentStep: number;
  skipped: boolean;
}
