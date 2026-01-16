import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const Research: React.FC = () => {
    const { t, language } = useLanguage();

    return (
        <div className="container section">
            <h1>{t('nav.research')}</h1>
            <p>
                {language === 'pt'
                    ? 'Conteúdo sobre as linhas de pesquisa será disponibilizado em breve.'
                    : 'Content regarding research lines will be available soon.'}
            </p>
        </div>
    );
};
export default Research;
