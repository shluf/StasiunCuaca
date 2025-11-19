/**
 * LocalStorage Service
 * Wrapper for browser localStorage with TypeScript support
 */

import { STORAGE_KEYS } from '@config/constants';

class LocalStorageService {
  /**
   * Get item from localStorage
   */
  get<T = any>(key: string): T | null {
    try {
      const item = window.localStorage.getItem(key);
      if (item === null) return null;

      return JSON.parse(item) as T;
    } catch (error) {
      console.error('[LocalStorage] Error getting item:', key, error);
      return null;
    }
  }

  /**
   * Set item in localStorage
   */
  set<T = any>(key: string, value: T): boolean {
    try {
      const serialized = JSON.stringify(value);
      window.localStorage.setItem(key, serialized);
      return true;
    } catch (error) {
      console.error('[LocalStorage] Error setting item:', key, error);
      return false;
    }
  }

  /**
   * Remove item from localStorage
   */
  remove(key: string): boolean {
    try {
      window.localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('[LocalStorage] Error removing item:', key, error);
      return false;
    }
  }

  /**
   * Clear all items from localStorage
   */
  clear(): boolean {
    try {
      window.localStorage.clear();
      return true;
    } catch (error) {
      console.error('[LocalStorage] Error clearing storage:', error);
      return false;
    }
  }

  /**
   * Check if key exists
   */
  has(key: string): boolean {
    return window.localStorage.getItem(key) !== null;
  }

  /**
   * Get all keys
   */
  keys(): string[] {
    return Object.keys(window.localStorage);
  }

  /**
   * Get storage size (approximate in bytes)
   */
  getSize(): number {
    let total = 0;
    for (const key in window.localStorage) {
      if (window.localStorage.hasOwnProperty(key)) {
        total += window.localStorage[key].length + key.length;
      }
    }
    return total;
  }
}

// Export singleton instance
export const localStorageService = new LocalStorageService();

// Convenience functions for app-specific keys
export const storage = {
  // Theme
  getTheme: () => localStorageService.get(STORAGE_KEYS.THEME),
  setTheme: (theme: string) => localStorageService.set(STORAGE_KEYS.THEME, theme),

  // Language
  getLanguage: () => localStorageService.get(STORAGE_KEYS.LANGUAGE),
  setLanguage: (language: string) => localStorageService.set(STORAGE_KEYS.LANGUAGE, language),

  // Font Size
  getFontSize: () => localStorageService.get(STORAGE_KEYS.FONT_SIZE),
  setFontSize: (fontSize: string) => localStorageService.set(STORAGE_KEYS.FONT_SIZE, fontSize),

  // Onboarding
  getOnboarding: () => localStorageService.get(STORAGE_KEYS.ONBOARDING),
  setOnboarding: (completed: boolean) => localStorageService.set(STORAGE_KEYS.ONBOARDING, completed),

  // Settings
  getSettings: () => localStorageService.get(STORAGE_KEYS.SETTINGS),
  setSettings: (settings: any) => localStorageService.set(STORAGE_KEYS.SETTINGS, settings),
};

export default localStorageService;
