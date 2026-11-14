import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

type Language = 'en' | 'pt';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Simple dictionary for demo
const translations: Record<string, Record<Language, string>> = {
    'nav.home': { en: 'Home', pt: 'Início' },
    'nav.research': { en: 'Research', pt: 'Pesquisa' },
    'nav.publications': { en: 'Publications', pt: 'Publicações' },
    'nav.values': { en: 'Values', pt: 'Valores' },
    'nav.members': { en: 'Members', pt: 'Membros' },
    'nav.fabio': { en: 'Fábio G. Delolo', pt: 'Fábio G. Delolo' },
    'nav.news': { en: 'News', pt: 'Notícias' },
    'nav.contact': { en: 'Contact', pt: 'Contato' },
    'hero.title': { en: 'Advancing Chemistry for a Sustainable Future', pt: 'Avançando a Química para um Futuro Sustentável' },

    // Footer translations
    'footer.transforming': { en: 'Transforming scientific knowledge into sustainable innovation.', pt: 'Transformando conhecimento científico em inovação sustentável.' },
    'footer.focus': { en: 'Focus on catalysis and green chemistry.', pt: 'Foco em catálise e química verde.' },
    'footer.navigation': { en: 'Navigation', pt: 'Navegação' },
    'footer.contact': { en: 'Contact', pt: 'Contato' },
    'footer.connect': { en: 'Connect', pt: 'Conecte-se' },
    'footer.address': { en: 'Chemistry Dept., ICE, UFJF', pt: 'Dept. de Química, ICE, UFJF' },
    'footer.campus': { en: 'University Campus', pt: 'Campus Universitário' },
    'footer.rights': { en: 'All rights reserved.', pt: 'Todos os direitos reservados.' },
    'footer.developed': { en: 'Developed by', pt: 'Desenvolvido por' },
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLanguageState] = useState<Language>('en');

    useEffect(() => {
        const savedLang = localStorage.getItem('language') as Language;
        if (savedLang) {
            setLanguageState(savedLang);
        }
    }, []);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('language', lang);
    };

    const t = (key: string) => {
        if (!translations[key]) return key;
        return translations[key][language] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
