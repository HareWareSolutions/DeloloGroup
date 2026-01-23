import React, { useState, useEffect } from 'react';
import { Plus, Image as ImageIcon, RefreshCw } from 'lucide-react';
import styles from './ManageMembers.module.css'; // Reusing styles for now
import DataTable from '../../components/admin/DataTable';
import MediaLibrary from '../../components/admin/MediaLibrary';

interface Publication {
    id?: number;
    title_pt: string;
    title_en: string;
    journal: string;
    year: number;
    doi: string;
    authors: string;
    image_url?: string;
    volume?: string;
    pages?: string;
    pub_type?: string;
}

const ManagePublications: React.FC = () => {
    const [publications, setPublications] = useState<Publication[]>([]);
    const [editingPub, setEditingPub] = useState<Publication | null>(null);
    const [isViewOnly, setIsViewOnly] = useState(false);
    const [showMediaLibrary, setShowMediaLibrary] = useState(false);
    const [members, setMembers] = useState<any[]>([]);

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        try {
            const res = await fetch('http://localhost:3001/api/members');
            const data = await res.json();
            if (Array.isArray(data)) setMembers(data);
        } catch (err) {
            console.error(err);
        }
    };

    const addMemberAuthor = (memberName: string) => {
        if (!editingPub) return;
        const current = editingPub.authors || '';
        const separator = current.trim() ? ', ' : '';
        setEditingPub({ ...editingPub, authors: current + separator + memberName });
    };

    useEffect(() => {
        fetchPublications();
    }, []);

    const fetchPublications = async () => {
        try {
            const res = await fetch('http://localhost:3001/api/publications');
            const data = await res.json();
            if (Array.isArray(data)) {
                setPublications(data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (pub: Publication) => {
        if (!pub.id || !confirm(`Delete publication "${pub.title_en}"?`)) return;
        const token = localStorage.getItem('authToken');
        await fetch(`http://localhost:3001/api/publications/${pub.id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        });
        fetchPublications();
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingPub) return;

        const token = localStorage.getItem('authToken');
        const method = editingPub.id ? 'PUT' : 'POST';
        const url = editingPub.id
            ? `http://localhost:3001/api/publications/${editingPub.id}`
            : 'http://localhost:3001/api/publications';

        const res = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(editingPub)
        });

        if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            alert(`Failed to save: ${errData.error || res.statusText}`);
            return;
        }

        setEditingPub(null);
        fetchPublications();
    };

    const startNew = () => {
        setIsViewOnly(false);
        setEditingPub({
            title_pt: '',
            title_en: '',
            journal: '',
            year: new Date().getFullYear(),
            doi: '',
            authors: '',
            image_url: '',
            volume: '',
            pages: '',
            pub_type: 'Article'
        });
    };

    const columns = [
        { key: 'year', label: 'Year' },
        {
            key: 'image_url',
            label: 'Image',
            render: (p: Publication) => p.image_url ?
                <img src={`http://localhost:3001${p.image_url}`} alt="cover" style={{ height: 30 }} /> : null
        },
        { key: 'title_en', label: 'Title (EN)' },
        { key: 'journal', label: 'Journal' },
    ];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2>Manage Publications</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button className={styles.addBtn} onClick={fetchPublications} style={{ backgroundColor: '#6b7280' }}>
                        <RefreshCw size={16} /> Refresh
                    </button>
                    <button className={styles.addBtn} onClick={startNew}>
                        <Plus size={16} /> Add Publication
                    </button>
                </div>
            </div>

            <DataTable
                data={publications}
                columns={columns as any}
                onEdit={(p) => {
                    setIsViewOnly(false);
                    setEditingPub(p);
                }}
                onView={(p) => {
                    setIsViewOnly(true);
                    setEditingPub(p);
                }}
                onDelete={handleDelete}
                filterKeys={['title_en', 'title_pt', 'authors', 'journal']}
                filterPlaceholder="Search publications..."
            />

            {editingPub && (
                <div className={styles.modal}>
                    <form onSubmit={handleSave} className={styles.form}>
                        <div className={styles.modalHeader}>
                            <h3>{editingPub.id ? 'Edit Publication' : 'New Publication'}</h3>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Title (English)</label>
                            <textarea
                                value={editingPub.title_en}
                                onChange={e => setEditingPub({ ...editingPub, title_en: e.target.value })}
                                required
                                rows={2}
                                disabled={isViewOnly}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Title (Portuguese)</label>
                            <textarea
                                value={editingPub.title_pt}
                                onChange={e => setEditingPub({ ...editingPub, title_pt: e.target.value })}
                                rows={2}
                                disabled={isViewOnly}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Cover Image (Optional)</label>
                            <div className={styles.imageInput}>
                                <input
                                    value={editingPub.image_url || ''}
                                    onChange={e => setEditingPub({ ...editingPub, image_url: e.target.value })}
                                    placeholder="/uploads/..."
                                    disabled={isViewOnly}
                                />
                                <button type="button" onClick={() => setShowMediaLibrary(true)} disabled={isViewOnly}>
                                    <ImageIcon size={16} /> Choose
                                </button>
                            </div>
                        </div>


                        <div className={styles.formGroup}>
                            <label>Authors</label>
                            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                <select
                                    onChange={(e) => {
                                        if (e.target.value) addMemberAuthor(e.target.value);
                                        e.target.value = '';
                                    }}
                                    className={styles.select}
                                    style={{ padding: '0.5rem', flex: 1 }}
                                >
                                    <option value="">+ Add Member as Author</option>
                                    {members.map(m => (
                                        <option key={m.id} value={m.name}>{m.name}</option>
                                    ))}
                                </select>
                            </div>
                            <textarea
                                value={editingPub.authors}
                                onChange={e => setEditingPub({ ...editingPub, authors: e.target.value })}
                                rows={2}
                                placeholder="Authors will appear here..."
                            />
                        </div>

                        <div className={styles.row}>
                            <div className={styles.formGroup}>
                                <label>Journal</label>
                                <input
                                    value={editingPub.journal}
                                    onChange={e => setEditingPub({ ...editingPub, journal: e.target.value })}
                                />
                            </div>
                            <div className={styles.formGroup} style={{ flex: '0 0 100px' }}>
                                <label>Year</label>
                                <input
                                    type="number"
                                    value={editingPub.year}
                                    onChange={e => setEditingPub({ ...editingPub, year: parseInt(e.target.value) })}
                                />
                            </div>
                        </div>

                        <div className={styles.row}>
                            <div className={styles.formGroup}>
                                <label>Type</label>
                                <select
                                    value={editingPub.pub_type || 'Article'}
                                    onChange={e => setEditingPub({ ...editingPub, pub_type: e.target.value })}
                                    className={styles.select}
                                >
                                    <option value="Article">Article</option>
                                    <option value="Book">Book</option>
                                    <option value="Patent">Patent</option>
                                    <option value="Cover">Cover</option>
                                    <option value="Conference">Conference</option>
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Volume</label>
                                <input
                                    value={editingPub.volume || ''}
                                    onChange={e => setEditingPub({ ...editingPub, volume: e.target.value })}
                                    placeholder="e.g. 42"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Pages</label>
                                <input
                                    value={editingPub.pages || ''}
                                    onChange={e => setEditingPub({ ...editingPub, pages: e.target.value })}
                                    placeholder="e.g. 100-112"
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label>DOI</label>
                            <input
                                value={editingPub.doi}
                                onChange={e => setEditingPub({ ...editingPub, doi: e.target.value })}
                                placeholder="10.1000/xyz123"
                            />
                        </div>

                        <div className={styles.modalActions}>
                            <button type="button" onClick={() => setEditingPub(null)}>{isViewOnly ? 'Close' : 'Cancel'}</button>
                            {!isViewOnly && <button type="submit" className={styles.saveBtn}>Save</button>}
                        </div>
                    </form>
                </div>
            )}

            {showMediaLibrary && (
                <MediaLibrary
                    onClose={() => setShowMediaLibrary(false)}
                    onSelect={(url) => {
                        if (editingPub) setEditingPub({ ...editingPub, image_url: url });
                        setShowMediaLibrary(false);
                    }}
                />
            )}
        </div>
    );
};

export default ManagePublications;
