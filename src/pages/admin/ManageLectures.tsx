import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { API_BASE_URL } from '../../api';
import { useAuth } from '../../context/AuthContext';

interface Lecture {
    id: number;
    year: string;
    institution: string;
    country?: string;
    country_pt?: string;
    country_en?: string;
    title?: string;
    title_pt?: string;
    title_en?: string;
}

const ManageLectures: React.FC = () => {
    const [lectures, setLectures] = useState<Lecture[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentLecture, setCurrentLecture] = useState<Partial<Lecture>>({});
    const { token } = useAuth();

    useEffect(() => {
        if (token) {
            fetchLectures();
        }
    }, [token]);

    const fetchLectures = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/lectures`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setLectures(data);
            }
        } catch (error) {
            console.error('Error fetching lectures:', error);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this lecture?')) {
            try {
                await fetch(`${API_BASE_URL}/api/lectures/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                fetchLectures();
            } catch (error) {
                console.error('Error deleting lecture:', error);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Prepare payload - ensure we send _pt and _en fields
        // Fallback: if _pt is empty, use legacy field or empty string
        const payload = {
            ...currentLecture,
            country_pt: currentLecture.country_pt || currentLecture.country || '',
            country_en: currentLecture.country_en || currentLecture.country || '',
            title_pt: currentLecture.title_pt || currentLecture.title || '',
            title_en: currentLecture.title_en || currentLecture.title || ''
        };

        const method = currentLecture.id ? 'PUT' : 'POST';
        const url = currentLecture.id
            ? `${API_BASE_URL}/api/lectures/${currentLecture.id}`
            : `${API_BASE_URL}/api/lectures`;

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setIsModalOpen(false);
                setCurrentLecture({});
                fetchLectures();
            } else {
                console.error('Failed to save lecture:', await res.text());
                alert('Failed to save lecture. Check console for details.');
            }
        } catch (error) {
            console.error('Error saving lecture:', error);
            alert('Error saving lecture.');
        }
    };

    const openEdit = (lecture: Lecture) => {
        // Pre-fill fields, using legacy values as defaults if new ones are missing
        setCurrentLecture({
            ...lecture,
            country_pt: lecture.country_pt || lecture.country,
            country_en: lecture.country_en || lecture.country,
            title_pt: lecture.title_pt || lecture.title,
            title_en: lecture.title_en || lecture.title
        });
        setIsModalOpen(true);
    };

    const openNew = () => {
        setCurrentLecture({});
        setIsModalOpen(true);
    };

    return (
        <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Manage Lectures (Fábio G. Delolo)</h1>
                <button
                    onClick={openNew}
                    style={{
                        background: '#166534', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem',
                        display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', border: 'none'
                    }}
                >
                    <Plus size={18} /> New Lecture
                </button>
            </div>

            <div style={{ background: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                        <tr>
                            <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>Year</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>Institution</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>Country (PT/EN)</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>Title (PT/EN)</th>
                            <th style={{ padding: '1rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lectures.map(lecture => (
                            <tr key={lecture.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                <td style={{ padding: '1rem' }}>{lecture.year}</td>
                                <td style={{ padding: '1rem' }}>{lecture.institution}</td>
                                <td style={{ padding: '1rem' }}>
                                    {lecture.country_pt || lecture.country} / {lecture.country_en || lecture.country}
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <div>PT: {lecture.title_pt || lecture.title}</div>
                                    <div style={{ color: '#6b7280', fontSize: '0.8em' }}>EN: {lecture.title_en || lecture.title}</div>
                                </td>
                                <td style={{ padding: '1rem', textAlign: 'right' }}>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                        <button onClick={() => openEdit(lecture)} style={{ background: '#dbeafe', color: '#2563eb', padding: '0.4rem', borderRadius: '0.25rem', border: 'none', cursor: 'pointer' }}>
                                            <Edit size={16} />
                                        </button>
                                        <button onClick={() => handleDelete(lecture.id)} style={{ background: '#fee2e2', color: '#dc2626', padding: '0.4rem', borderRadius: '0.25rem', border: 'none', cursor: 'pointer' }}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 50
                }}>
                    <div style={{ background: 'white', padding: '2rem', borderRadius: '0.5rem', width: '100%', maxWidth: '500px' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                            {currentLecture.id ? 'Edit Lecture' : 'New Lecture'}
                        </h2>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Year</label>
                                <input
                                    type="text"
                                    value={currentLecture.year || ''}
                                    onChange={e => setCurrentLecture({ ...currentLecture, year: e.target.value })}
                                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
                                    required
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Institution / Event</label>
                                <input
                                    type="text"
                                    value={currentLecture.institution || ''}
                                    onChange={e => setCurrentLecture({ ...currentLecture, institution: e.target.value })}
                                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
                                    required
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Country (PT)</label>
                                    <input
                                        type="text"
                                        value={currentLecture.country_pt || ''}
                                        onChange={e => setCurrentLecture({ ...currentLecture, country_pt: e.target.value })}
                                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
                                        placeholder="Brasil"
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Country (EN)</label>
                                    <input
                                        type="text"
                                        value={currentLecture.country_en || ''}
                                        onChange={e => setCurrentLecture({ ...currentLecture, country_en: e.target.value })}
                                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
                                        placeholder="Brazil"
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Title (PT)</label>
                                    <input
                                        type="text"
                                        value={currentLecture.title_pt || ''}
                                        onChange={e => setCurrentLecture({ ...currentLecture, title_pt: e.target.value })}
                                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
                                        placeholder="Título em Português"
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Title (EN)</label>
                                    <input
                                        type="text"
                                        value={currentLecture.title_en || ''}
                                        onChange={e => setCurrentLecture({ ...currentLecture, title_en: e.target.value })}
                                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
                                        placeholder="Title in English"
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    style={{ padding: '0.5rem 1rem', background: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '0.375rem', cursor: 'pointer' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    style={{ padding: '0.5rem 1rem', background: '#166534', color: 'white', border: 'none', borderRadius: '0.375rem', cursor: 'pointer' }}
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageLectures;
