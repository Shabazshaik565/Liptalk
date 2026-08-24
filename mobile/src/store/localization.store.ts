import { create } from 'zustand';
import { SupportedLanguageCode, getTranslation, LANGUAGES } from '../locales';
import { secureStorage } from '../utils/secureStorage';
import {
  formatCurrency as utilsFormatCurrency,
  formatDate as utilsFormatDate,
  formatRelativeTime as utilsFormatRelativeTime,
  formatNumber as utilsFormatNumber,
  SUPPORTED_COUNTRIES,
  SUPPORTED_CURRENCIES,
} from '../utils/localization';

export interface LocalizationState {
  language: SupportedLanguageCode;
  country: string;
  region: string;
  city: string;
  timezone: string;
  currency: string;
  locale: string;
  isLocationPublic: boolean;
  allowRegionalDiscovery: boolean;
  autoDetectTimezone: boolean;
  isRTL: boolean;

  // Actions
  setLanguage: (lang: SupportedLanguageCode) => Promise<void>;
  setCountry: (country: string) => Promise<void>;
  setRegion: (region: string) => Promise<void>;
  setCity: (city: string) => Promise<void>;
  setTimezone: (timezone: string) => Promise<void>;
  setCurrency: (currency: string) => Promise<void>;
  updatePreferences: (prefs: Partial<LocalizationState>) => Promise<void>;
  loadPreferences: () => Promise<void>;

  // Translation & Formatting helpers
  t: (key: string, params?: Record<string, string | number>) => string;
  formatCurrency: (amount: number, overrideCurrency?: string) => string;
  formatDate: (date: string | Date | number, formatStyle?: 'full' | 'date' | 'time' | 'short') => string;
  formatRelativeTime: (date: string | Date | number) => string;
  formatNumber: (value: number) => string;
}

const STORAGE_KEY = 'liptalk_user_preferences';

export const useLocalization = create<LocalizationState>((set, get) => ({
  language: 'en',
  country: 'India',
  region: 'Tamil Nadu',
  city: 'Chennai',
  timezone: 'Asia/Kolkata',
  currency: 'INR',
  locale: 'en-IN',
  isLocationPublic: false,
  allowRegionalDiscovery: true,
  autoDetectTimezone: false,
  isRTL: false,

  setLanguage: async (lang: SupportedLanguageCode) => {
    const isRTL = LANGUAGES[lang]?.direction === 'rtl';
    set({ language: lang, isRTL });
    await get().updatePreferences({ language: lang, isRTL });
  },

  setCountry: async (country: string) => {
    const matched = SUPPORTED_COUNTRIES.find((c) => c.name === country);
    const updates: Partial<LocalizationState> = { country };
    if (matched) {
      updates.currency = matched.defaultCurrency;
      updates.timezone = matched.defaultTimezone;
      updates.region = matched.regions[0] || '';
    }
    set(updates);
    await get().updatePreferences(updates);
  },

  setRegion: async (region: string) => {
    set({ region });
    await get().updatePreferences({ region });
  },

  setCity: async (city: string) => {
    set({ city });
    await get().updatePreferences({ city });
  },

  setTimezone: async (timezone: string) => {
    set({ timezone });
    await get().updatePreferences({ timezone });
  },

  setCurrency: async (currency: string) => {
    set({ currency });
    await get().updatePreferences({ currency });
  },

  updatePreferences: async (prefs: Partial<LocalizationState>) => {
    set((state) => ({ ...state, ...prefs }));
    const current = get();
    const toPersist = {
      language: current.language,
      country: current.country,
      region: current.region,
      city: current.city,
      timezone: current.timezone,
      currency: current.currency,
      locale: current.locale,
      isLocationPublic: current.isLocationPublic,
      allowRegionalDiscovery: current.allowRegionalDiscovery,
      autoDetectTimezone: current.autoDetectTimezone,
    };
    await secureStorage.setItem(STORAGE_KEY, JSON.stringify(toPersist));
  },

  loadPreferences: async () => {
    try {
      const stored = await secureStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const isRTL = LANGUAGES[parsed.language as SupportedLanguageCode]?.direction === 'rtl';
        set({ ...parsed, isRTL });
      }
    } catch (e) {
      // Fall back to standard defaults
    }
  },

  t: (key: string, params?: Record<string, string | number>) => {
    const lang = get().language;
    return getTranslation(lang, key, params);
  },

  formatCurrency: (amount: number, overrideCurrency?: string) => {
    const currency = overrideCurrency || get().currency;
    const locale = get().locale;
    return utilsFormatCurrency(amount, currency, locale);
  },

  formatDate: (date: string | Date | number, formatStyle = 'date') => {
    const timezone = get().timezone;
    const locale = get().locale;
    return utilsFormatDate(date, formatStyle, timezone, locale);
  },

  formatRelativeTime: (date: string | Date | number) => {
    const lang = get().language;
    return utilsFormatRelativeTime(date, lang);
  },

  formatNumber: (value: number) => {
    const locale = get().locale;
    return utilsFormatNumber(value, locale);
  },
}));
