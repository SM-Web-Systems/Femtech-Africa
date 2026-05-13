'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import en from './translations/en.json';
import fr from './translations/fr.json';
import sw from './translations/sw.json';
import zu from './translations/zu.json';

export type LanguageCode = 'en' | 'fr' | 'sw' | 'zu';

const translations: Record<LanguageCode, any> = { en, fr, sw, zu };

export const languages = [
  { code: 'en' as LanguageCode, name: 'English', native: 'English', flag: '🇬🇧' },
  { code: 'fr' as LanguageCode, name: 'French', native: 'Français', flag: '🇫🇷' },
  { code: 'sw' as LanguageCode, name: 'Swahili', native: 'Kiswahili', flag: '🇰🇪' },
  { code: 'zu' as LanguageCode, name: 'Zulu', native: 'isiZulu', flag: '🇿🇦' },
];

interface LanguageContextType {
  language: LanguageCode;
  languages: typeof languages;
  t: (key: string) => string;
  setLanguage: (code: LanguageCode) => void;
  getCurrentLanguage: () => typeof languages[0] | undefined;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>('en');

  useEffect(() => {
    const saved = localStorage.getItem('app_language');
    if (saved && ['en', 'fr', 'sw', 'zu'].includes(saved)) {
      setLanguageState(saved as LanguageCode);
    }
  }, []);

  const setLanguage = (code: LanguageCode) => {
    if (!['en', 'fr', 'sw', 'zu'].includes(code)) return;
    setLanguageState(code);
    localStorage.setItem('app_language', code);
  };

  const t = useCallback((key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to English
        value = translations.en;
        for (const fallbackKey of keys) {
          if (value && typeof value === 'object' && fallbackKey in value) {
            value = value[fallbackKey];
          } else {
            return key;
          }
        }
        break;
      }
    }

    return typeof value === 'string' ? value : key;
  }, [language]);

  const getCurrentLanguage = () => {
    return languages.find(l => l.code === language);
  };

  return (
    <LanguageContext.Provider value={{ language, languages, t, setLanguage, getCurrentLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
