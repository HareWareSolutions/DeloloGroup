import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const Contact: React.FC = () => {
    const { t, language } = useLanguage();

    return (
        <div className="container section">
            <h1>{t('nav.contact')}</h1>
            <p>
                {language === 'pt'
                    ? 'Entre em contato conosco.'
                    : 'Get in touch with us.'}
            </p>
        </div>
    );
};
export default Contact;
