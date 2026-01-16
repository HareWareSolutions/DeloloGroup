import React, { useEffect, useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { FileText, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './Publications.module.css';

interface Publication {
    id: number;
    title_pt: string;
    title_en: string;
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
    const { t, language } = useLanguage();
    const [publications, setPublications] = useState<Publication[]>([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [yearFilter, setYearFilter] = useState<string>('all');

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // Low number to show pagination effect

    useEffect(() => {
        fetch('http://localhost:3001/api/publications')
            .then(res => res.json())
            .then(data => {
                const sorted = data.sort((a: Publication, b: Publication) => b.year - a.year);
                setPublications(sorted);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch publications", err);
                setLoading(false);
            });
    }, []);

    const getTitle = (pub: Publication) => {
        if (language === 'pt' && pub.title_pt) return pub.title_pt;
        return pub.title_en; // Fallback to EN or default
    };

    // 1. Filter
    const filteredPublications = useMemo(() => {
        return publications.filter(pub => {
            const title = getTitle(pub).toLowerCase();
            const authors = pub.authors.toLowerCase();
            const journal = pub.journal.toLowerCase();
            const search = searchTerm.toLowerCase();

            const matchesSearch = title.includes(search) || authors.includes(search) || journal.includes(search);
            const matchesYear = yearFilter === 'all' || pub.year.toString() === yearFilter;

            return matchesSearch && matchesYear;
        });
    }, [publications, searchTerm, yearFilter, language]);

    // 2. Paginate
    const totalPages = Math.ceil(filteredPublications.length / itemsPerPage);
    const paginatedItems = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredPublications.slice(start, start + itemsPerPage);
    }, [filteredPublications, currentPage]);

    // 3. Group (Visual only)
    const grouped = useMemo(() => {
        return paginatedItems.reduce((acc, pub) => {
            const y = pub.year;
            if (!acc[y]) acc[y] = [];
            acc[y].push(pub);
            return acc;
        }, {} as Record<number, Publication[]>);
    }, [paginatedItems]);

    const years = Object.keys(grouped).map(Number).sort((a, b) => b - a);
    const availableYears = Array.from(new Set(publications.map(p => p.year))).sort((a, b) => b - a);

    // Reset page on filter change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, yearFilter]);

    if (loading) return <div className={styles.loader}>Loading publications...</div>;

    return (
        <div className="container section">
            <h1>{t('nav.publications')}</h1>

            {/* Controls */}
            <div className={styles.controls}>
                <div className={styles.searchBox}>
                    <input
                        type="text"
                        placeholder={language === 'pt' ? "Buscar por título, autores, jornal..." : "Search title, authors, journal..."}
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

            {/* List */}
            <div className={styles.list}>
                {filteredPublications.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                        {language === 'pt' ? 'Nenhuma publicação encontrada.' : 'No publications found.'}
                    </div>
                ) : (
                    years.map(year => (
                        <div key={year} className={styles.yearGroup}>
                            <h2 className={styles.yearTitle}>{year}</h2>
                            {grouped[year].map(pub => (
                                <div key={pub.id} className={styles.pubCard}>
                                    <div className={styles.cardHeader}>
                                        <div className={styles.headerIcon}>
                                            <FileText size={20} color="white" />
                                        </div>
                                        <div className={styles.headerText}>
                                            {pub.journal}. {pub.year}
                                            {pub.volume && `, ${pub.volume}`}
                                            {pub.pages && `, ${pub.pages}.`}
                                        </div>
                                    </div>

                                    <div className={styles.cardBody}>
                                        <div className={styles.infoCol}>
                                            <h3 className={styles.title}>{getTitle(pub)}</h3>
                                            <div className={styles.authors}>{pub.authors}</div>
                                            {pub.doi && (
                                                <a
                                                    href={`https://doi.org/${pub.doi.replace('doi:', '')}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={styles.doiLink}
                                                >
                                                    DOI: {pub.doi}
                                                </a>
                                            )}
                                        </div>

                                        {pub.image_url && (
                                            <div className={styles.imageCol}>
                                                <img
                                                    src={`http://localhost:3001${pub.image_url}`}
                                                    alt={getTitle(pub)}
                                                    className={styles.pubImage}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))
                )}
            </div>

            {/* Pagination Controls */}
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

export default Publications;
