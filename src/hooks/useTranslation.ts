import { useState, useEffect } from 'react';

type Language = 'EN' | 'HI' | 'TE';

const translations = {
  EN: {
    home: 'Home',
    properties: 'Properties',
    marketplace: 'Marketplace',
    valuator: 'AI Valuator',
    about: 'About',
    exchange: '1031 Exchange',
    blog: 'Blog',
    knowledge: 'Knowledge',
    sell: 'Sell Property',
    contact: 'Contact',
    signIn: 'Sign In',
    dashboard: 'Dashboard',
    signOut: 'Sign Out'
  },
  HI: {
    home: 'होम',
    properties: 'संपत्तियां',
    marketplace: 'मार्केटप्लेस',
    valuator: 'एआई वैल्यूएटर',
    about: 'हमारे बारे में',
    exchange: '1031 एक्सचेंज',
    blog: 'ब्लॉग',
    knowledge: 'ज्ञान केंद्र',
    sell: 'संपत्ति बेचें',
    contact: 'संपर्क करें',
    signIn: 'साइन इन',
    dashboard: 'डैशबोर्ड',
    signOut: 'साइन आउट'
  },
  TE: {
    home: 'హోమ్',
    properties: 'ఆస్తులు',
    marketplace: 'మార్కెట్‌ప్లేస్',
    valuator: 'AI వాల్యుయేటర్',
    about: 'గురించి',
    exchange: '1031 ఎక్స్ఛేంజ్',
    blog: 'బ్లాగ్',
    knowledge: 'జ్ఞాన కేంద్రం',
    sell: 'ఆస్తిని అమ్మండి',
    contact: 'సంప్రదించండి',
    signIn: 'సైన్ ఇన్',
    dashboard: 'డ్యాష్‌బోర్డ్',
    signOut: 'సైన్ అవుట్'
  }
};

export const useTranslation = () => {
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem('igo_lang') as Language) || 'EN';
  });

  const t = (key: keyof typeof translations['EN']) => {
    return translations[lang][key] || translations['EN'][key];
  };

  const changeLanguage = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('igo_lang', newLang);
  };

  return { t, lang, changeLanguage };
};
