import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const Values: React.FC = () => {
    const { t, language } = useLanguage();

    return (
        <div className="container section">
            <h1>{t('nav.values')}</h1>
            <p>
                {language === 'pt'
                    ? 'Nossos valores fundamentais e missão.'
                    : 'Our core values and mission.'}
            </p>
        </div>
    );
};
export default Values;
