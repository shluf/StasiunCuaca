/**
 * i18n Configuration
 * Multi-language support setup
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { DEFAULT_LANGUAGE } from '@/config/constants';

// Import translation files
import idCommon from './locales/id/common.json';
import idDashboard from './locales/id/dashboard.json';
import idHistory from './locales/id/history.json';
import idSettings from './locales/id/settings.json';

import enCommon from './locales/en/common.json';
import enDashboard from './locales/en/dashboard.json';
import enHistory from './locales/en/history.json';
import enSettings from './locales/en/settings.json';

import jvCommon from './locales/jv/common.json';
import jvDashboard from './locales/jv/dashboard.json';
import jvHistory from './locales/jv/history.json';
import jvSettings from './locales/jv/settings.json';

// Translation resources
const resources = {
  id: {
    common: idCommon,
    dashboard: idDashboard,
    history: idHistory,
    settings: idSettings,
  },
  en: {
    common: enCommon,
    dashboard: enDashboard,
    history: enHistory,
    settings: enSettings,
  },
  jv: {
    common: jvCommon,
    dashboard: jvDashboard,
    history: jvHistory,
    settings: jvSettings,
  },
};

// Initialize i18next
i18n
  .use(initReactI18next) // Pass i18n instance to react-i18next
  .init({
    resources,
    lng: DEFAULT_LANGUAGE, // Default language
    fallbackLng: 'id', // Fallback language
    defaultNS: 'common', // Default namespace
    ns: ['common', 'dashboard', 'history', 'settings'], // Available namespaces

    interpolation: {
      escapeValue: false, // React already escapes values
    },

    react: {
      useSuspense: false, // Disable suspense mode
    },

    debug: import.meta.env.DEV, // Enable debug in development
  });

export default i18n;
