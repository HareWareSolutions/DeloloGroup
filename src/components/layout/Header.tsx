import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe, Search } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext'; // Import context
import styles from './Header.module.css';

const Header: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();
    const { t, language, setLanguage } = useLanguage(); // Use context

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'pt' : 'en');
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsMenuOpen(false);
    }, [location]);

    const navLinks = [
        { name: t('nav.research'), path: '/research' },
        { name: t('nav.publications'), path: '/publications' },
        { name: t('nav.values'), path: '/values' },
        { name: t('nav.members'), path: '/members' },
        { name: t('nav.fabio'), path: '/fabio-delolo' },
        { name: t('nav.news'), path: '/news' },
        { name: t('nav.contact'), path: '/contact' },
    ];

    return (
        <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
            <div className={styles.container}>
                <Link to="/" className={styles.logo}>
                    <img src="/logo.png" alt="Delolo Research Group" className={styles.logoImage} />
                </Link>

                <nav className={`${styles.nav} ${isMenuOpen ? styles.open : ''}`}>
                    <ul className={styles.navList}>
                        {navLinks.map((link) => (
                            <li key={link.path}>
                                <Link
                                    to={link.path}
                                    className={`${styles.navLink} ${location.pathname === link.path ? styles.active : ''}`}
                                >
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <div className={styles.actions}>
                        <button className={styles.iconButton} aria-label="Search">
                            <Search size={20} />
                        </button>
                        <button
                            className={styles.iconButton}
                            aria-label="Switch Language"
                            onClick={toggleLanguage}
                        >
                            <Globe size={20} />
                            <span style={{ fontSize: '0.8rem', marginLeft: '4px', fontWeight: 'bold' }}>
                                {language.toUpperCase()}
                            </span>
                        </button>
                        {/* Admin Link for convenience (optional) */}
                        {/* <Link to="/admin/login" className={styles.iconButton}><Settings size={20}/></Link> */}
                    </div>
                </nav>

                <button className={styles.menuToggle} onClick={toggleMenu} aria-label="Toggle Menu">
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>
        </header>
    );
};

export default Header;
