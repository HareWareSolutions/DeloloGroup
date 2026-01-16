import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import styles from './Publications.module.css';

interface Publication {
    id: number;
    title: string;
    journal: string;
    year: number;
    doi: string;
    authors: string;
    image_url?: string;
    volume?: string;
    pages?: string;
    pub_type?: string;
}

const Publications: React.FC = () => {
    const { t } = useLanguage();
    const [publications, setPublications] = useState<Publication[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:3001/api/publications')
            .then(res => res.json())
            .then(data => {
                // Sort by year desc
                const sorted = data.sort((a: Publication, b: Publication) => b.year - a.year);
                setPublications(sorted);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch publications", err);
                setLoading(false);
            });
    }, []);

    // Group by year
    const grouped = publications.reduce((acc, pub) => {
        const y = pub.year;
        if (!acc[y]) acc[y] = [];
        acc[y].push(pub);
        return acc;
    }, {} as Record<number, Publication[]>);

    const years = Object.keys(grouped).map(Number).sort((a, b) => b - a);

    if (loading) return <div className={styles.loader}>Loading publications...</div>;

    return (
        <div className="container section">
            <h1>{t('nav.publications')}</h1>
            <div className={styles.list}>
                {years.map(year => (
                    <div key={year} className={styles.yearGroup}>
                        <h2 className={styles.yearTitle}>{year}</h2>
                        {grouped[year].map(pub => (
                            <div key={pub.id} className={styles.item}>
                                {pub.image_url && (
                                    <img
                                        src={`http://localhost:3001${pub.image_url}`}
                                        alt={pub.title}
                                        className={styles.pubImage}
                                    />
                                )}
                                <div className={styles.pubContent}>
                                    <div>
                                        {pub.pub_type && <span className={styles.pubTypeBadge}>{pub.pub_type}</span>}
                                        <h3 className={styles.title} style={{ display: 'inline' }}>{pub.title}</h3>
                                    </div>
                                    <div className={styles.authors}>{pub.authors}</div>
                                    <div>
                                        <span className={styles.journal}>{pub.journal}</span>
                                        {pub.volume && <span>, Vol. {pub.volume}</span>}
                                        {pub.pages && <span>, pp. {pub.pages}</span>}
                                        <span> ({pub.year})</span>

                                        {pub.doi && (
                                            <a href={`https://doi.org/${pub.doi.replace('doi:', '')}`} target="_blank" rel="noopener noreferrer" className={styles.doi}>
                                                DOI: {pub.doi}
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Publications;
