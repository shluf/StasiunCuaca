import { createContext, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useTranslation as useI18nTranslation } from 'react-i18next';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import type { Language } from '@/types/settings.types';
import { STORAGE_KEYS, DEFAULT_LANGUAGE } from '@/config/constants';
import '@/i18n/config'; // Import i18n configuration

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  changeLanguage: (lang: Language) => void;
  t: (key: string, options?: any) => string;
  i18n: any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const { i18n, t } = useI18nTranslation();
  const [language, setStoredLanguage] = useLocalStorage<Language>(
    STORAGE_KEYS.LANGUAGE,
    DEFAULT_LANGUAGE as Language
  );

  // Sync language with i18next
  useEffect(() => {
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }, [language, i18n]);

  // Update HTML lang attribute
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setStoredLanguage(lang);
    i18n.changeLanguage(lang);
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    changeLanguage: setLanguage, // Alias for consistency
    t,
    i18n,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

// Custom hook to use language context
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Re-export useTranslation for convenience
export { useI18nTranslation as useTranslation };
