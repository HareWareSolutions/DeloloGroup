import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import styles from './Fabio.module.css';
import { API_BASE_URL } from '../api';
import { GraduationCap, Award, Briefcase, Globe, FileText, Fingerprint, Linkedin, Mail } from 'lucide-react';

interface Lecture {
    year: string;
    institution: string;
    country: string;
    country_pt?: string;
    country_en?: string;
    title: string;
    title_pt?: string;
    title_en?: string;
}

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
            institution: 'Universidade de São Paulo (USP-ESALQ)',
            details_pt: '',
            details_en: ''
        },
        {
            year: '2018',
            degree_pt: 'Mestre em Química Inorgânica',
            degree_en: 'M.Sc. in Inorganic Chemistry',
            institution: 'Universidade Federal de Minas Gerais (UFMG)',
            details_pt: 'Orientação: Profa. Dra. Elena Vitalievna Goussevskaia. Coorientação: Prof. Dr. Eduardo Nicolau dos Santos.',
            details_en: 'Advisor: Prof. Dr. Elena Vitalievna Goussevskaia. Co-advisor: Prof. Dr. Eduardo Nicolau dos Santos.'
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
            period: '2022 - 2026',
            role_pt: 'Pesquisador de Pós-Doutorado',
            role_en: 'Postdoctoral Researcher',
            place: 'Universidade Federal de Minas Gerais (UFMG)'
        },
        {
            period: '2024 - 2025',
            role_pt: 'Professor Substituto',
            role_en: 'Lecturer',
            place: 'Universidade Federal de Minas Gerais (UFMG)'
        },
        {
            period: '2020 - 2021',
            role_pt: 'Doutorado Sanduíche (CAPES-PrInt)',
            role_en: 'Visiting Researcher (Sandwich PhD)',
            place: 'Leibniz Institute for Catalysis (LIKAT), Rostock, Germany',
            details_pt: 'Supervisão: Prof. Dr. Matthias Beller.',
            details_en: 'Supervisor: Prof. Dr. Matthias Beller.'
        },
        {
            period: '2014 - 2015',
            role_pt: 'Bolsista Ciências sem Fronteiras (CsF)',
            role_en: 'Science Without Borders Fellow',
            place: 'University of Glasgow, Glasgow, United Kingdom',
            details_pt: 'Supervisão: Prof. Dr. Andrew Sutherland.',
            details_en: 'Supervisor: Prof. Dr. Andrew Sutherland.'
        },
        {
            period: '2011 - 2014',
            role_pt: 'Iniciação Científica',
            role_en: 'Undergraduate Research',
            place: 'Universidade Federal de São Carlos (UFSCar)',
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

    const [lectures, setLectures] = React.useState<Lecture[]>([]);

    React.useEffect(() => {
        fetch(`${API_BASE_URL}/api/lectures`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setLectures(data);
                }
            })
            .catch(err => console.error('Error fetching lectures:', err));
    }, []);

    // const lectures: Lecture[] = [
    //     // Example structure, easy to add more items
    //     // { year: '2024', institution: 'Event Name', country: 'Country', title: 'Lecture Title' }
    // ];

    return (
        <div className="container section">
            {/* Hero */}
            <div className={styles.hero}>
                <img
                    src={`${API_BASE_URL}/uploads/fabio.jpg`}
                    onError={(e) => { e.currentTarget.src = "/placeholder-user.jpg"; }}
                    alt="Dr. Fábio G. Delolo"
                    className={styles.profileImage}
                />
                <div className={styles.heroContent}>
                    <h1 className={styles.name}>Fábio G. Delolo</h1>
                    <p className={styles.role}>
                        {language === 'pt' ? 'Professor Assistente | UFJF' : 'Assistant Professor | UFJF'}
                    </p>
                    <p className={styles.intro}>
                        {language === 'pt'
                            ? 'Dedica-se ao desenvolvimento de estratégias catalíticas sustentáveis, visando transformar conhecimento fundamental em soluções aplicáveis da bancada ao mercado.'
                            : 'Dedicated to the development of sustainable catalytic strategies, aiming to transform fundamental knowledge into applicable solutions from the bench to the market.'}
                    </p>

                    {/* Social/Academic Links */}
                    <div className={styles.socialButtons}>
                        <a href="mailto:fabiodelolo@hotmail.com" className={styles.socialBtn}>
                            <Mail size={18} /> Email
                        </a>
                        <a href="http://lattes.cnpq.br/9249500644603471" target="_blank" rel="noopener noreferrer" className={styles.socialBtn}>
                            <FileText size={18} /> Lattes
                        </a>
                        <a href="https://orcid.org/0000-0001-7968-9506" target="_blank" rel="noopener noreferrer" className={styles.socialBtn}>
                            <Fingerprint size={18} /> ORCID
                        </a>
                        <a href="https://scholar.google.com/citations?user=010MEDcAAAAJ&hl=pt-BR" target="_blank" rel="noopener noreferrer" className={styles.socialBtn}>
                            <GraduationCap size={18} /> Google Scholar
                        </a>
                        <a href="https://www.linkedin.com/in/f%C3%A1bio-g-delolo/" target="_blank" rel="noopener noreferrer" className={styles.socialBtn}>
                            <Linkedin size={18} /> LinkedIn
                        </a>
                    </div>
                </div>
            </div>

            {/* Biography Section */}
            <div className={styles.biographySection}>
                <h2 className={styles.sectionTitle}>
                    {language === 'pt' ? 'Biografia' : 'Biography'}
                </h2>
                <div className={styles.bioText}>
                    {language === 'pt' ? (
                        <>
                            <p>
                                Fábio Godoy Delolo obteve seu Bacharelado em Química (2016) pela Universidade Federal de São Carlos (UFSCar), seguido de Mestrado (2018) e Doutorado (2022) em Química pela Universidade Federal de Minas Gerais (UFMG). Possui também MBA em Gestão de Negócios pela USP–ESALQ (2020).
                            </p>
                            <p>
                                Como bolsista do programa Ciência sem Fronteiras (CAPES), realizou pesquisa na University of Glasgow (Reino Unido) entre 2014 e 2015, sob supervisão do Prof. Andrew Sutherland. Durante o doutorado, foi contemplado com bolsa CAPES-PrInt e desenvolveu parte de sua pesquisa no Leibniz Institute for Catalysis (LIKAT), na Alemanha, em colaboração com o Prof. Matthias Beller.
                            </p>
                            <p>
                                Recebeu diversas distinções, incluindo o Prêmio Victor Teixeira da Silva (SBCat, 2021), o Prêmio Jovem Pesquisador (RSC/JP-SBQ, 2021), o Prêmio de Teses da UFMG e o Grande Prêmio de Teses (2023), além do Prêmio CAPES de Tese (2023). Foi selecionado como CAS Future Leader (2025) e pela Academia Brasileira de Ciências para representar o Brasil no 74º Lindau Nobel Laureate Meeting. Uma de suas tecnologias foi selecionada para o programa CATALISA ICT/SEBRAE.
                            </p>
                            <p>
                                Além de sua atuação científica, é pai de João (in memoriam) e de Otto, experiências que marcam profundamente sua trajetória pessoal e dão sentido humano ao seu percurso profissional.
                            </p>
                        </>
                    ) : (
                        <>
                            <p>
                                Fábio Godoy Delolo received his B.Sc. in Chemistry (2016) from the Federal University of São Carlos (UFSCar), followed by M.Sc. (2018) and Ph.D. (2022) degrees in Chemistry from the Federal University of Minas Gerais (UFMG). He also holds an MBA in Business Management from USP–ESALQ (2020).
                            </p>
                            <p>
                                As a Science Without Borders fellow (CAPES), he conducted research at the University of Glasgow (UK) between 2014 and 2015, under the supervision of Prof. Andrew Sutherland. During his Ph.D., he was awarded a CAPES-PrInt fellowship and developed part of his research at the Leibniz Institute for Catalysis (LIKAT), Germany, in collaboration with Prof. Matthias Beller.
                            </p>
                            <p>
                                He has received several distinctions, including the Victor Teixeira da Silva Award (SBCat, 2021), the Young Researcher Award (RSC/JP-SBQ, 2021), the UFMG Thesis Award and the Grand Thesis Prize (2023), in addition to the CAPES Thesis Award (2023). He was selected as a CAS Future Leader (2025) and by the Brazilian Academy of Sciences to represent Brazil at the 74th Lindau Nobel Laureate Meeting. One of his technologies was selected for the CATALISA ICT/SEBRAE program.
                            </p>
                            <p>
                                Beyond his scientific work, he is the father of João (in memoriam) and Otto, experiences that deeply mark his personal trajectory and give human meaning to his professional path.
                            </p>
                        </>
                    )}
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

                    {/* NEW Invited Lectures Section */}
                    <h2 className={styles.sectionTitle} style={{ marginTop: '2rem' }}>
                        <Globe size={24} />
                        {language === 'pt' ? 'Palestras Convidadas' : 'Invited Lectures'}
                    </h2>
                    <div className={styles.grid} style={{ gridTemplateColumns: '1fr' }}>
                        {lectures.length > 0 ? (
                            lectures.map((lec: any, idx) => (
                                <div key={idx} className={`${styles.card} ${styles.awardCard}`}>
                                    <div className={`${styles.iconBox} ${styles.eduIcon}`}>
                                        <Globe size={20} />
                                    </div>
                                    <div>
                                        <div className={styles.itemSubtitle}>
                                            {lec.year} | {lec.institution}
                                            ({language === 'pt' ? (lec.country_pt || lec.country) : (lec.country_en || lec.country)})
                                        </div>
                                        <div className={styles.itemTitle}>
                                            {language === 'pt' ? (lec.title_pt || lec.title) : (lec.title_en || lec.title)}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p style={{ color: '#6b7280', fontStyle: 'italic' }}>
                                {language === 'pt' ? 'Em breve.' : 'Coming soon.'}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Fabio;
