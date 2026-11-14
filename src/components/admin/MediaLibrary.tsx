import React, { useState, useEffect } from 'react';
import { X, Upload } from 'lucide-react';
import { API_BASE_URL } from '../../api';
import styles from './MediaLibrary.module.css';

interface MediaLibraryProps {
    onSelect?: (url: string) => void;
    onClose: () => void;
    isModal?: boolean;
}

interface MediaFile {
    name: string;
    url: string;
}

const MediaLibrary: React.FC<MediaLibraryProps> = ({ onSelect, onClose, isModal = true }) => {
    const [images, setImages] = useState<MediaFile[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('authToken');
            const res = await fetch(`${API_BASE_URL}/api/media`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setImages(data);
            }
        } catch (error) {
            console.error('Failed to load images', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        setUploading(true);

        const formData = new FormData();
        formData.append('image', e.target.files[0]);

        try {
            const token = localStorage.getItem('authToken');
            const res = await fetch(`${API_BASE_URL}/api/upload`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData
            });
            if (res.ok) {
                fetchImages(); // Refresh list
            }
        } catch (error) {
            console.error('Upload failed', error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className={isModal ? styles.modalOverlay : styles.container}>
            <div className={isModal ? styles.modalContent : styles.content}>
                <div className={styles.header}>
                    <h3>Media Library</h3>
                    {isModal && <button onClick={onClose} className={styles.closeBtn}><X /></button>}
                </div>

                <div className={styles.toolbar}>
                    <label className={styles.uploadBtn}>
                        <Upload size={16} /> Upload Image
                        <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} hidden />
                    </label>
                </div>

                <div className={styles.grid}>
                    {images.map((img) => (
                        <div key={img.name} className={styles.imageCard} onClick={() => onSelect && onSelect(img.url)}>
                            <img src={`${API_BASE_URL}${img.url}`} alt={img.name} />
                            <div className={styles.imageOverlay}>
                                <span>Select</span>
                            </div>
                        </div>
                    ))}
                    {loading && <p>Loading media...</p>}
                    {!loading && images.length === 0 && <p>No images found.</p>}
                </div>
            </div>
        </div>
    );
};

export default MediaLibrary;
