// lib/store/language.store.ts
'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Language = 'en' | 'fr' | 'sw' | 'am';

interface LanguageStore {
  language: Language;
  setLanguage: (language: Language) => void;
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set) => ({
      language: 'en' as Language,
      setLanguage: (language) => set({ language }),
    }),
    {
      name: 'language-store',
    }
  )
);
