import React, { useState, useEffect } from 'react';
import DataTable from '../../components/admin/DataTable';
import { Search, Filter, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Candidate {
    id: number;
    name: string;
    email: string;
    position: string;
    message: string;
    date: string;
}

const ManageCandidates: React.FC = () => {
    const { token, logout } = useAuth();
    const navigate = useNavigate();
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [positionFilter, setPositionFilter] = useState('All');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchCandidates();
    }, []);

    const fetchCandidates = () => {
        setLoading(true);
        setError(null);

        const authToken = token || localStorage.getItem('authToken');

        fetch('http://localhost:3001/api/candidates', {
            headers: { 'Authorization': `Bearer ${authToken}` }
        })
            .then(async res => {
                if (res.status === 401 || res.status === 403) {
                    logout();
                    navigate('/admin/login');
                    throw new Error("Session expired. Please login again.");
                }
                if (!res.ok) {
                    const txt = await res.text();
                    throw new Error(`Failed to fetch: ${res.status} ${txt}`);
                }
                return res.json();
            })
            .then(data => {
                if (Array.isArray(data)) {
                    setCandidates(data);
                } else {
                    console.error("Data is not array:", data);
                    setError("Received invalid data format");
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError(err.message);
                setLoading(false);
            });
    };

    const handleDelete = async (candidate: Candidate) => {
        if (!window.confirm('Are you sure you want to delete this candidate?')) return;

        const authToken = token || localStorage.getItem('authToken');
        try {
            const res = await fetch(`http://localhost:3001/api/candidates/${candidate.id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${authToken}` }
            });

            if (!res.ok) throw new Error('Failed to delete');

            setCandidates(prev => prev.filter(c => c.id !== candidate.id));
        } catch (err: any) {
            console.error(err);
            alert('Error deleting candidate: ' + err.message);
        }
    };

    const columns = [
        { key: 'date' as keyof Candidate, label: 'Date', render: (item: Candidate) => new Date(item.date).toLocaleDateString() },
        { key: 'name' as keyof Candidate, label: 'Name' },
        { key: 'email' as keyof Candidate, label: 'Email' },
        { key: 'position' as keyof Candidate, label: 'Position' },
        { key: 'message' as keyof Candidate, label: 'Message', render: (item: Candidate) => <div style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={item.message}>{item.message}</div> }
    ];

    const filteredData = candidates.filter(c => {
        const nameVal = (c.name || '').toLowerCase();
        const emailVal = (c.email || '').toLowerCase();
        const searchVal = search.toLowerCase();

        const matchSearch = nameVal.includes(searchVal) || emailVal.includes(searchVal);
        const matchPos = positionFilter === 'All' || c.position === positionFilter;
        return matchSearch && matchPos;
    });

    const positions = Array.from(new Set(candidates.map(c => c.position).filter(Boolean)));

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Manage Candidates</h1>
                <button
                    onClick={fetchCandidates}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: '#e5e7eb', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                    <RefreshCw size={16} /> Refresh
                </button>
            </div>

            {error && (
                <div style={{ padding: '1rem', background: '#fee2e2', color: '#991b1b', borderRadius: '4px', marginBottom: '1rem' }}>
                    Error: {error}
                </div>
            )}

            {/* Filters */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', minWidth: '250px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '10px', top: '10px', color: '#9ca3af' }} />
                    <input
                        type="text"
                        placeholder="Search name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.6rem 0.6rem 0.6rem 2.2rem',
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.375rem'
                        }}
                    />
                </div>

                <div style={{ position: 'relative', minWidth: '200px' }}>
                    <Filter size={18} style={{ position: 'absolute', left: '10px', top: '10px', color: '#9ca3af' }} />
                    <select
                        value={positionFilter}
                        onChange={(e) => setPositionFilter(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.6rem 0.6rem 0.6rem 2.2rem',
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.375rem',
                            background: 'white'
                        }}
                    >
                        <option value="All">All Positions</option>
                        {positions.map(p => (
                            <option key={p} value={p}>{p}</option>
                        ))}
                    </select>
                </div>
            </div>

            {loading ? (
                <div>Loading...</div>
            ) : (
                <DataTable
                    data={filteredData}
                    columns={columns}
                    onView={(item) => alert(`Message from ${item.name}:\n\n${item.message}`)}
                    onDelete={handleDelete}
                />
            )}
        </div>
    );
};

export default ManageCandidates;
