import { translations, languages, defaultLanguage, supportedLanguages } from '@femtech/localization';

type TranslationKeys = typeof translations.en;

let currentLanguage = defaultLanguage;

const getNestedValue = (obj: any, path: string): string => {
  return path.split('.').reduce((acc, part) => acc?.[part], obj) || path;
};

export const t = (key: string, params?: Record<string, string | number>): string => {
  let text = getNestedValue(translations[currentLanguage as keyof typeof translations], key);
  
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      text = text.replace(new RegExp(`{{${k}}}`, 'g'), String(v));
    });
  }
  
  return text;
};

export const setLanguage = (lang: string): void => {
  if (supportedLanguages.includes(lang)) {
    currentLanguage = lang;
    if (typeof window !== 'undefined') {
      localStorage.setItem('femtech_language', lang);
    }
  }
};

export const initLanguage = (): string => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('femtech_language');
    if (saved && supportedLanguages.includes(saved)) {
      currentLanguage = saved;
      return saved;
    }
    
    const browserLang = navigator.language.split('-')[0];
    if (supportedLanguages.includes(browserLang)) {
      currentLanguage = browserLang;
      return browserLang;
    }
  }
  return defaultLanguage;
};

export const getCurrentLanguage = (): string => currentLanguage;
export { languages, supportedLanguages, translations };
