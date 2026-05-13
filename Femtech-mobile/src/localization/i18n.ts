import { I18n } from 'i18n-js';
import { getLocales } from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import translations directly
import en from '../../packages/localization/translations/en.json';
import fr from '../../packages/localization/translations/fr.json';
import sw from '../../packages/localization/translations/sw.json';
import zu from '../../packages/localization/translations/zu.json';

const translations = { en, fr, sw, zu };

export const languages = [
  { code: 'en', name: 'English', native: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'French', native: 'Français', flag: '🇫🇷' },
  { code: 'sw', name: 'Swahili', native: 'Kiswahili', flag: '🇰🇪' },
  { code: 'zu', name: 'Zulu', native: 'isiZulu', flag: '🇿🇦' },
];

export const defaultLanguage = 'en';
export const supportedLanguages = ['en', 'fr', 'sw', 'zu'];

const i18n = new I18n(translations);

i18n.defaultLocale = defaultLanguage;
i18n.locale = defaultLanguage;
i18n.enableFallback = true;

const LANGUAGE_KEY = '@femtech_language';

export const initializeLanguage = async (): Promise<string> => {
  try {
    const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
    if (savedLanguage && supportedLanguages.includes(savedLanguage)) {
      i18n.locale = savedLanguage;
      return savedLanguage;
    }
    
    const locales = getLocales();
    const deviceLocale = locales[0]?.languageCode || defaultLanguage;
    const language = supportedLanguages.includes(deviceLocale) ? deviceLocale : defaultLanguage;
    i18n.locale = language;
    return language;
  } catch {
    return defaultLanguage;
  }
};

export const setLanguage = async (language: string): Promise<void> => {
  if (supportedLanguages.includes(language)) {
    i18n.locale = language;
    await AsyncStorage.setItem(LANGUAGE_KEY, language);
  }
};

export const getCurrentLanguage = (): string => i18n.locale;
export default i18n;
