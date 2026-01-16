import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Linkedin, FileText, GraduationCap, User } from 'lucide-react';
import styles from './Members.module.css';

interface Member {
    id: number;
    name: string;
    role_pt: string;
    role_en: string;
    bio_pt: string;
    bio_en: string;
    image_url: string;
    type: 'pi' | 'current' | 'alumni';
    order_index: number;
    lattes?: string;
    linkedin?: string;
    orcid?: string;
    google_scholar?: string;
    current_workplace?: string;
}

const Members: React.FC = () => {
    const { t, language } = useLanguage();
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetch('http://localhost:3001/api/members')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setMembers(data);
                } else {
                    console.error("API Error:", data);
                    setError(data.error || "Format invalid");
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch members", err);
                setError("Network error");
                setLoading(false);
            });
    }, []);

    const pi = members.filter(m => m.type === 'pi');
    const current = members.filter(m => m.type === 'current');
    const alumni = members.filter(m => m.type === 'alumni');

    const renderGrid = (list: Member[]) => (
        <div className={styles.grid}>
            {list.map(member => (
                <div key={member.id} className={styles.card}>
                    <Link to={`/members/${member.id}`} className={styles.imageContainer}>
                        <img
                            src={member.image_url ? `http://localhost:3001${member.image_url}` : '/placeholder.png'}
                            alt={member.name}
                            className={styles.image}
                        />
                    </Link>
                    <div className={styles.content}>
                        <Link to={`/members/${member.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <h3 className={styles.name}>{member.name}</h3>
                        </Link>
                        <span className={styles.role}>
                            {language === 'pt' ? member.role_pt : member.role_en}
                        </span>
                        {member.type === 'alumni' && member.current_workplace && (
                            <p className={styles.currentWork}>
                                <strong>{language === 'pt' ? 'Atualmente em:' : 'Currently at:'}</strong> {member.current_workplace}
                            </p>
                        )}
                        <p className={styles.bio}>
                            {(() => {
                                const bio = language === 'pt' ? (member.bio_pt || '') : (member.bio_en || '');
                                if (bio.length > 150) {
                                    return (
                                        <>
                                            {bio.substring(0, 150)}...
                                            <Link to={`/members/${member.id}`} style={{ color: 'var(--color-primary)', marginLeft: '8px', fontWeight: 500, textDecoration: 'none' }}>
                                                {language === 'pt' ? 'Ver mais' : 'See more'}
                                            </Link>
                                        </>
                                    );
                                }
                                return bio;
                            })()}
                        </p>

                        <div className={styles.socialLinks}>
                            {member.lattes && (
                                <a href={member.lattes} target="_blank" rel="noopener noreferrer" title="Lattes">
                                    <FileText size={18} />
                                </a>
                            )}
                            {member.linkedin && (
                                <a href={member.linkedin} target="_blank" rel="noopener noreferrer" title="LinkedIn">
                                    <Linkedin size={18} />
                                </a>
                            )}
                            {member.orcid && (
                                <a href={member.orcid} target="_blank" rel="noopener noreferrer" title="ORCID">
                                    <User size={18} />
                                </a>
                            )}
                            {member.google_scholar && (
                                <a href={member.google_scholar} target="_blank" rel="noopener noreferrer" title="Google Scholar">
                                    <GraduationCap size={18} />
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    if (loading) return <div className={styles.loader}>Loading team...</div>;
    if (error) return <div className="container section"><p className="text-error">Error loading members: {error}</p></div>;

    return (
        <div className="container section">
            <h1>{t('nav.members')}</h1>

            {pi.length > 0 && (
                <section>
                    <h2 className={styles.sectionTitle}>Principal Investigator</h2>
                    {renderGrid(pi)}
                </section>
            )}

            {current.length > 0 && (
                <section>
                    <h2 className={styles.sectionTitle}>Current Members</h2>
                    {renderGrid(current)}
                </section>
            )}

            {alumni.length > 0 && (
                <section>
                    <h2 className={styles.sectionTitle}>Alumni</h2>
                    {renderGrid(alumni)}
                </section>
            )}
        </div>
    );
};

export default Members;
