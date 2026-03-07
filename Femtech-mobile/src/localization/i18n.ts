import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { translations, languages, defaultLanguage, supportedLanguages } from '@femtech/localization';

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
    
    const deviceLocale = Localization.locale.split('-')[0];
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
export { languages, supportedLanguages };
export default i18n;
