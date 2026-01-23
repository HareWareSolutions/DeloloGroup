import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { ArrowLeft, Linkedin, FileText, GraduationCap, User } from 'lucide-react';
import styles from './MemberProfile.module.css';

interface Member {
    id: number;
    name: string;
    role_pt: string;
    role_en: string;
    bio_pt: string;
    bio_en: string;
    image_url: string;
    type: 'pi' | 'current' | 'alumni';
    lattes?: string;
    linkedin?: string;
    orcid?: string;
    google_scholar?: string;
    current_workplace?: string;
    supervision_type?: 'advisor' | 'co_advisor';
}

const MemberProfile: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { language } = useLanguage();
    const [member, setMember] = useState<Member | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetch(`http://localhost:3001/api/members/${id}`)
            .then(res => {
                if (!res.ok) throw new Error('Member not found');
                return res.json();
            })
            .then(data => {
                setMember(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div className="container section">Loading...</div>;
    if (error || !member) return <div className="container section">Member not found</div>;

    return (
        <div className={styles.container}>
            <Link to="/members" className={styles.backLink}>
                <ArrowLeft size={20} />
                {language === 'pt' ? 'Voltar para Membros' : 'Back to Members'}
            </Link>

            <div className={styles.profileCard}>
                <div className={styles.imageContainer}>
                    <img
                        src={member.image_url ? `http://localhost:3001${member.image_url}` : '/placeholder.png'}
                        alt={member.name}
                        className={styles.image}
                    />
                </div>

                <div className={styles.info}>
                    <h1 className={styles.name}>{member.name}</h1>

                    {member.supervision_type && member.type !== 'pi' && (
                        <div style={{ marginBottom: '0.5rem' }}>
                            <span style={{
                                fontSize: '0.9rem',
                                fontWeight: 600,
                                padding: '4px 10px',
                                borderRadius: '4px',
                                backgroundColor: member.supervision_type === 'advisor' ? '#ecfdf5' : '#fffbeb',
                                color: member.supervision_type === 'advisor' ? '#065f46' : '#92400e',
                                textTransform: 'uppercase'
                            }}>
                                {member.supervision_type === 'advisor'
                                    ? (language === 'pt' ? 'Orientação' : 'Advisor')
                                    : (language === 'pt' ? 'Coorientação' : 'Co-Advisor')}
                            </span>
                        </div>
                    )}

                    <div className={styles.role}>
                        {language === 'pt' ? member.role_pt : member.role_en}
                    </div>

                    {member.type === 'alumni' && member.current_workplace && (
                        <div style={{ marginBottom: '1.5rem', color: '#666' }}>
                            <strong>{language === 'pt' ? 'Atualmente:' : 'Currently:'}</strong> {member.current_workplace}
                        </div>
                    )}

                    <div className={styles.bio}>
                        {language === 'pt' ? (member.bio_pt || 'Sem biografia disponível.') : (member.bio_en || 'No biography available.')}
                    </div>

                    <div className={styles.socialLinks}>
                        {member.lattes && (
                            <a href={member.lattes} target="_blank" rel="noopener noreferrer" className={styles.socialBtn}>
                                <FileText size={18} /> Lattes
                            </a>
                        )}
                        {member.linkedin && (
                            <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className={styles.socialBtn}>
                                <Linkedin size={18} /> LinkedIn
                            </a>
                        )}
                        {member.orcid && (
                            <a href={member.orcid} target="_blank" rel="noopener noreferrer" className={styles.socialBtn}>
                                <User size={18} /> ORCID
                            </a>
                        )}
                        {member.google_scholar && (
                            <a href={member.google_scholar} target="_blank" rel="noopener noreferrer" className={styles.socialBtn}>
                                <GraduationCap size={18} /> Google Scholar
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MemberProfile;
