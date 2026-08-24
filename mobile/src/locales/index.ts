import en from './en.json';
import ta from './ta.json';
import hi from './hi.json';
import te from './te.json';
import es from './es.json';
import fr from './fr.json';
import de from './de.json';
import ar from './ar.json';

export type SupportedLanguageCode = 'en' | 'ta' | 'hi' | 'te' | 'es' | 'fr' | 'de' | 'ar';

export interface LanguageMeta {
  code: SupportedLanguageCode;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
  flag: string;
}

export const LANGUAGES: Record<SupportedLanguageCode, LanguageMeta> = {
  en: { code: 'en', name: 'English', nativeName: 'English', direction: 'ltr', flag: '🇺🇸' },
  ta: { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', direction: 'ltr', flag: '🇮🇳' },
  hi: { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', direction: 'ltr', flag: '🇮🇳' },
  te: { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', direction: 'ltr', flag: '🇮🇳' },
  es: { code: 'es', name: 'Spanish', nativeName: 'Español', direction: 'ltr', flag: '🇪🇸' },
  fr: { code: 'fr', name: 'French', nativeName: 'Français', direction: 'ltr', flag: '🇫🇷' },
  de: { code: 'de', name: 'German', nativeName: 'Deutsch', direction: 'ltr', flag: '🇩🇪' },
  ar: { code: 'ar', name: 'Arabic', nativeName: 'العربية', direction: 'rtl', flag: '🇦🇪' },
};

export const dictionaries: Record<SupportedLanguageCode, any> = {
  en,
  ta,
  hi,
  te,
  es,
  fr,
  de,
  ar,
};

/**
 * Resolves a dotted key path (e.g. 'settings.title' or 'common.save')
 * Falls back to English dictionary if the key is missing in the chosen language.
 */
export function getTranslation(
  lang: SupportedLanguageCode,
  key: string,
  params?: Record<string, string | number>
): string {
  const dict = dictionaries[lang] || en;
  const fallbackDict = en;

  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), obj);
  };

  let value = getNestedValue(dict, key);
  if (value === undefined) {
    value = getNestedValue(fallbackDict, key);
  }

  if (typeof value !== 'string') {
    return key; // return key if not found
  }

  if (params) {
    Object.keys(params).forEach((paramKey) => {
      value = value.replace(new RegExp(`{{${paramKey}}}`, 'g'), String(params[paramKey]));
    });
  }

  return value;
}
