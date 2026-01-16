import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
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

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [yearFilter, setYearFilter] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    useEffect(() => {
        fetch('http://localhost:3001/api/news')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    // Filter published and sort by date desc
                    const published = data
                        .filter((n: NewsItem) => n.status === 'published')
                        .sort((a: NewsItem, b: NewsItem) => new Date(b.date).getTime() - new Date(a.date).getTime());
                    setNews(published);
                } else {
                    setNews([]);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch news", err);
                setLoading(false);
            });
    }, []);

    const getTitle = (item: NewsItem) => (language === 'pt' ? item.title_pt : item.title_en);
    const getContent = (item: NewsItem) => (language === 'pt' ? item.content_pt : item.content_en);

    // Filter Logic
    const filteredNews = useMemo(() => {
        return news.filter(item => {
            const title = getTitle(item).toLowerCase();
            const content = getContent(item).toLowerCase();
            const search = searchTerm.toLowerCase();
            const itemYear = new Date(item.date).getFullYear().toString();

            const matchesSearch = title.includes(search) || content.includes(search);
            const matchesYear = yearFilter === 'all' || itemYear === yearFilter;

            return matchesSearch && matchesYear;
        });
    }, [news, searchTerm, yearFilter, language]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredNews.length / itemsPerPage);
    const paginatedItems = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredNews.slice(start, start + itemsPerPage);
    }, [filteredNews, currentPage]);

    // Available Years for Filter
    const availableYears = useMemo(() => {
        const years = new Set(news.map(n => new Date(n.date).getFullYear()));
        return Array.from(years).sort((a, b) => b - a);
    }, [news]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, yearFilter]);

    if (loading) return <div className={styles.loader}>Loading news...</div>;

    return (
        <div className="container section">
            <h1>{t('nav.news')}</h1>

            {/* Controls */}
            <div className={styles.controls}>
                <div className={styles.searchBox}>
                    <input
                        type="text"
                        placeholder={language === 'pt' ? "Buscar notícias..." : "Search news..."}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>
                <select
                    value={yearFilter}
                    onChange={(e) => setYearFilter(e.target.value)}
                    className={styles.filterSelect}
                >
                    <option value="all">{language === 'pt' ? "Todos os Anos" : "All Years"}</option>
                    {availableYears.map(y => (
                        <option key={y} value={y}>{y}</option>
                    ))}
                </select>
            </div>

            {/* Grid */}
            <div className={styles.grid}>
                {paginatedItems.length === 0 ? (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '2rem', color: '#666' }}>
                        {language === 'pt' ? 'Nenhuma notícia encontrada.' : 'No items found.'}
                    </div>
                ) : (
                    paginatedItems.map(item => (
                        <article key={item.id} className={styles.card}>
                            <Link to={`/news/${item.id}`} className={styles.imageContainer}>
                                <img
                                    src={item.image_url ? `http://localhost:3001${item.image_url}` : '/placeholder.png'}
                                    alt={getTitle(item)}
                                    className={styles.image}
                                    onError={(e) => { e.currentTarget.src = '/placeholder.png'; }}
                                />
                            </Link>
                            <div className={styles.content}>
                                <div className={styles.date}>
                                    {new Date(item.date).toLocaleDateString(language === 'pt' ? 'pt-BR' : 'en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </div>
                                <Link to={`/news/${item.id}`} style={{ textDecoration: 'none' }}>
                                    <h2 className={styles.title}>{getTitle(item)}</h2>
                                </Link>
                                <p className={styles.excerpt}>{getContent(item)}</p>
                                <Link to={`/news/${item.id}`} className={styles.readMore}>
                                    {language === 'pt' ? 'Leia mais' : 'Read more'}
                                </Link>
                            </div>
                        </article>
                    ))
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className={styles.pagination}>
                    <button
                        className={styles.pageBtn}
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => prev - 1)}
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <span className={styles.pageInfo}>
                        {currentPage} / {totalPages}
                    </span>
                    <button
                        className={styles.pageBtn}
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(prev => prev + 1)}
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default News;
