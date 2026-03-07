import en from './translations/en.json';
import fr from './translations/fr.json';
import sw from './translations/sw.json';
import zu from './translations/zu.json';

export const translations = {
  en,
  fr,
  sw,
  zu,
};

export const languages = [
  { code: 'en', name: 'English', native: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'French', native: 'Français', flag: '🇫🇷' },
  { code: 'sw', name: 'Swahili', native: 'Kiswahili', flag: '🇰🇪' },
  { code: 'zu', name: 'Zulu', native: 'isiZulu', flag: '🇿🇦' },
];

export const defaultLanguage = 'en';
export const supportedLanguages = ['en', 'fr', 'sw', 'zu'];

export { en, fr, sw, zu };
