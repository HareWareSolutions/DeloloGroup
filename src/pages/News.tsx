import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import styles from './News.module.css';

interface NewsItem {
    id: number;
    title_pt: string;
    title_en: string;
    content_pt: string;
    content_en: string;
    date: string;
    image_url: string;
    category?: string;
    status: 'draft' | 'published';
}

const News: React.FC = () => {
    const { t, language } = useLanguage();
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:3001/api/news')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    // Filter published only
                    const published = data.filter((n: NewsItem) => n.status === 'published');
                    setNews(published); // Changed setNewsList to setNews
                } else {
                    console.warn("Fetched data is not an array:", data);
                    setNews([]); // Set to empty array if data is not an array
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch news", err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className={styles.loader}>Loading news...</div>;

    return (
        <div className="container section">
            <h1>{t('nav.news')}</h1>
            <div className={styles.grid}>
                {news.map(item => (
                    <article key={item.id} className={styles.card}>
                        <div className={styles.imageContainer}>
                            <img
                                src={item.image_url ? `http://localhost:3001${item.image_url}` : '/placeholder.png'}
                                alt={language === 'pt' ? item.title_pt : item.title_en}
                                className={styles.image}
                            />
                        </div>
                        <div className={styles.content}>
                            <div className={styles.date}>
                                {new Date(item.date).toLocaleDateString(language === 'pt' ? 'pt-BR' : 'en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </div>
                            <h2 className={styles.title}>
                                {language === 'pt' ? item.title_pt : item.title_en}
                            </h2>
                            <p className={styles.excerpt}>
                                {language === 'pt' ? item.content_pt : item.content_en}
                            </p>
                            {/* 
                            <button className={styles.readMore}>
                                {language === 'pt' ? 'Ler mais' : 'Read more'}
                            </button> 
                            */}
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
};

export default News;
