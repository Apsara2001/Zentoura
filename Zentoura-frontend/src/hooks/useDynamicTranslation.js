import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useLanguage } from '../context/LanguageContext';

export const useDynamicTranslation = (text) => {
    const { language } = useLanguage();
    const [translatedText, setTranslatedText] = useState(text);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const translate = async () => {
            if (!text || language === 'en') {
                setTranslatedText(text);
                return;
            }

            try {
                setLoading(true);
                const response = await axios.post('/translate', {
                    text,
                    targetLang: language
                });
                setTranslatedText(response.data.translatedText);
            } catch (error) {
                console.error('Translation error:', error);
                setTranslatedText(text); // Fallback to original
            } finally {
                setLoading(false);
            }
        };

        translate();
    }, [text, language]);

    return { translatedText, loading };
};
