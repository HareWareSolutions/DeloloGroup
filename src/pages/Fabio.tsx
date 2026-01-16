import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const Fabio: React.FC = () => {
    const { t, language } = useLanguage();

    return (
        <div className="container section">
            <h1>{t('nav.fabio')}</h1>
            <p>
                {language === 'pt'
                    ? 'Informações sobre o Prof. Fábio Delolo.'
                    : 'Information about Prof. Fábio Delolo.'}
            </p>
        </div>
    );
};
export default Fabio;
