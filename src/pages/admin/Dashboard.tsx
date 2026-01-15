import React from 'react';
import styles from './Admin.module.css';

const Dashboard: React.FC = () => {
    // In a real app we'd fetch these stats
    const stats = [
        { label: 'Total Members', value: 12 },
        { label: 'Publications', value: 45 },
        { label: 'News Articles', value: 8 },
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
