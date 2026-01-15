import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe, Search } from 'lucide-react';
import styles from './Header.module.css';

const Header: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

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
        { name: 'Research', path: '/research' },
        { name: 'Publications', path: '/publications' },
        { name: 'Values', path: '/values' },
        { name: 'Members', path: '/members' },
        { name: 'Prof. Delolo', path: '/fabio-delolo' },
        { name: 'News', path: '/news' },
        { name: 'Contact', path: '/contact' },
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
                        <button className={styles.iconButton} aria-label="Switch Language">
                            <Globe size={20} />
                        </button>
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
