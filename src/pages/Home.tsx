import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from './Home.module.css';

const Home: React.FC = () => {
    return (
        <div className={styles.home}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>
                        Advancing Chemistry for a <span className="text-secondary">Sustainable Future</span>
                    </h1>
                    <p className={styles.heroSubtitle}>
                        Delolo Research Group focuses on catalysis, green chemistry, and the transformation of scientific knowledge into global solutions.
                    </p>
                    <div className={styles.heroActions}>
                        <Link to="/research" className={styles.primaryButton}>
                            Explore Research
                        </Link>
                        <Link to="/publications" className={styles.secondaryButton}>
                            Our Publications <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
                <div className={styles.heroVisual}>
                    {/* Abstract molecule or lab glass placeholder */}
                    <div className={styles.abstractShape}></div>
                </div>
            </section>

            {/* Featured Research Preview */}
            <section className={`${styles.section} ${styles.researchPreview}`}>
                <div className="container">
                    <div className="text-center">
                        <h2 className="section-title">Scientific Focus</h2>
                        <p className="section-desc">Pioneering new pathways in catalytic processes.</p>
                    </div>

                    <div className="scientific-grid">
                        <div className={`glass-panel ${styles.featureCard}`}>
                            <h3>Catalysis</h3>
                            <p>Developing novel catalysts for efficiency.</p>
                        </div>
                        <div className={`glass-panel ${styles.featureCard}`}>
                            <h3>Green Chemistry</h3>
                            <p>Sustainable processes for waste reduction.</p>
                        </div>
                        <div className={`glass-panel ${styles.featureCard}`}>
                            <h3>Material Science</h3>
                            <p>Innovative materials for industrial application.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Latest News Preview */}
            <section className={styles.section}>
                <div className="container">
                    <h2 className="section-title">Latest Updates</h2>
                    <div className={styles.newsGrid}>
                        {/* Mock news */}
                        <div className={styles.newsItem}>
                            <span className={styles.date}>Jan 15, 2026</span>
                            <h3>New paper published in Journal of Catalysis</h3>
                            <Link to="/news/1">Read more</Link>
                        </div>
                        <div className={styles.newsItem}>
                            <span className={styles.date}>Dec 10, 2025</span>
                            <h3>Prof. Delolo awarded specifically...</h3>
                            <Link to="/news/2">Read more</Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
