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
                        {language === 'pt' ? 'Valores Fundamentais' : 'Core Values'}
                    </h1>
                    <p className={styles.headerSubtitle}>
                        {language === 'pt'
                            ? 'Ciência de excelência através da diversidade, respeito e colaboração.'
                            : 'Excellence in science through diversity, respect, and collaboration.'}
                    </p>
                </div>
            </section>

            <div className="container">
                {/* Intro Block: People, Inclusivity & Research Environment */}
                <div className={styles.fullWidthCard} style={{ marginBottom: '4rem' }}>
                    <div className={styles.fullWidthContent}>
                        <h2 className={styles.cardTitle}>
                            {language === 'pt' ? 'Pessoas, Inclusão & Ambiente de Pesquisa' : 'People, Inclusivity & Research Environment'}
                        </h2>
                        <p className={styles.cardText}>
                            {language === 'pt'
                                ? 'O Grupo de Pesquisa Delolo está comprometido com a construção de um ambiente de pesquisa inclusivo, respeitoso, seguro e colaborativo, no qual todos os membros possam se desenvolver plenamente. Valorizamos a diversidade em seu sentido mais amplo — abrangendo formação científica, cultura, gênero, etnia, status socioeconômico e experiências de vida — e reconhecemos que perspectivas diversas são fundamentais para a criatividade, o pensamento crítico e a excelência científica. Promovemos oportunidades iguais e mantemos tolerância zero a qualquer forma de discriminação ou assédio, acreditando que uma atmosfera positiva, ética e acolhedora é essencial para o bem-estar individual e para o sucesso coletivo dentro e fora da academia.'
                                : 'The Delolo Research Group is committed to building an inclusive, respectful, safe, and collaborative research environment where all members can full develop. We value diversity in its broadest sense—encompassing scientific background, culture, gender, ethnicity, socioeconomic status, and life experiences—and recognize that diverse perspectives are fundamental to creativity, critical thinking, and scientific excellence. We promote equal opportunities and maintain zero tolerance for any form of discrimination or harassment, believing that a positive, ethical, and welcoming atmosphere is essential for individual well-being and collective success both within and outside academia.'}
                        </p>
                    </div>
                    <div className={styles.visualSide}>
                        <img src="/images/values/collaboration.png" alt="Collaboration Sketch" className={styles.sketchImage} />
                    </div>
                </div>

                {/* Grid for other values */}
                <div className={styles.grid}>
                    {/* Card 2: Student Centered */}
                    <div className={styles.valueCard}>
                        <h3 className={styles.cardTitle}>
                            {language === 'pt' ? 'Formação Centrada no Estudante' : 'Student-Centered Training'}
                        </h3>
                        <p className={styles.cardText}>
                            {language === 'pt'
                                ? 'Os estudantes estão no centro da missão do grupo. Entendemos que pesquisa de alta qualidade é inseparável de um ambiente saudável e solidário. Nosso objetivo é formar cientistas críticos e independentes, respeitando a individualidade, os diferentes ritmos de aprendizado e as trajetórias pessoais, ao mesmo tempo em que estimulamos autonomia, responsabilidade e integridade científica.'
                                : 'Students are at the core of the group\'s mission. We understand that high-quality research is inseparable from a healthy and supportive environment. Our goal is to train critical and independent scientists, respecting individuality, different learning paces, and personal trajectories, while encouraging autonomy, responsibility, and scientific integrity.'}
                        </p>
                    </div>

                    {/* Card 3: Respect & Communication */}
                    <div className={styles.valueCard}>
                        <h3 className={styles.cardTitle}>
                            {language === 'pt' ? 'Respeito, Comunicação & Colaboração' : 'Respect, Communication & Collaboration'}
                        </h3>
                        <p className={styles.cardText}>
                            {language === 'pt'
                                ? 'O grupo é guiado pelo respeito mútuo, comunicação aberta e responsabilidade compartilhada. Incentivamos perguntas, o debate construtivo e o questionamento respeitoso de ideias, promovendo a participação ativa de todos na condução de suas pesquisas e na construção coletiva da direção científica do grupo.'
                                : 'The group is guided by mutual respect, open communication, and shared responsibility. We encourage questions, constructive debate, and respectful questioning of ideas, promoting active participation from everyone in conducting their research and collectively building the group\'s scientific direction.'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Values;
