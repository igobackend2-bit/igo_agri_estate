import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'hi' | 'ta' | 'te' | 'kn' | 'mr';
type Translations = Record<string, Record<Language, string>>;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  languages: { code: Language; name: string }[];
}

const translations: Translations = {
  'nav.buy_land': { en: 'Buy Land', hi: 'Zamin Kharid', ta: 'Nilai Viththu', te: 'Bhoomi Krayam', kn: 'Bhoomi Khesari', mr: 'Zamin Ghene' },
  'nav.seller_hub': { en: 'Seller Hub', hi: 'Vikreta Kendr', ta: 'Vikrethar Kural', te: 'Vikretalu Kendram', kn: 'Vikretara Kendra', mr: 'Vikrethe Kendra' },
  'nav.about': { en: 'About', hi: 'Hamar Baare', ta: 'Paarbu', te: 'Grama', kn: 'Baare', mr: 'Nivad' },
  'nav.contact': { en: 'Contact', hi: 'Sampark', ta: 'Thodarku', te: 'Samparka', kn: 'Samparka', mr: 'Sampark' },
  'nav.post_property': { en: 'Post Property', hi: 'Sampatti Dahij Karein', ta: 'Sampaththai Post Sei', te: 'Property Post Cheyyi', kn: 'Property Postresi', mr: 'Moolya Dakhol' },
  'nav.login': { en: 'Login/Register', hi: 'Pravesh/Daftar', ta: 'Seivathu/Register', te: 'Login/Register', kn: 'Login/Register', mr: 'Login/Register' },
  'hero.welcome': { en: 'Welcome to IGO Agri Estates', hi: 'IGO Krishi Estates Mein Aapka Swagat Hai', ta: 'IGO Krishi Estates Varum', te: 'IGO Krishi Estates Meediki Swagatham', kn: 'IGO Krishi Estatesge Swaagatha', mr: 'IGO Shetkar estates Madhe Aagaman' },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('igo-lang', lang);
    document.documentElement.lang = lang;
  };

  // Load saved language
  React.useEffect(() => {
    const saved = localStorage.getItem('igo-lang') as Language;
    if (saved) setLanguageState(saved);
  }, []);

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  const languages: { code: Language; name: string }[] = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिन्दी' },
    { code: 'ta', name: 'தமிழ்' },
    { code: 'te', name: 'తెలుగు' },
    { code: 'kn', name: 'ಕನ್ನಡ' },
    { code: 'mr', name: 'मराठी' },
  ];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languages }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
