import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import styles from './Fabio.module.css';
import { GraduationCap, Award, Briefcase, Globe, Star, Zap } from 'lucide-react';

const Fabio: React.FC = () => {
    const { language } = useLanguage();

    // Data Structures
    const education = [
        {
            year: '2022',
            degree_pt: 'Doutorado em Ciências - Química',
            degree_en: 'Ph.D. in Science - Chemistry',
            institution: 'Universidade Federal de Minas Gerais (UFMG)',
            details_pt: 'Orientação: Profa. Dra. Elena Vitalievna Goussevskaia. Coorientação: Prof. Dr. Eduardo Nicolau dos Santos.',
            details_en: 'Advisor: Prof. Dr. Elena Vitalievna Goussevskaia. Co-advisor: Prof. Dr. Eduardo Nicolau dos Santos.'
        },
        {
            year: '2020',
            degree_pt: 'MBA em Gestão de Negócios',
            degree_en: 'MBA in Business Management',
            institution: 'USP-ESALQ',
            details_pt: '',
            details_en: ''
        },
        {
            year: '2018',
            degree_pt: 'Mestre em Química Inorgânica',
            degree_en: 'M.Sc. in Inorganic Chemistry',
            institution: 'Universidade Federal de Minas Gerais (UFMG)',
            details_pt: '',
            details_en: ''
        },
        {
            year: '2016',
            degree_pt: 'Bacharel em Química',
            degree_en: 'B.Sc. in Chemistry',
            institution: 'Universidade Federal de São Carlos (UFSCar)',
            details_pt: '',
            details_en: ''
        }
    ];

    const experience = [
        {
            period: '2025 - Present',
            role_pt: 'Pesquisador de Pós-Doutorado (CAPES-PIPD)',
            role_en: 'Postdoctoral Researcher (CAPES-PIPD)',
            place: 'Universidade Federal de Minas Gerais (UFMG)'
        },
        {
            period: '2024 - 2025',
            role_pt: 'Professor Substituto',
            role_en: 'Substitute Professor',
            place: 'Departamento de Química - UFMG'
        },
        {
            period: '2022 - 2024', // Inferred from Committee dates or PhD overlap? Text says "Nesse período (doutorado)... bolsista PrInt". So PrInt was during PhD.
            role_pt: 'Pesquisador Visitante (Doutorado Sanduíche / CAPES-PrInt)',
            role_en: 'Visiting Researcher (Sandwich PhD)',
            place: 'Leibniz Institute for Catalysis (LIKAT), Rostock, Germany',
            details_pt: 'Supervisão: Prof. Dr. Matthias Beller.',
            details_en: 'Supervisor: Prof. Dr. Matthias Beller.'
        },
        {
            period: '2014 - 2015',
            role_pt: 'Bolsista Ciências sem Fronteiras (CsF)',
            role_en: 'Science Without Borders Fellow',
            place: 'University of Glasgow, UK',
            details_pt: 'Supervisão: Prof. Dr. Andrew Sutherland.',
            details_en: 'Supervisor: Prof. Dr. Andrew Sutherland.'
        },
        {
            period: '2011 - 2014',
            role_pt: 'Iniciação Científica',
            role_en: 'Undergraduate Researcher',
            place: 'UFSCar - Laboratório de Estrutura e Reatividade',
            details_pt: 'Supervisão: Prof. Dr. Alzir Azevedo Batista.',
            details_en: 'Supervisor: Prof. Dr. Alzir Azevedo Batista.'
        }
    ];

    const awards = [
        { title: '2025 CAS Future Leaders', org: 'CAS (Chemical Abstracts Service)', year: '2025' },
        { title_pt: 'Grande Prêmio UFMG de Teses', title_en: 'UFMG Grand Thesis Award', org: 'UFMG (Ciências Exatas e Engenharias)', year: '2023' },
        { title_pt: 'Prêmio CAPES de Teses', title_en: 'CAPES Thesis Award', org: 'CAPES', year: '2023' },
        { title_pt: 'Prêmio UFMG de Teses (Química)', title_en: 'UFMG Thesis Award (Chemistry)', org: 'UFMG', year: '2023' },
        { title_pt: 'Prêmio Victor Teixeira da Silva', title_en: 'Victor Teixeira da Silva Award', org: 'SBCat', year: '2021' },
        { title_pt: 'Prêmio Jovem Pesquisador', title_en: 'Young Researcher Award', org: 'RSC / JP-SBQ', year: '2021' }
    ];

    const recognitions = [
        {
            title_pt: 'Representante Brasileiro no 74th Lindau Nobel Laureate Meeting',
            title_en: 'Brazilian Representative at 74th Lindau Nobel Laureate Meeting',
            org: 'Academia Brasileira de Ciências (ABC)',
            icon: Globe
        },
        {
            title_pt: 'Programa CATALISA ICT',
            title_en: 'CATALISA ICT Program Selection',
            org: 'SEBRAE',
            desc_pt: 'Tecnologia selecionada para inovação no mercado.',
            desc_en: 'Technology selected for market innovation.',
            icon: Zap
        },
        {
            title_pt: 'Comitê de Jovens Pesquisadores (Network)',
            title_en: 'Young Researchers Committee (Network)',
            org: 'Sociedade Brasileira de Química (SBQ) 2022-2024',
            icon: Star
        }
    ];

    return (
        <div className="container section">
            {/* Hero */}
            <div className={styles.hero}>
                <img
                    src="http://localhost:3001/uploads/fabio.jpg"
                    onError={(e) => { e.currentTarget.src = "/placeholder-user.jpg"; }}
                    alt="Dr. Fábio G. Delolo"
                    className={styles.profileImage}
                />
                <div className={styles.heroContent}>
                    <h1 className={styles.name}>Fábio G. Delolo</h1>
                    <p className={styles.role}>
                        {language === 'pt' ? 'Pesquisador de Pós-Doutorado (CAPES-PIPD) | UFMG' : 'Postdoctoral Researcher (CAPES-PIPD) | UFMG'}
                    </p>
                    <p className={styles.intro}>
                        {language === 'pt'
                            ? 'Dedica-se a explorar aspectos sustentáveis para a valorização da matéria prima biorrenovável utilizando catalisadores homogêneos, heterogêneos e eletroquímica.'
                            : 'Dedicated to exploring sustainable aspects for the valorization of bio-renewable raw materials using homogeneous and heterogeneous catalysts and electrochemistry.'}
                    </p>
                </div>
            </div>

            {/* Main Grid */}
            <div className="row">
                {/* Left Column: Timeline */}
                <div style={{ flex: 2 }}>
                    <h2 className={styles.sectionTitle}>
                        <Briefcase size={24} />
                        {language === 'pt' ? 'Trajetória Profissional' : 'Professional Experience'}
                    </h2>
                    <div className={styles.timeline}>
                        {experience.map((item, idx) => (
                            <div key={idx} className={styles.timelineItem}>
                                <span className={styles.yearBadge}>{item.period}</span>
                                <div className={styles.itemTitle}>{language === 'pt' ? item.role_pt : item.role_en}</div>
                                <div className={styles.itemSubtitle}>{item.place}</div>
                                {(language === 'pt' ? item.details_pt : item.details_en) && (
                                    <div className={styles.itemDesc}>{language === 'pt' ? item.details_pt : item.details_en}</div>
                                )}
                            </div>
                        ))}
                    </div>

                    <h2 className={styles.sectionTitle}>
                        <GraduationCap size={24} />
                        {language === 'pt' ? 'Formação Acadêmica' : 'Education'}
                    </h2>
                    <div className={styles.grid}>
                        {education.map((edu, idx) => (
                            <div key={idx} className={styles.card}>
                                <div className={styles.yearBadge}>{edu.year}</div>
                                <div className={styles.itemTitle}>{language === 'pt' ? edu.degree_pt : edu.degree_en}</div>
                                <div className={styles.itemSubtitle}>{edu.institution}</div>
                                <div className={styles.itemDesc}>{language === 'pt' ? edu.details_pt : edu.details_en}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column: Awards & Honors */}
                <div style={{ flex: 1.5 }}>
                    <h2 className={styles.sectionTitle}>
                        <Award size={24} />
                        {language === 'pt' ? 'Prêmios e Distinções' : 'Awards & Honors'}
                    </h2>
                    <div className={styles.grid} style={{ gridTemplateColumns: '1fr' }}>
                        {awards.map((award, idx) => (
                            <div key={idx} className={`${styles.card} ${styles.awardCard}`}>
                                <div className={styles.iconBox}>
                                    <Award size={20} />
                                </div>
                                <div>
                                    <div className={styles.itemTitle}>{award.title || (language === 'pt' ? award.title_pt : award.title_en)}</div>
                                    <div className={styles.itemSubtitle}>{award.org} | {award.year}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <h2 className={styles.sectionTitle} style={{ marginTop: '2rem' }}>
                        <Star size={24} />
                        {language === 'pt' ? 'Reconhecimento e Liderança' : 'Recognition & Leadership'}
                    </h2>
                    <div className={styles.grid} style={{ gridTemplateColumns: '1fr' }}>
                        {recognitions.map((rec, idx) => (
                            <div key={idx} className={`${styles.card} ${styles.awardCard}`}>
                                <div className={`${styles.iconBox} ${styles.eduIcon}`}>
                                    <rec.icon size={20} />
                                </div>
                                <div>
                                    <div className={styles.itemTitle}>{language === 'pt' ? rec.title_pt : rec.title_en}</div>
                                    <div className={styles.itemSubtitle}>{rec.org}</div>
                                    <div className={styles.itemDesc}>{language === 'pt' ? rec.desc_pt : rec.desc_en}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Fabio;
