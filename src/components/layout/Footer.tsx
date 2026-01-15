import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Instagram, Mail, MapPin } from 'lucide-react';
import styles from './Footer.module.css';

const Footer: React.FC = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.grid}>
                    <div className={styles.brand}>
                        <img src="/logo.png" alt="Delolo Research Group" className={styles.footerLogo} />
                        <p className={styles.mission}>
                            Transformando conhecimento científico em inovação sustentável.
                            Foco em catálise e química verde.
                        </p>
                    </div>

                    <div className={styles.column}>
                        <h4>Navegação</h4>
                        <ul>
                            <li><Link to="/research">Research</Link></li>
                            <li><Link to="/publications">Publications</Link></li>
                            <li><Link to="/members">Members</Link></li>
                            <li><Link to="/news">News</Link></li>
                        </ul>
                    </div>

                    <div className={styles.column}>
                        <h4>Contato</h4>
                        <ul className={styles.contactList}>
                            <li>
                                <Mail size={16} /> <span>contato@delologroup.com</span>
                            </li>
                            <li>
                                <MapPin size={16} /> <span>Universidade Federal... </span>
                            </li>
                        </ul>
                    </div>

                    <div className={styles.column}>
                        <h4>Conecte-se</h4>
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
                    <p>&copy; {new Date().getFullYear()} Delolo Research Group. Todos os direitos reservados.</p>
                    <div className={styles.developer}>
                        <span className={styles.developerText}>Developed by</span>
                        <img src="/hareware-logo.png" alt="HareWare" className={styles.harewareLogo} />
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
