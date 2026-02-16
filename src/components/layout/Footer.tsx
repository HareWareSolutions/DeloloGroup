import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Instagram, Mail, MapPin } from 'lucide-react';
import styles from './Footer.module.css';
import { useLanguage } from '../../context/LanguageContext';

const Footer: React.FC = () => {
    const { t } = useLanguage();
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.grid}>
                    <div className={styles.brand}>
                        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '1rem' }}>
                            <img src="/logo.png" alt="Delolo Research Group" className={styles.footerLogo} style={{ marginBottom: 0 }} />
                            <a href="https://www.ufjf.br/" target="_blank" rel="noopener noreferrer">
                                <img src="/ufjf-logo.png" alt="Universidade Federal de Juiz de Fora" className={styles.footerLogo} style={{ marginBottom: 0 }} />
                            </a>
                        </div>
                        <p className={styles.mission}>
                            {t('footer.transforming')} {t('footer.focus')}
                        </p>
                    </div>

                    <div className={styles.column}>
                        <h4>{t('footer.navigation')}</h4>
                        <ul>
                            <li><Link to="/research">{t('nav.research')}</Link></li>
                            <li><Link to="/publications">{t('nav.publications')}</Link></li>
                            <li><Link to="/members">{t('nav.members')}</Link></li>
                            <li><Link to="/news">{t('nav.news')}</Link></li>
                        </ul>
                    </div>

                    <div className={styles.column}>
                        <h4>{t('footer.contact')}</h4>
                        <ul className={styles.contactList}>
                            <li>
                                <Mail size={16} /> <span>contato@delologroup.com</span>
                            </li>
                            <li>
                                <MapPin size={16} style={{ flexShrink: 0 }} />
                                <span>
                                    {t('footer.address')}<br />
                                    {t('footer.campus')}<br />
                                    Juiz de Fora - MG
                                </span>
                            </li>
                        </ul>
                    </div>

                    <div className={styles.column}>
                        <h4>{t('footer.connect')}</h4>
                        <div className={styles.socials}>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
                                {/* X logo is notoriously tricky with standard icon sets, usually just 'X' or 'Twitter' icon */}
                                <Twitter size={20} />
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                                <Instagram size={20} />
                            </a>
                        </div>
                    </div>
                </div>

                <div className={styles.bottom}>
                    <p>&copy; {new Date().getFullYear()} Delolo Research Group. {t('footer.rights')}</p>
                    <div className={styles.developer}>
                        <span className={styles.developerText}>{t('footer.developed')}</span>
                        <img src="/hareware-logo.png" alt="HareWare" className={styles.harewareLogo} />
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
