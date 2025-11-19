import { createContext, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import type { FontSize, UserSettings } from '@/types/settings.types';
import { STORAGE_KEYS, DEFAULT_FONT_SIZE, DEFAULT_LANGUAGE } from '@/config/constants';

interface SettingsContextType {
  settings: UserSettings;
  updateSettings: (partial: Partial<UserSettings>) => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  notificationsEnabled: boolean;
  toggleNotifications: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// Font scale mapping
const FONT_SCALE: Record<FontSize, number> = {
  small: 0.875,   // 14px base
  medium: 1,      // 16px base
  large: 1.125,   // 18px base
  xlarge: 1.25,   // 20px base
};

const DEFAULT_SETTINGS: UserSettings = {
  theme: 'light',
  language: DEFAULT_LANGUAGE as 'id' | 'en' | 'jv',
  fontSize: DEFAULT_FONT_SIZE as FontSize,
  notificationsEnabled: true,
  temperatureUnit: 'celsius',
  windSpeedUnit: 'ms',
  pressureUnit: 'hpa',
};

interface SettingsProviderProps {
  children: ReactNode;
}

export function SettingsProvider({ children }: SettingsProviderProps) {
  const [settings, setSettings] = useLocalStorage<UserSettings>(
    STORAGE_KEYS.SETTINGS,
    DEFAULT_SETTINGS
  );

  // Apply font size to document
  useEffect(() => {
    const scale = FONT_SCALE[settings.fontSize];
    document.documentElement.style.fontSize = `${scale}rem`;
  }, [settings.fontSize]);

  const updateSettings = (partial: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...partial }));
  };

  const setFontSize = (size: FontSize) => {
    updateSettings({ fontSize: size });
  };

  const toggleNotifications = () => {
    updateSettings({ notificationsEnabled: !settings.notificationsEnabled });
  };

  const value: SettingsContextType = {
    settings,
    updateSettings,
    fontSize: settings.fontSize,
    setFontSize,
    notificationsEnabled: settings.notificationsEnabled,
    toggleNotifications,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

// Custom hook to use settings context
export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
