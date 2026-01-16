import React, { useState, useEffect } from 'react';
import { Plus, Image as ImageIcon, RefreshCw } from 'lucide-react';
import styles from './ManageMembers.module.css'; // Reusing styles
import DataTable from '../../components/admin/DataTable';
import MediaLibrary from '../../components/admin/MediaLibrary';

interface NewsItem {
    id?: number;
    title_pt: string;
    title_en: string;
    content_pt: string;
    content_en: string;
    date: string;
    image_url: string;
    category?: string;
    status: 'draft' | 'published';
}

const ManageNews: React.FC = () => {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
    const [isViewOnly, setIsViewOnly] = useState(false);
    const [showMediaLibrary, setShowMediaLibrary] = useState(false);

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        try {
            const res = await fetch('http://localhost:3001/api/news');
            const data = await res.json();
            setNews(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (item: NewsItem) => {
        if (!item.id || !confirm(`Delete news item "${item.title_en}"?`)) return;
        const token = localStorage.getItem('authToken');
        await fetch(`http://localhost:3001/api/news/${item.id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        });
        fetchNews();
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingNews) return;

        const token = localStorage.getItem('authToken');
        const method = editingNews.id ? 'PUT' : 'POST';
        const url = editingNews.id
            ? `http://localhost:3001/api/news/${editingNews.id}`
            : 'http://localhost:3001/api/news';

        const res = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(editingNews)
        });

        if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            alert(`Failed to save: ${errData.error || res.statusText}`);
            return;
        }

        setEditingNews(null);
        fetchNews();
    };

    const startNew = () => {
        setIsViewOnly(false);
        setEditingNews({
            title_pt: '',
            title_en: '',
            content_pt: '',
            content_en: '',
            date: new Date().toISOString().split('T')[0],
            image_url: '',
            category: 'Novo membro',
            status: 'draft'
        });
    };

    const columns = [
        { key: 'date', label: 'Date' },
        { key: 'title_en', label: 'Title (EN)' },
        { key: 'title_pt', label: 'Title (PT)' },
    ];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2>Manage News</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button className={styles.addBtn} onClick={fetchNews} style={{ backgroundColor: '#6b7280' }}>
                        <RefreshCw size={16} /> Refresh
                    </button>
                    <button className={styles.addBtn} onClick={startNew}>
                        <Plus size={16} /> Add News
                    </button>
                </div>
            </div>

            <DataTable
                data={news}
                columns={columns as any}
                onEdit={(n) => {
                    setIsViewOnly(false);
                    setEditingNews(n);
                }}
                onView={(n) => {
                    setIsViewOnly(true);
                    setEditingNews(n);
                }}
                onDelete={handleDelete}
                filterKeys={['title_en', 'title_pt', 'date']}
                filterPlaceholder="Search news..."
                rowClassName={(item) => item.status === 'draft' ? styles.draftRow : ''}
            />

            {editingNews && (
                <div className={styles.modal}>
                    <form onSubmit={handleSave} className={styles.form}>
                        <div className={styles.modalHeader}>
                            <h3>{editingNews.id ? 'Edit News' : 'New News'}</h3>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Date</label>
                            <input
                                type="date"
                                value={editingNews.date}
                                onChange={e => setEditingNews({ ...editingNews, date: e.target.value })}
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Title (EN)</label>
                            <input
                                value={editingNews.title_en}
                                onChange={e => setEditingNews({ ...editingNews, title_en: e.target.value })}
                                required
                                disabled={isViewOnly}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Title (PT)</label>
                            <input
                                value={editingNews.title_pt}
                                onChange={e => setEditingNews({ ...editingNews, title_pt: e.target.value })}
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Cover Image</label>
                            <div className={styles.imageInput}>
                                <input
                                    value={editingNews.image_url}
                                    onChange={e => setEditingNews({ ...editingNews, image_url: e.target.value })}
                                    placeholder="/uploads/..."
                                    disabled={isViewOnly}
                                />
                                <button type="button" onClick={() => setShowMediaLibrary(true)} disabled={isViewOnly}>
                                    <ImageIcon size={16} /> Choose
                                </button>
                            </div>
                        </div>

                        <div className={styles.row}>
                            <div className={styles.formGroup}>
                                <label>Category</label>
                                <select
                                    value={editingNews.category || 'Novo membro'}
                                    onChange={e => setEditingNews({ ...editingNews, category: e.target.value })}
                                    className={styles.select}
                                >
                                    <option value="Novo membro">Novo membro</option>
                                    <option value="Artigo publicado">Artigo publicado</option>
                                    <option value="Patente">Patente</option>
                                    <option value="Premiações">Premiações</option>
                                    <option value="Projeto aprovado">Projeto aprovado</option>
                                    <option value="Congresso/Evento">Congresso/Evento</option>
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Status</label>
                                <select
                                    value={editingNews.status || 'draft'}
                                    onChange={e => setEditingNews({ ...editingNews, status: e.target.value as any })}
                                    className={styles.select}
                                >
                                    <option value="draft">Rascunho</option>
                                    <option value="published">Publicado</option>
                                </select>
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Content (EN)</label>
                            <textarea
                                value={editingNews.content_en}
                                onChange={e => setEditingNews({ ...editingNews, content_en: e.target.value })}
                                rows={10}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Content (PT)</label>
                            <textarea
                                value={editingNews.content_pt}
                                onChange={e => setEditingNews({ ...editingNews, content_pt: e.target.value })}
                                rows={10}
                            />
                        </div>

                        <div className={styles.modalActions}>
                            <button type="button" onClick={() => setEditingNews(null)}>{isViewOnly ? 'Close' : 'Cancel'}</button>
                            {!isViewOnly && <button type="submit" className={styles.saveBtn}>Save</button>}
                        </div>
                    </form>
                </div >
            )}

            {
                showMediaLibrary && (
                    <MediaLibrary
                        onClose={() => setShowMediaLibrary(false)}
                        onSelect={(url) => {
                            if (editingNews) setEditingNews({ ...editingNews, image_url: url });
                            setShowMediaLibrary(false);
                        }}
                    />
                )
            }
        </div >
    );
};

export default ManageNews;
