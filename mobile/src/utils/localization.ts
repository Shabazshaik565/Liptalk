import { SupportedLanguageCode, LANGUAGES } from '../locales';

export interface CurrencyConfig {
  code: string;
  name: string;
  symbol: string;
  symbolPosition: 'prefix' | 'suffix';
  decimalPlaces: number;
  exchangeRateToINR: number;
}

export interface CountryConfig {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  defaultLanguage: SupportedLanguageCode;
  defaultCurrency: string;
  defaultTimezone: string;
  regions: string[];
}

export const SUPPORTED_CURRENCIES: Record<string, CurrencyConfig> = {
  INR: { code: 'INR', name: 'Indian Rupee', symbol: '₹', symbolPosition: 'prefix', decimalPlaces: 2, exchangeRateToINR: 1.0 },
  USD: { code: 'USD', name: 'US Dollar', symbol: '$', symbolPosition: 'prefix', decimalPlaces: 2, exchangeRateToINR: 86.5 },
  EUR: { code: 'EUR', name: 'Euro', symbol: '€', symbolPosition: 'prefix', decimalPlaces: 2, exchangeRateToINR: 91.2 },
  GBP: { code: 'GBP', name: 'British Pound', symbol: '£', symbolPosition: 'prefix', decimalPlaces: 2, exchangeRateToINR: 109.8 },
  AED: { code: 'AED', name: 'UAE Dirham', symbol: 'AED', symbolPosition: 'prefix', decimalPlaces: 2, exchangeRateToINR: 23.55 },
  SGD: { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', symbolPosition: 'prefix', decimalPlaces: 2, exchangeRateToINR: 64.8 },
  AUD: { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', symbolPosition: 'prefix', decimalPlaces: 2, exchangeRateToINR: 56.4 },
  CAD: { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$', symbolPosition: 'prefix', decimalPlaces: 2, exchangeRateToINR: 61.2 },
  JPY: { code: 'JPY', name: 'Japanese Yen', symbol: '¥', symbolPosition: 'prefix', decimalPlaces: 0, exchangeRateToINR: 0.57 },
};

export const SUPPORTED_COUNTRIES: CountryConfig[] = [
  {
    code: 'IN',
    name: 'India',
    nativeName: 'भारत',
    flag: '🇮🇳',
    defaultLanguage: 'en',
    defaultCurrency: 'INR',
    defaultTimezone: 'Asia/Kolkata',
    regions: ['Tamil Nadu', 'Karnataka', 'Maharashtra', 'Delhi NCR', 'Telangana', 'Kerala', 'Gujarat', 'West Bengal'],
  },
  {
    code: 'US',
    name: 'United States',
    nativeName: 'United States',
    flag: '🇺🇸',
    defaultLanguage: 'en',
    defaultCurrency: 'USD',
    defaultTimezone: 'America/New_York',
    regions: ['California', 'New York', 'Texas', 'Washington', 'Florida', 'Illinois', 'Massachusetts'],
  },
  {
    code: 'AE',
    name: 'United Arab Emirates',
    nativeName: 'الإمارات',
    flag: '🇦🇪',
    defaultLanguage: 'ar',
    defaultCurrency: 'AED',
    defaultTimezone: 'Asia/Dubai',
    regions: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman'],
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    nativeName: 'United Kingdom',
    flag: '🇬🇧',
    defaultLanguage: 'en',
    defaultCurrency: 'GBP',
    defaultTimezone: 'Europe/London',
    regions: ['Greater London', 'Scotland', 'North West', 'West Midlands'],
  },
  {
    code: 'SG',
    name: 'Singapore',
    nativeName: 'Singapore',
    flag: '🇸🇬',
    defaultLanguage: 'en',
    defaultCurrency: 'SGD',
    defaultTimezone: 'Asia/Singapore',
    regions: ['Central', 'East', 'North', 'West'],
  },
  {
    code: 'DE',
    name: 'Germany',
    nativeName: 'Deutschland',
    flag: '🇩🇪',
    defaultLanguage: 'de',
    defaultCurrency: 'EUR',
    defaultTimezone: 'Europe/Berlin',
    regions: ['Bavaria', 'Berlin', 'North Rhine-Westphalia', 'Baden-Württemberg', 'Hesse'],
  },
  {
    code: 'FR',
    name: 'France',
    nativeName: 'France',
    flag: '🇫🇷',
    defaultLanguage: 'fr',
    defaultCurrency: 'EUR',
    defaultTimezone: 'Europe/Paris',
    regions: ['Île-de-France', 'Auvergne-Rhône-Alpes', 'Provence-Alpes-Côte d\'Azur'],
  },
  {
    code: 'AU',
    name: 'Australia',
    nativeName: 'Australia',
    flag: '🇦🇺',
    defaultLanguage: 'en',
    defaultCurrency: 'AUD',
    defaultTimezone: 'Australia/Sydney',
    regions: ['New South Wales', 'Victoria', 'Queensland', 'Western Australia'],
  },
  {
    code: 'CA',
    name: 'Canada',
    nativeName: 'Canada',
    flag: '🇨🇦',
    defaultLanguage: 'en',
    defaultCurrency: 'CAD',
    defaultTimezone: 'America/Toronto',
    regions: ['Ontario', 'British Columbia', 'Quebec', 'Alberta'],
  },
];

export const SUPPORTED_TIMEZONES = [
  'Asia/Kolkata',
  'Asia/Dubai',
  'Asia/Singapore',
  'Asia/Tokyo',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'America/New_York',
  'America/Chicago',
  'America/Los_Angeles',
  'America/Toronto',
  'Australia/Sydney',
  'UTC',
];

/**
 * Format currency amount cleanly
 */
export function formatCurrency(
  amount: number,
  currencyCode = 'INR',
  locale = 'en-IN'
): string {
  const config = SUPPORTED_CURRENCIES[currencyCode] || SUPPORTED_CURRENCIES.INR;
  const numFormatted = amount.toLocaleString(locale, {
    minimumFractionDigits: config.decimalPlaces > 0 ? 0 : 0,
    maximumFractionDigits: config.decimalPlaces,
  });

  if (config.symbolPosition === 'suffix') {
    return `${numFormatted} ${config.symbol}`;
  }
  return `${config.symbol}${numFormatted}`;
}

/**
 * Timezone-aware date formatting
 */
export function formatDate(
  dateInput: string | Date | number,
  formatStyle: 'full' | 'date' | 'time' | 'short' = 'date',
  timezone = 'Asia/Kolkata',
  locale = 'en-IN'
): string {
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return '';

    const options: Intl.DateTimeFormatOptions = {
      timeZone: timezone,
    };

    if (formatStyle === 'full') {
      options.year = 'numeric';
      options.month = 'short';
      options.day = 'numeric';
      options.hour = '2-digit';
      options.minute = '2-digit';
    } else if (formatStyle === 'date') {
      options.year = 'numeric';
      options.month = 'short';
      options.day = 'numeric';
    } else if (formatStyle === 'time') {
      options.hour = '2-digit';
      options.minute = '2-digit';
    } else if (formatStyle === 'short') {
      options.month = 'numeric';
      options.day = 'numeric';
    }

    return new Intl.DateTimeFormat(locale, options).format(d);
  } catch (err) {
    // Fallback if Intl format fails
    const d = new Date(dateInput);
    return d.toLocaleDateString();
  }
}

/**
 * Formats relative time (e.g., '10 mins ago', '2 hours ago')
 */
export function formatRelativeTime(
  dateInput: string | Date | number,
  lang: SupportedLanguageCode = 'en'
): string {
  const date = new Date(dateInput);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return lang === 'ta' ? 'இப்போதுதான்' : lang === 'hi' ? 'अभी-अभी' : lang === 'te' ? 'ఇప్పుడే' : lang === 'es' ? 'Ahora' : lang === 'ar' ? 'الآن' : 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

/**
 * Formats a localized number
 */
export function formatNumber(value: number, locale = 'en-IN'): string {
  return value.toLocaleString(locale);
}
