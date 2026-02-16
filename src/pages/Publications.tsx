import React, { useEffect, useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { API_BASE_URL } from '../api';
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
    deposit_date?: string;
    grant_date?: string;
}

const Publications: React.FC = () => {
    const { t, language } = useLanguage();
    const [publications, setPublications] = useState<Publication[]>([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [yearFilter, setYearFilter] = useState<string>('all');
    const [typeFilter, setTypeFilter] = useState<string>('all');

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/publications`)
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

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return null;
        const date = new Date(dateStr);
        // Fix timezone offset issue by treating the input as UTC if it comes as YYYY-MM-DD
        // or just by using getUTC* methods if we want to be safe, but typically:
        const [y, m, d] = dateStr.split('-');

        if (language === 'pt') {
            return `${d}/${m}/${y}`;
        }
        return `${m}/${d}/${y}`;
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

            // Type matching
            let matchesType = true;
            if (typeFilter !== 'all') {
                if (typeFilter === 'Article') matchesType = (!pub.pub_type || pub.pub_type === 'Article');
                else matchesType = pub.pub_type === typeFilter;
            }

            return matchesSearch && matchesYear && matchesType;
        });
    }, [publications, searchTerm, yearFilter, typeFilter, language]);

    // 2. Paginate - Removed
    // const totalPages = Math.ceil(filteredPublications.length / itemsPerPage);
    /*
    const paginatedItems = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredPublications.slice(start, start + itemsPerPage);
    }, [filteredPublications, currentPage]);
    */

    // 3. Group (Visual only) - Removed previous logic that grouped by year for the entire list
    // to allow split by category.
    // const grouped ... (removed)

    // const years = Object.keys(grouped).map(Number).sort((a, b) => b - a);
    const availableYears = Array.from(new Set(publications.map(p => p.year))).sort((a, b) => b - a);

    // Reset page on filter change - Removed
    // useEffect(() => {
    //     setCurrentPage(1);
    // }, [searchTerm, yearFilter, typeFilter]);

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
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className={styles.filterSelect}
                >
                    <option value="all">{language === 'pt' ? 'Todas as Categorias' : 'All Categories'}</option>
                    <option value="Article">{language === 'pt' ? 'Artigos' : 'Articles'}</option>
                    <option value="Book">{language === 'pt' ? 'Livros' : 'Books'}</option>
                    <option value="Patent">{language === 'pt' ? 'Patentes' : 'Patents'}</option>
                    <option value="Cover">{language === 'pt' ? 'Capas' : 'Covers'}</option>
                    <option value="Conference">{language === 'pt' ? 'Conferências' : 'Conferences'}</option>
                </select>

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

            {/* Content Split by Category */}
            <div className={styles.categoryList}>
                {/* 1. Covers */}
                {filteredPublications.filter(p => p.pub_type === 'Cover').length > 0 && (
                    <section className={styles.pubSection}>
                        <h2 className={styles.sectionTitle}>{language === 'pt' ? 'Capas de Revistas' : 'Journal Covers'}</h2>
                        <div className={styles.coversGrid}>
                            {filteredPublications
                                .filter(p => p.pub_type === 'Cover')
                                .map(pub => (
                                    <div key={pub.id} className={styles.coverCard}>
                                        <img
                                            src={pub.image_url ? `${API_BASE_URL}${pub.image_url}` : '/placeholder.png'}
                                            alt={getTitle(pub)}
                                            className={styles.coverImage}
                                        />
                                        <p className={styles.coverCaption}>
                                            <strong>{pub.journal}</strong> ({pub.year})
                                        </p>
                                    </div>
                                ))
                            }
                        </div>
                    </section>
                )}

                {/* 2. Articles (Reference Style) */}
                {filteredPublications.filter(p => !p.pub_type || p.pub_type === 'Article').length > 0 && (
                    <section className={styles.pubSection}>
                        <h2 className={styles.sectionTitle}>{language === 'pt' ? 'Artigos Científicos' : 'Scientific Articles'}</h2>
                        <div className={styles.numberedList}>
                            {filteredPublications
                                .filter(p => !p.pub_type || p.pub_type === 'Article')
                                .map((pub, index, arr) => (
                                    <div key={pub.id} className={styles.refCard}>
                                        <div className={styles.refHeader}>
                                            <div className={styles.refIconBox}>
                                                {arr.length - index}
                                            </div>
                                            <div className={styles.refMetaText}>
                                                <em>{pub.journal}</em>
                                                {pub.year && <>,{' '}<strong>{pub.year}</strong></>}
                                                {pub.volume && <>, {pub.volume}</>}
                                                {pub.pages && <>, {pub.pages}</>}
                                            </div>
                                        </div>

                                        <div className={styles.refBody}>
                                            <div className={styles.refContentCol}>
                                                <h3 className={styles.refTitle}>{getTitle(pub)}</h3>
                                                <div className={styles.refAuthors}>{pub.authors}</div>

                                                {pub.doi && (
                                                    <div className={styles.doiLinkWrapper}>
                                                        <a href={`https://doi.org/${pub.doi.replace('doi:', '')}`} target="_blank" rel="noreferrer">
                                                            DOI: {pub.doi}
                                                        </a>
                                                    </div>
                                                )}
                                            </div>

                                            {pub.image_url && (
                                                <div className={styles.refImageCol}>
                                                    <img
                                                        src={`${API_BASE_URL}${pub.image_url}`}
                                                        alt={getTitle(pub)}
                                                        className={styles.refCardImage}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </section>
                )}

                {/* 3. Patents (Reference Style) */}
                {filteredPublications.filter(p => p.pub_type === 'Patent').length > 0 && (
                    <section className={styles.pubSection}>
                        <h2 className={styles.sectionTitle}>{language === 'pt' ? 'Patentes' : 'Patents'}</h2>
                        <div className={styles.numberedList}>
                            {filteredPublications
                                .filter(p => p.pub_type === 'Patent')
                                .map((pub, index, arr) => (
                                    <div key={pub.id} className={styles.refCard}>
                                        <div className={styles.refHeader}>
                                            <div className={styles.refIconBox}>
                                                {arr.length - index}
                                            </div>
                                            <div className={styles.refMetaText}>
                                                <strong>{pub.journal}</strong>
                                            </div>
                                        </div>

                                        <div className={styles.refBody}>
                                            <div className={styles.refContentCol}>
                                                <h3 className={styles.refTitle}>{getTitle(pub)}</h3>
                                                <div className={styles.refAuthors}>{pub.authors}</div>

                                                {(pub.deposit_date || pub.grant_date) && (
                                                    <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>
                                                        {pub.deposit_date && (
                                                            <span style={{ marginRight: '1rem' }}>
                                                                <strong>{language === 'pt' ? 'Data de Depósito:' : 'Deposit Date:'}</strong> {formatDate(pub.deposit_date)}
                                                            </span>
                                                        )}
                                                        {pub.grant_date && (
                                                            <span>
                                                                <strong>{language === 'pt' ? 'Data de Concessão:' : 'Grant Date:'}</strong> {formatDate(pub.grant_date)}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {pub.image_url && (
                                            <div className={styles.refImageCol}>
                                                <img
                                                    src={`${API_BASE_URL}${pub.image_url}`}
                                                    alt={getTitle(pub)}
                                                    className={styles.refCardImage}
                                                />
                                            </div>
                                        )}
                                    </div>
                                ))
                            }
                        </div>
                    </section>
                )}

                {/* 4. Books (Reference Style) */}
                {filteredPublications.filter(p => p.pub_type === 'Book').length > 0 && (
                    <section className={styles.pubSection}>
                        <h2 className={styles.sectionTitle}>{language === 'pt' ? 'Livros e Capítulos' : 'Books & Chapters'}</h2>
                        <div className={styles.numberedList}>
                            {filteredPublications
                                .filter(p => p.pub_type === 'Book')
                                .map((pub, index, arr) => (
                                    <div key={pub.id} className={styles.refCard}>
                                        <div className={styles.refHeader}>
                                            <div className={styles.refIconBox}>
                                                {arr.length - index}
                                            </div>
                                            <div className={styles.refMetaText}>
                                                {pub.journal && <>{pub.journal} - </>}<strong>{pub.year}</strong>
                                            </div>
                                        </div>
                                        <div className={styles.refBody}>
                                            <div className={styles.refContentCol}>
                                                <h3 className={styles.refTitle}>{getTitle(pub)}</h3>
                                                <div className={styles.refAuthors}>{pub.authors}</div>
                                                {pub.doi && (
                                                    <div className={styles.doiLinkWrapper}>
                                                        <a href={pub.doi.startsWith('http') ? pub.doi : `https://doi.org/${pub.doi}`} target="_blank" rel="noreferrer">
                                                            Link / DOI
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                            {pub.image_url && (
                                                <div className={styles.refImageCol}>
                                                    <img
                                                        src={`${API_BASE_URL}${pub.image_url}`}
                                                        alt={getTitle(pub)}
                                                        className={styles.refCardImage}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </section>
                )}

                {/* 5. Conferences (Reference Style) */}
                {filteredPublications.filter(p => p.pub_type === 'Conference').length > 0 && (
                    <section className={styles.pubSection}>
                        <h2 className={styles.sectionTitle}>{language === 'pt' ? 'Conferências' : 'Conferences'}</h2>
                        <div className={styles.numberedList}>
                            {filteredPublications
                                .filter(p => p.pub_type === 'Conference')
                                .map((pub, index, arr) => (
                                    <div key={pub.id} className={styles.refCard}>
                                        <div className={styles.refHeader}>
                                            <div className={styles.refIconBox}>
                                                {arr.length - index}
                                            </div>
                                            <div className={styles.refMetaText}>
                                                {pub.journal} - <strong>{pub.year}</strong>
                                            </div>
                                        </div>
                                        <div className={styles.refBody}>
                                            <div className={styles.refContentCol}>
                                                <h3 className={styles.refTitle}>{getTitle(pub)}</h3>
                                                <div className={styles.refAuthors}>{pub.authors}</div>
                                            </div>
                                            {pub.image_url && (
                                                <div className={styles.refImageCol}>
                                                    <img
                                                        src={`${API_BASE_URL}${pub.image_url}`}
                                                        alt={getTitle(pub)}
                                                        className={styles.refCardImage}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </section>
                )}


                {/* 6. Others (updated exclusion) */}
                {filteredPublications.filter(p => !['Cover', 'Article', 'Patent', 'Book', 'Conference'].includes(p.pub_type || 'Article')).length > 0 && (
                    <section className={styles.pubSection}>
                        <h2 className={styles.sectionTitle}>{language === 'pt' ? 'Outras Publicações' : 'Other Publications'}</h2>
                        <div className={styles.simpleList}>
                            {filteredPublications
                                .filter(p => !['Cover', 'Article', 'Patent', 'Book', 'Conference'].includes(p.pub_type || 'Article'))
                                .map((pub) => (
                                    <div key={pub.id} className={styles.simpleItem}>
                                        <strong>{getTitle(pub)}</strong> ({pub.year}) - {pub.pub_type} <br />
                                        {pub.journal}
                                    </div>
                                ))
                            }
                        </div>
                    </section>
                )}
            </div>

            {/* Pagination Controls Removed */}
        </div >
    );
};

export default Publications;
