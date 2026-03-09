// D:\SM-WEB\FEMTECH-AFRICA\Femtech-mobile\src\store\LanguageContext.tsx

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { translations, languages, defaultLanguage, supportedLanguages } from '../../packages/localization';

type LanguageCode = 'en' | 'fr' | 'sw' | 'zu';

interface LanguageContextType {
  language: LanguageCode;
  languages: typeof languages;
  t: (key: string) => string;
  setLanguage: (code: LanguageCode) => Promise<void>;
  getCurrentLanguage: () => typeof languages[0] | undefined;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>(defaultLanguage as LanguageCode);

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLang = await SecureStore.getItemAsync('app_language');
      if (savedLang && supportedLanguages.includes(savedLang)) {
        setLanguageState(savedLang as LanguageCode);
      }
    } catch (error) {
      console.log('Error loading language:', error);
    }
  };

  const setLanguage = async (code: LanguageCode) => {
    if (!supportedLanguages.includes(code)) return;
    
    setLanguageState(code);
    await SecureStore.setItemAsync('app_language', code);
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
            return key; // Return key if not found
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
    <LanguageContext.Provider value={{
      language,
      languages,
      t,
      setLanguage,
      getCurrentLanguage,
    }}>
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
