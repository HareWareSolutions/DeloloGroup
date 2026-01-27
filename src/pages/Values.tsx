import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import styles from './Values.module.css';

const Values: React.FC = () => {
    const { language } = useLanguage();

    return (
        <div className={styles.valuesPage}>
            {/* Header */}
            <section className={styles.header}>
                <div className="container">
                    <h1 className={styles.headerTitle}>
                        {language === 'pt' ? 'Valores Fundamentais e Missão' : 'Core Values and Mission'}
                    </h1>
                    <p className={styles.headerSubtitle}>
                        {language === 'pt'
                            ? 'Ciência de excelência através da diversidade, respeito e colaboração.'
                            : 'Excellence in science through diversity, respect, and collaboration.'}
                    </p>
                </div>
            </section>

            <div className="container">
                {/* Intro Block: Inclusivity & Diversity */}
                <div className={styles.fullWidthCard} style={{ marginBottom: '4rem' }}>
                    <div className={styles.fullWidthContent}>
                        <h2 className={styles.cardTitle}>
                            {language === 'pt' ? 'Inclusão & Diversidade' : 'Inclusivity & Diversity'}
                        </h2>
                        <p className={styles.cardText}>
                            {language === 'pt'
                                ? 'O Grupo de Pesquisa Delolo está comprometido em promover um ambiente de pesquisa inclusivo, respeitoso e colaborativo, onde todos os membros possam prosperar. Valorizamos a diversidade em seu sentido mais amplo—incluindo formação científica, cultura, gênero, etnia, status socioeconômico e experiência de vida—e reconhecemos que diferentes perspectivas são essenciais para a criatividade, pensamento crítico e excelência científica.'
                                : 'The Delolo Research Group is committed to fostering an inclusive, respectful, and collaborative research environment where all members can thrive. We value diversity in its broadest sense—including scientific background, culture, gender, ethnicity, socioeconomic status, and life experience—and recognize that different perspectives are essential for creativity, critical thinking, and scientific excellence.'}
                        </p>
                    </div>
                    <div className={styles.visualSide}>
                        <img src="/images/values/collaboration.png" alt="Collaboration Sketch" className={styles.sketchImage} />
                    </div>
                </div>

                {/* Grid for other values */}
                <div className={styles.grid}>
                    {/* Card 1: Student Centered */}
                    <div className={styles.valueCard}>
                        <h3 className={styles.cardTitle}>
                            {language === 'pt' ? 'Missão Centrada no Estudante' : 'Student-Centered Mission'}
                        </h3>
                        <p className={styles.cardText}>
                            {language === 'pt'
                                ? 'Os estudantes estão no centro da nossa missão. Acreditamos que pesquisa de alta qualidade é inseparável de um ambiente saudável, solidário e acolhedor. Nosso objetivo é formar cientistas independentes, respeitando a individualidade, os diversos caminhos de aprendizado e as trajetórias pessoais.'
                                : 'Students are at the center of our mission. We believe that high-quality research is inseparable from a healthy, supportive, and welcoming environment. Our goal is to train independent scientists while respecting individuality, diverse learning paths, and personal trajectories.'}
                        </p>
                    </div>

                    {/* Card 2: Respect & Communication */}
                    <div className={styles.valueCard}>
                        <h3 className={styles.cardTitle}>
                            {language === 'pt' ? 'Respeito & Comunicação' : 'Respect & Communication'}
                        </h3>
                        <p className={styles.cardText}>
                            {language === 'pt'
                                ? 'O grupo é construído sobre o respeito mútuo, comunicação aberta e responsabilidade compartilhada. Os membros são encorajados a fazer perguntas, desafiar ideias respeitosamente e participar ativamente na formação de suas próprias pesquisas e na direção científica do grupo.'
                                : 'The group is built on mutual respect, open communication, and shared responsibility. Members are encouraged to ask questions, challenge ideas respectfully, and actively participate in shaping both their own research and the scientific direction of the group.'}
                        </p>
                    </div>

                    {/* Card 3: Equal Opportunities - Full Width Bottom specific style or just in grid */}
                    <div className={`${styles.valueCard} ${styles.fullWidthCard}`} style={{ gridColumn: '1 / -1', background: 'white', borderLeft: 'none', borderTop: '5px solid var(--color-primary)' }}>
                        <div>
                            <h3 className={styles.cardTitle}>
                                {language === 'pt' ? 'Oportunidades Iguais & Atmosfera Positiva' : 'Equal Opportunities & Positive Atmosphere'}
                            </h3>
                            <p className={styles.cardText}>
                                {language === 'pt'
                                    ? 'Estamos comprometidos em oferecer oportunidades iguais e manter um espaço livre de qualquer tipo de discriminação ou assédio. Espera-se que cada membro do grupo contribua para uma atmosfera positiva e inclusiva, onde o feedback construtivo, a integridade científica e a colaboração guiem as interações diárias e o sucesso a longo prazo, tanto dentro quanto fora da academia.'
                                    : 'We are committed to providing equal opportunities and to maintaining a space free from discrimination or harassment of any kind. Every group member is expected to contribute to a positive and inclusive atmosphere, where constructive feedback, scientific integrity, and collaboration guide daily interactions and long-term success, both inside and outside academia.'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Values;
