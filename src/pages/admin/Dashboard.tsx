import React from 'react';
import styles from './Admin.module.css';
import { API_BASE_URL } from '../../api';

const Dashboard: React.FC = () => {
    const [counts, setCounts] = React.useState({ members: 0, publications: 0, news: 0, candidates: 0 });

    React.useEffect(() => {
        const fetchStats = async () => {
            try {
                const [membersRes, pubsRes, newsRes, candRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/api/members`),
                    fetch(`${API_BASE_URL}/api/publications`),
                    fetch(`${API_BASE_URL}/api/news`),
                    fetch(`${API_BASE_URL}/api/candidates`, {
                        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                    })
                ]);

                const members = await membersRes.json();
                const pubs = await pubsRes.json();
                const news = await newsRes.json();
                const candidates = candRes.ok ? await candRes.json() : [];

                setCounts({
                    members: Array.isArray(members) ? members.length : 0,
                    publications: Array.isArray(pubs) ? pubs.length : 0,
                    news: Array.isArray(news) ? news.length : 0,
                    candidates: Array.isArray(candidates) ? candidates.length : 0
                });
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            }
        };

        fetchStats();
    }, []);

    const stats = [
        { label: 'Total Members', value: counts.members },
        { label: 'Publications', value: counts.publications },
        { label: 'News Articles', value: counts.news },
        { label: 'Candidates', value: counts.candidates },
    ];

    return (
        <div>
            <div className={styles.pageHeader}>
                <h1>Dashboard</h1>
            </div>

            <div className={styles.cardGrid}>
                {stats.map((stat, index) => (
                    <div key={index} className={styles.statCard}>
                        <span className={styles.statLabel}>{stat.label}</span>
                        <span className={styles.statValue}>{stat.value}</span>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: '3rem', padding: '2rem', background: 'white', borderRadius: '8px' }}>
                <h3>Welcome to Delolo Research Group Admin Panel</h3>
                <p style={{ color: '#666', marginTop: '0.5rem' }}>
                    Select a module from the sidebar to manage content.
                </p>
            </div>
        </div>
    );
};

export default Dashboard;
