import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type Language = 'en' | 'hi' | 'ta' | 'te' | 'kn' | 'mr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  languages: { code: Language; name: string }[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('igo-lang', lang);
    document.documentElement.lang = lang;
    
    // Set Google Translate cookie
    if (lang === 'en') {
      document.cookie = "googtrans=/en/en; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = `googtrans=/en/en; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=${window.location.hostname}; path=/;`;
    } else {
      document.cookie = `googtrans=/en/${lang}; path=/;`;
      document.cookie = `googtrans=/en/${lang}; domain=${window.location.hostname}; path=/;`;
    }
    
    window.location.reload();
  };

  useEffect(() => {
    // Read from cookie first if exists
    const match = document.cookie.match(/googtrans=\/en\/([a-z]{2})/);
    let currentLang = 'en' as Language;
    
    if (match && match[1]) {
      currentLang = match[1] as Language;
    } else {
      const saved = localStorage.getItem('igo-lang') as Language;
      if (saved) currentLang = saved;
    }
    
    setLanguageState(currentLang);
    document.documentElement.lang = currentLang;
  }, []);

  const languages: { code: Language; name: string }[] = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिन्दी' },
    { code: 'ta', name: 'தமிழ்' },
    { code: 'te', name: 'తెలుగు' },
    { code: 'kn', name: 'ಕನ್ನಡ' },
    { code: 'mr', name: 'मराठी' },
  ];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, languages }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
