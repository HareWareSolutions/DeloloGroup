import React, { useState, useEffect } from 'react';
import { Plus, Image as ImageIcon, RefreshCw } from 'lucide-react';
import styles from './ManageMembers.module.css';
import MediaLibrary from '../../components/admin/MediaLibrary';
import { API_BASE_URL } from '../../api';
import DataTable from '../../components/admin/DataTable';

interface Member {
    id?: number;
    name: string;
    role_pt: string;
    role_en: string;
    bio_pt: string;
    bio_en: string;
    image_url: string;
    type: 'current' | 'alumni' | 'pi';
    email?: string;
    lattes?: string;
    linkedin?: string;
    orcid?: string;
    google_scholar?: string;
    current_workplace?: string;
    supervision_type?: 'advisor' | 'co_advisor';
}

const ManageMembers: React.FC = () => {
    const [members, setMembers] = useState<Member[]>([]);
    const [editingMember, setEditingMember] = useState<Member | null>(null);
    const [isViewOnly, setIsViewOnly] = useState(false);
    const [showMediaLibrary, setShowMediaLibrary] = useState(false);

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/members`);
            const data = await res.json();
            if (Array.isArray(data)) {
                setMembers(data);
            } else {
                console.error("API Error ManageMembers:", data);
                // Optionally handle error UI
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (member: Member) => {
        if (!member.id || !confirm(`Are you sure you want to delete ${member.name}?`)) return;
        const token = localStorage.getItem('authToken');
        await fetch(`${API_BASE_URL}/api/members/${member.id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        });
        fetchMembers();
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingMember) return;

        const token = localStorage.getItem('authToken');
        console.log("Token being used for save:", token); // Debug log

        const method = editingMember.id ? 'PUT' : 'POST';
        const url = editingMember.id
            ? `${API_BASE_URL}/api/members/${editingMember.id}`
            : `${API_BASE_URL}/api/members`;

        const res = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(editingMember)
        });

        if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            alert(`Failed to save: ${errData.error || res.statusText}`);
            console.error("Save error", errData);
            return;
        }

        setEditingMember(null);
        fetchMembers();
    };

    const startNew = () => {
        setIsViewOnly(false);
        setEditingMember({
            name: '',
            role_pt: '',
            role_en: '',
            bio_pt: '',
            bio_en: '',
            image_url: '',
            email: '',
            type: 'current',
            supervision_type: 'advisor',
            lattes: '',
            linkedin: '',
            orcid: '',
            google_scholar: '',
            current_workplace: ''
        });
    };

    const columns = [
        {
            key: 'image_url',
            label: 'Photo',
            render: (m: Member) => (
                <img
                    src={m.image_url ? `${API_BASE_URL}${m.image_url}` : '/placeholder.png'}
                    alt=""
                    style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}
                />
            )
        },
        { key: 'name', label: 'Name' },
        { key: 'role_en', label: 'Role' },
        { key: 'type', label: 'Type', render: (m: Member) => <span className={styles.badge}>{m.type}</span> },
        {
            key: 'supervision_type',
            label: 'Supervision',
            render: (m: Member) => (
                <span style={{
                    fontSize: '0.8rem',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: m.supervision_type === 'advisor' ? '#ecfdf5' : '#fffbeb',
                    color: m.supervision_type === 'advisor' ? '#065f46' : '#92400e'
                }}>
                    {m.supervision_type === 'advisor' ? 'Advisor' : 'Co-Advisor'}
                </span>
            )
        },
    ];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2>Manage Members</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button className={styles.addBtn} onClick={fetchMembers} style={{ backgroundColor: '#6b7280' }}>
                        <RefreshCw size={16} /> Refresh
                    </button>
                    <button className={styles.addBtn} onClick={startNew}>
                        <Plus size={16} /> Add Member
                    </button>
                </div>
            </div>

            <DataTable
                data={members}
                columns={columns as any}
                onEdit={(m) => {
                    setIsViewOnly(false);
                    setEditingMember(m);
                }}
                onView={(m) => {
                    setIsViewOnly(true);
                    setEditingMember(m);
                }}
                onDelete={handleDelete}
                filterKeys={['name', 'role_en']}
                filterPlaceholder="Search members..."
            />

            {editingMember && (
                <div className={styles.modal}>
                    <form onSubmit={handleSave} className={styles.form}>
                        <div className={styles.modalHeader}>
                            <h3>{editingMember.id ? 'Edit Member' : 'New Member'}</h3>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Name</label>
                            <input
                                value={editingMember.name}
                                onChange={e => setEditingMember({ ...editingMember, name: e.target.value })}
                                required
                                disabled={isViewOnly}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Email</label>
                            <input
                                type="email"
                                value={editingMember.email || ''}
                                onChange={e => setEditingMember({ ...editingMember, email: e.target.value })}
                                disabled={isViewOnly}
                                placeholder="member@example.com"
                            />
                        </div>

                        <div className={styles.row}>
                            <div className={styles.formGroup}>
                                <label>Role (EN)</label>
                                <input
                                    value={editingMember.role_en}
                                    onChange={e => setEditingMember({ ...editingMember, role_en: e.target.value })}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Role (PT)</label>
                                <input
                                    value={editingMember.role_pt}
                                    onChange={e => setEditingMember({ ...editingMember, role_pt: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Photo</label>
                            <div className={styles.imageInput}>
                                <input
                                    value={editingMember.image_url}
                                    onChange={e => setEditingMember({ ...editingMember, image_url: e.target.value })}
                                    placeholder="/uploads/..."
                                />
                                <button type="button" onClick={() => setShowMediaLibrary(true)} disabled={isViewOnly}>
                                    <ImageIcon size={16} /> Choose
                                </button>
                            </div>
                        </div>

                        <div className={styles.row}>
                            <div className={styles.formGroup}>
                                <label>Type</label>
                                <select
                                    value={editingMember.type}
                                    onChange={e => setEditingMember({ ...editingMember, type: e.target.value as any })}
                                >
                                    <option value="current">Current Member</option>
                                    <option value="alumni">Alumni</option>
                                    <option value="pi">Principal Investigator</option>
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Supervision</label>
                                <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'normal' }}>
                                        <input
                                            type="radio"
                                            name="supervision_type"
                                            value="advisor"
                                            checked={editingMember.supervision_type !== 'co_advisor'} // Default to advisor if null
                                            onChange={() => setEditingMember({ ...editingMember, supervision_type: 'advisor' })}
                                        />
                                        Advisor (Orientação)
                                    </label>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'normal' }}>
                                        <input
                                            type="radio"
                                            name="supervision_type"
                                            value="co_advisor"
                                            checked={editingMember.supervision_type === 'co_advisor'}
                                            onChange={() => setEditingMember({ ...editingMember, supervision_type: 'co_advisor' })}
                                        />
                                        Co-Advisor (Coorientação)
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Bio (PT)</label>
                            <textarea
                                value={editingMember.bio_pt}
                                onChange={e => setEditingMember({ ...editingMember, bio_pt: e.target.value })}
                                rows={3}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Bio (English)</label>
                            <textarea
                                value={editingMember.bio_en}
                                onChange={e => setEditingMember({ ...editingMember, bio_en: e.target.value })}
                                rows={3}
                            />
                        </div>

                        {editingMember.type === 'alumni' && (
                            <div className={styles.formGroup}>
                                <label>Current Work/Destination</label>
                                <input
                                    value={editingMember.current_workplace || ''}
                                    onChange={e => setEditingMember({ ...editingMember, current_workplace: e.target.value })}
                                    placeholder="e.g. Postdoc at University X"
                                />
                            </div>
                        )}

                        <div className={styles.sectionDivider}>Professional Links</div>

                        <div className={styles.row}>
                            <div className={styles.formGroup}>
                                <label>Lattes URL</label>
                                <input
                                    value={editingMember.lattes || ''}
                                    onChange={e => setEditingMember({ ...editingMember, lattes: e.target.value })}
                                    placeholder="http://lattes.cnpq.br/..."
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>LinkedIn URL</label>
                                <input
                                    value={editingMember.linkedin || ''}
                                    onChange={e => setEditingMember({ ...editingMember, linkedin: e.target.value })}
                                    placeholder="https://linkedin.com/in/..."
                                />
                            </div>
                        </div>

                        <div className={styles.row}>
                            <div className={styles.formGroup}>
                                <label>ORCID URL</label>
                                <input
                                    value={editingMember.orcid || ''}
                                    onChange={e => setEditingMember({ ...editingMember, orcid: e.target.value })}
                                    placeholder="https://orcid.org/..."
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Google Scholar URL</label>
                                <input
                                    value={editingMember.google_scholar || ''}
                                    onChange={e => setEditingMember({ ...editingMember, google_scholar: e.target.value })}
                                    placeholder="https://scholar.google.com/..."
                                />
                            </div>
                        </div>

                        <div className={styles.modalActions}>
                            <button type="button" onClick={() => setEditingMember(null)}>{isViewOnly ? 'Close' : 'Cancel'}</button>
                            {!isViewOnly && <button type="submit" className={styles.saveBtn}>Save</button>}
                        </div>
                    </form>
                </div>
            )}

            {showMediaLibrary && (
                <MediaLibrary
                    onClose={() => setShowMediaLibrary(false)}
                    onSelect={(url) => {
                        if (editingMember) setEditingMember({ ...editingMember, image_url: url });
                        setShowMediaLibrary(false);
                    }}
                />
            )}
        </div>
    );
};

export default ManageMembers;
