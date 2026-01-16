import React, { useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from '../../pages/admin/Admin.module.css';

const AdminLayout: React.FC = () => {
    const { isAuthenticated, logout, user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/admin/login');
        }
    }, [isAuthenticated, navigate]);

    if (!isAuthenticated) return null;

    return (
        <div className={styles.dashboardLayout}>
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <img src="/logo.png" alt="Delolo Admin" className={styles.sidebarLogo} />
                </div>

                <nav className={styles.sidebarNav}>
                    <ul>
                        <li>
                            <Link
                                to="/admin/dashboard"
                                className={`${styles.sidebarLink} ${location.pathname === '/admin/dashboard' ? styles.sidebarLinkActive : ''}`}
                            >
                                Dashboard
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/admin/members"
                                className={`${styles.sidebarLink} ${location.pathname.includes('members') ? styles.sidebarLinkActive : ''}`}
                            >
                                Members
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/admin/publications"
                                className={`${styles.sidebarLink} ${location.pathname.includes('publications') ? styles.sidebarLinkActive : ''}`}
                            >
                                Publications
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/admin/news"
                                className={`${styles.sidebarLink} ${location.pathname.includes('news') ? styles.sidebarLinkActive : ''}`}
                            >
                                News
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/admin/candidates"
                                className={`${styles.sidebarLink} ${location.pathname.includes('candidates') ? styles.sidebarLinkActive : ''}`}
                            >
                                Candidates
                            </Link>
                        </li>
                    </ul>
                </nav>

                <div className={styles.userSection}>
                    <span style={{ fontSize: '0.9rem' }}>{user?.username}</span>
                    <button onClick={logout} className={styles.logoutBtn}>Logout</button>
                </div>
            </aside>

            <main className={styles.mainContent}>
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
