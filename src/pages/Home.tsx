import React, { useEffect, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import styles from './Home.module.css';

interface NewsItem {
    id: number;
    title_pt: string;
    title_en: string;
    date: string;
}

interface Publication {
    id: number;
    title_pt: string;
    title_en: string;
    journal: string;
    year: number;
    image_url?: string;
}

interface Member {
    id: number;
    name: string;
    role_pt: string;
    role_en: string;
    image_url: string;
    type: string;
}

const Home: React.FC = () => {
    const { t, language } = useLanguage();
    const [latestNews, setLatestNews] = useState<NewsItem[]>([]);
    const [publications, setPublications] = useState<Publication[]>([]);
    const [teamMembers, setTeamMembers] = useState<Member[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);

    const nextMember = () => {
        setActiveIndex((prev) => (prev + 1) % teamMembers.length);
    };

    const prevMember = () => {
        setActiveIndex((prev) => (prev - 1 + teamMembers.length) % teamMembers.length);
    };

    useEffect(() => {
        if (teamMembers.length > 1) {
            const interval = setInterval(nextMember, 5000); // Auto-rotate every 5s
            return () => clearInterval(interval);
        }
    }, [teamMembers.length]);

    useEffect(() => {
        // Fetch News
        fetch('http://localhost:3001/api/news')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    const published = data.filter((n: any) => n.status === 'published');
                    setLatestNews(published.slice(0, 2));
                }
            })
            .catch(err => console.error(err));

        // Fetch Publications
        fetch('http://localhost:3001/api/publications')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    const sorted = data.sort((a: Publication, b: Publication) => b.year - a.year);
                    setPublications(sorted.slice(0, 3));
                }
            })
            .catch(err => console.error(err));

        // Fetch Members (PI + Current)
        fetch('http://localhost:3001/api/members')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    const pi = data.find((m: Member) => m.type === 'pi');
                    const active = data.filter((m: Member) => m.type === 'current');
                    // Combine PI first, then active members
                    const team = pi ? [pi, ...active] : active;
                    setTeamMembers(team);
                }
            })
            .catch(err => console.error(err));
    }, []);

    return (
        <div className={styles.home}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>
                        {t('hero.title')}
                    </h1>
                    <p className={styles.heroSubtitle}>
                        {language === 'pt'
                            ? 'O Grupo de Pesquisa Delolo foca em catálise, química verde e na transformação do conhecimento científico em soluções globais.'
                            : 'Delolo Research Group focuses on catalysis, green chemistry, and the transformation of scientific knowledge into global solutions.'}
                    </p>
                    <div className={styles.heroActions}>
                        <Link to="/research" className={styles.primaryButton}>
                            {language === 'pt' ? 'Nossa Pesquisa' : 'Explore Research'}
                        </Link>
                        <Link to="/publications" className={styles.secondaryButton}>
                            {language === 'pt' ? 'Publicações' : 'Our Publications'} <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
                <div className={styles.heroVisual}>
                    <div className={styles.abstractShape}></div>
                </div>
            </section>

            {/* 1. Research Preview - EMPHASIZED */}
            <section className={`${styles.section} ${styles.researchPreview}`}>
                <div className="container">
                    <div className="text-center">
                        <h2 className={styles.megaTitle}>{language === 'pt' ? 'PESQUISA DE PONTA' : 'CUTTING-EDGE RESEARCH'}</h2>
                        <h3 className="section-title">{language === 'pt' ? 'Foco Científico' : 'Scientific Focus'}</h3>
                        <p className="section-desc">
                            {language === 'pt' ? 'Pioneirismo em novos caminhos para processos catalíticos e sustentabilidade.' : 'Pioneering new pathways in catalytic processes and sustainability.'}
                        </p>
                    </div>

                    <div className="scientific-grid">
                        <div className={`glass-panel ${styles.featureCard}`}>
                            <h3>{language === 'pt' ? 'Catálise' : 'Catalysis'}</h3>
                            <p>{language === 'pt' ? 'Desenvolvimento de novos catalisadores para eficiência.' : 'Developing novel catalysts for efficiency.'}</p>
                        </div>
                        <div className={`glass-panel ${styles.featureCard}`}>
                            <h3>{language === 'pt' ? 'Química Verde' : 'Green Chemistry'}</h3>
                            <p>{language === 'pt' ? 'Processos sustentáveis para redução de resíduos.' : 'Sustainable processes for waste reduction.'}</p>
                        </div>
                        <div className={`glass-panel ${styles.featureCard}`}>
                            <h3>{language === 'pt' ? 'Ciência dos Materiais' : 'Material Science'}</h3>
                            <p>{language === 'pt' ? 'Materiais inovadores para aplicação industrial.' : 'Innovative materials for industrial application.'}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. Publications Preview */}
            <section className={`${styles.section} ${styles.altBackground}`}>
                <div className="container">
                    <div className={styles.sectionHeader}>
                        <h2 className="section-title">{language === 'pt' ? 'Publicações Recentes' : 'Recent Publications'}</h2>
                        <Link to="/publications" className={styles.linkArrow}>
                            {language === 'pt' ? 'Ver todas' : 'View all'} <ArrowRight size={16} />
                        </Link>
                    </div>
                    <div className={styles.pubGrid}>
                        {publications.map(pub => (
                            <div key={pub.id} className={styles.pubCard}>
                                <span className={styles.pubYear}>{pub.year}</span>
                                <h3 className={styles.pubTitle}>
                                    {language === 'pt' && pub.title_pt ? pub.title_pt : pub.title_en}
                                </h3>
                                <div className={styles.pubJournal}>{pub.journal}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. Members Preview (PI Focus) */}
            <section className={styles.section}>
                <div className="container">
                    <div className={styles.sectionHeader}>
                        <h2 className="section-title">{language === 'pt' ? 'Nosso Time' : 'Our Team'}</h2>
                        <Link to="/members" className={styles.linkArrow}>
                            {language === 'pt' ? 'Conheça o grupo' : 'Meet the group'} <ArrowRight size={16} />
                        </Link>
                    </div>
                    {teamMembers.length > 0 && (
                        <div className={styles.carouselContainer}>
                            <div className={styles.carouselMain}>
                                {teamMembers.length > 1 && (
                                    <button onClick={prevMember} className={`${styles.navBtn} ${styles.prevBtn}`} aria-label="Previous">
                                        <ChevronLeft size={32} />
                                    </button>
                                )}

                                <div className={styles.carouselWindow}>
                                    <div
                                        className={styles.carouselTrack}
                                        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
                                    >
                                        {teamMembers.map((member) => (
                                            <div key={member.id} className={styles.carouselSlide}>
                                                <div className={styles.piHighlight}>
                                                    <div className={styles.memberContent}>
                                                        <img
                                                            src={member.image_url ? `http://localhost:3001${member.image_url}` : '/placeholder-user.jpg'}
                                                            alt={member.name}
                                                            className={styles.piImage}
                                                        />
                                                        <div className={styles.piInfo}>
                                                            <h3>{member.name}</h3>
                                                            <span className={styles.piRole}>
                                                                {language === 'pt' ? member.role_pt : member.role_en}
                                                            </span>
                                                            <p>
                                                                {member.type === 'pi'
                                                                    ? (language === 'pt' ? 'Liderando inovações em pesquisa química.' : 'Leading innovations in chemical research.')
                                                                    : (language === 'pt' ? 'Membro ativo da equipe de pesquisa.' : 'Active member of the research team.')
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {teamMembers.length > 1 && (
                                    <button onClick={nextMember} className={`${styles.navBtn} ${styles.nextBtn}`} aria-label="Next">
                                        <ChevronRight size={32} />
                                    </button>
                                )}
                            </div>

                            {/* Dots indicator */}
                            {teamMembers.length > 1 && (
                                <div className={styles.dots}>
                                    {teamMembers.map((_, idx) => (
                                        <span
                                            key={idx}
                                            className={`${styles.dot} ${idx === activeIndex ? styles.activeDot : ''}`}
                                            onClick={() => setActiveIndex(idx)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>

            {/* 4. News Preview */}
            <section className={`${styles.section} ${styles.altBackground}`}>
                <div className="container">
                    <h2 className="section-title">{language === 'pt' ? 'Notícias & Atualizações' : 'News & Updates'}</h2>
                    <div className={styles.newsGrid}>
                        {latestNews.length > 0 ? latestNews.map(item => (
                            <div key={item.id} className={styles.newsItem}>
                                <span className={styles.date}>
                                    {new Date(item.date).toLocaleDateString(language === 'pt' ? 'pt-BR' : 'en-US', {
                                        month: 'short', day: 'numeric', year: 'numeric'
                                    })}
                                </span>
                                <h3>{language === 'pt' ? item.title_pt : item.title_en}</h3>
                                <Link to="/news">{language === 'pt' ? 'Ler mais' : 'Read more'}</Link>
                            </div>
                        )) : (
                            <p>{language === 'pt' ? 'Nenhuma notícia recente.' : 'No recent news.'}</p>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
