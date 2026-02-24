import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Mail, MapPin } from 'lucide-react';
import { API_BASE_URL } from '../api';
import styles from './Contact.module.css';

const Contact: React.FC = () => {
    const { t, language } = useLanguage();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        position: 'Mestrado',
        message: ''
    });
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

    const positions = [
        { value: 'Iniciação Científica', label: language === 'pt' ? 'Iniciação Científica' : 'Undergraduate Research' },
        { value: 'Mestrado', label: language === 'pt' ? 'Mestrado' : 'Master\'s Degree' },
        { value: 'Doutorado', label: language === 'pt' ? 'Doutorado' : 'PhD' },
        { value: 'Pós-Doutorado', label: language === 'pt' ? 'Pós-Doutorado' : 'Post-doc' },
        { value: 'Outro', label: language === 'pt' ? 'Outro' : 'Other' }
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');

        try {
            const res = await fetch(`${API_BASE_URL}/api/candidates`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setStatus('success');
                setFormData({ name: '', email: '', position: 'Mestrado', message: '' });
                setTimeout(() => setStatus('idle'), 5000);
            } else {
                setStatus('error');
            }
        } catch (err) {
            console.error(err);
            setStatus('error');
        }
    };

    return (
        <div className="container section">
            <h1>{t('nav.contact')}</h1>

            <div className={styles.container}>
                {/* Info Column */}
                <div className={styles.infoCol}>
                    <h2 className={styles.sectionTitle}>{language === 'pt' ? 'Fale Conosco' : 'Get in Touch'}</h2>
                    <p className={styles.text}>
                        {language === 'pt'
                            ? 'Estamos sempre em busca de pesquisadores talentosos para se juntar à nossa equipe. Se você tem interesse em nossa pesquisa, preencha o formulário.'
                            : 'We are always looking for talented researchers to join our team. If you are interested in our research, please fill out the form.'}
                    </p>

                    <div className={styles.contactDetails}>
                        <div className={styles.detailItem}>
                            <Mail size={20} color="var(--color-primary)" />
                            <span>fabiodelolo@hotmail.com</span>
                        </div>
                        <div className={styles.detailItem}>
                            <MapPin size={20} color="var(--color-primary)" />
                            <span>UFJF - Departamento de Química</span>
                        </div>
                    </div>
                </div>

                {/* Form Column */}
                <div className={styles.formCol}>
                    <h2 className={styles.sectionTitle}>{language === 'pt' ? 'Junte-se a Nós' : 'Join Us'}</h2>

                    {status === 'success' && (
                        <div className={styles.successMessage}>
                            {language === 'pt'
                                ? 'Mensagem enviada com sucesso! Entraremos em contato.'
                                : 'Message sent successfully! We will be in touch.'}
                        </div>
                    )}

                    {status === 'error' && (
                        <div className={styles.errorMessage}>
                            {language === 'pt'
                                ? 'Erro ao enviar mensagem. Tente novamente.'
                                : 'Error sending message. Please try again.'}
                        </div>
                    )}

                    <form className={styles.form} onSubmit={handleSubmit}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>{language === 'pt' ? 'Nome Completo' : 'Full Name'}</label>
                            <input
                                type="text"
                                className={styles.input}
                                required
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>{language === 'pt' ? 'Email' : 'Email'}</label>
                            <input
                                type="email"
                                className={styles.input}
                                required
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>{language === 'pt' ? 'Interesse' : 'Position of Interest'}</label>
                            <select
                                className={styles.select}
                                value={formData.position}
                                onChange={e => setFormData({ ...formData, position: e.target.value })}
                            >
                                {positions.map(p => (
                                    <option key={p.value} value={p.value}>{p.label}</option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>{language === 'pt' ? 'Mensagem / Carta de Motivação' : 'Message / Cover Letter'}</label>
                            <textarea
                                className={styles.textarea}
                                required
                                value={formData.message}
                                onChange={e => setFormData({ ...formData, message: e.target.value })}
                            />
                        </div>

                        <button
                            type="submit"
                            className={styles.submitBtn}
                            disabled={status === 'submitting'}
                        >
                            {status === 'submitting'
                                ? (language === 'pt' ? 'Enviando...' : 'Sending...')
                                : (language === 'pt' ? 'Enviar Candidatura' : 'Submit Application')}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
export default Contact;
