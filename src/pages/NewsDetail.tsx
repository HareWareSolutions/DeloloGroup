import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { ArrowLeft } from 'lucide-react';
import { API_BASE_URL } from '../api';
import styles from './NewsDetail.module.css';

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

const NewsDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { language } = useLanguage();
    const [news, setNews] = useState<NewsItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/news/${id}`)
            .then(res => {
                if (!res.ok) throw new Error('News not found');
                return res.json();
            })
            .then(data => {
                setNews(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div className="container section">Loading...</div>;
    if (error || !news) return <div className="container section">News not found</div>;

    const title = language === 'pt' ? news.title_pt : news.title_en;
    const content = language === 'pt' ? news.content_pt : news.content_en;

    return (
        <div className={styles.container}>
            <Link to="/news" className={styles.backLink}>
                <ArrowLeft size={20} />
                {language === 'pt' ? 'Voltar para Notícias' : 'Back to News'}
            </Link>

            <article className={styles.article}>
                {news.image_url && (
                    <img
                        src={`${API_BASE_URL}${news.image_url}`}
                        alt={title}
                        className={styles.image}
                    />
                )}

                <div className={styles.content}>
                    <div className={styles.meta}>
                        <span className={styles.date}>
                            {new Date(news.date).toLocaleDateString(language === 'pt' ? 'pt-BR' : 'en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </span>
                        {news.category && (
                            <span className={styles.category}>{news.category}</span>
                        )}
                    </div>

                    <h1 className={styles.title}>{title}</h1>
                    <div className={styles.body}>{content}</div>
                </div>
            </article>
        </div>
    );
};

export default NewsDetail;
