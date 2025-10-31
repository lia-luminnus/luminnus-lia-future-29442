import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'pt' | 'en' | 'es';

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  pt: {
    nav_inicio: "Início",
    nav_solucoes: "Soluções",
    nav_planos: "Planos",
    nav_parceiros: "Parceiros",
    nav_contato: "Contato",
    btn_login: "Login",
    btn_whatsapp: "💬 Fale com a Lia",
  },
  en: {
    nav_inicio: "Home",
    nav_solucoes: "Solutions",
    nav_planos: "Plans",
    nav_parceiros: "Partners",
    nav_contato: "Contact",
    btn_login: "Login",
    btn_whatsapp: "💬 Chat with Lia",
  },
  es: {
    nav_inicio: "Inicio",
    nav_solucoes: "Soluciones",
    nav_planos: "Planes",
    nav_parceiros: "Socios",
    nav_contato: "Contacto",
    btn_login: "Login",
    btn_whatsapp: "💬 Habla con Lia",
  },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('luminnus_lang') as Language;
    return saved && ['pt', 'en', 'es'].includes(saved) ? saved : 'pt';
  });

  useEffect(() => {
    localStorage.setItem('luminnus_lang', currentLanguage);
    document.documentElement.setAttribute('lang', 
      currentLanguage === 'pt' ? 'pt-BR' : currentLanguage === 'en' ? 'en-US' : 'es-ES'
    );
  }, [currentLanguage]);

  const setLanguage = (lang: Language) => {
    setCurrentLanguage(lang);
  };

  const t = (key: string): string => {
    return translations[currentLanguage][key as keyof typeof translations.pt] || key;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
