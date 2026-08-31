import { createContext, useContext, useState, useEffect } from 'react';
import i18n from '../i18n';

const LanguageContext = createContext(null);

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};

export const LANGUAGES = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'si', name: 'Sinhala', flag: '🇱🇰' },
    { code: 'ta', name: 'Tamil', flag: '🇱🇰' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' }
];

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('en');

    useEffect(() => {
        const storedLang = localStorage.getItem('language');
        if (storedLang) {
            setLanguage(storedLang);
        }
    }, []);

    const changeLanguage = (langCode) => {
        setLanguage(langCode);
        i18n.changeLanguage(langCode);
        localStorage.setItem('language', langCode);
        window.dispatchEvent(new Event('languageChange'));
    };

    return (
        <LanguageContext.Provider value={{ language, changeLanguage, languages: LANGUAGES }}>
            {children}
        </LanguageContext.Provider>
    );
};
