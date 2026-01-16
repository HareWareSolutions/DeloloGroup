import React, { useState } from 'react';
import { Edit, Trash, Search, Eye } from 'lucide-react';
import styles from './DataTable.module.css';

interface Column<T> {
    key: keyof T | 'actions';
    label: string;
    render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    onEdit?: (item: T) => void;
    onDelete?: (item: T) => void;
    onView?: (item: T) => void;
    filterPlaceholder?: string;
    filterKeys?: (keyof T)[];
}

function DataTable<T extends { id?: string | number }>({
    data,
    columns,
    onEdit,
    onDelete,
    onView,
    filterPlaceholder = "Search...",
    filterKeys,
    rowClassName
}: DataTableProps<T> & { rowClassName?: (item: T) => string }) {
    const [filter, setFilter] = useState('');

    const filteredData = data.filter(item => {
        if (!filter) return true;
        if (!filterKeys) return true;

        return filterKeys.some(key => {
            const val = item[key];
            return String(val).toLowerCase().includes(filter.toLowerCase());
        });
    });

    return (
        <div className={styles.container}>
            {filterKeys && (
                <div className={styles.filterBar}>
                    <div className={styles.searchWrapper}>
                        <Search size={18} className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder={filterPlaceholder}
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className={styles.searchInput}
                        />
                    </div>
                </div>
            )}

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            {columns.map((col, idx) => (
                                <th key={idx}>{col.label}</th>
                            ))}
                            {(onEdit || onDelete || onView) && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.length > 0 ? (
                            filteredData.map((item, idx) => (
                                <tr key={item.id || idx} className={rowClassName ? rowClassName(item) : ''}>
                                    {columns.map((col, cIdx) => (
                                        <td key={cIdx}>
                                            {col.render ? col.render(item) : String(item[col.key as keyof T] || '')}
                                        </td>
                                    ))}
                                    {(onEdit || onDelete || onView) && (
                                        <td className={styles.actionsCell}>
                                            <div className={styles.actions}>
                                                {onView && (
                                                    <button onClick={() => onView(item)} className={styles.actionBtn} title="View" aria-label="View">
                                                        <Eye size={16} />
                                                    </button>
                                                )}
                                                {onEdit && (
                                                    <button onClick={() => onEdit(item)} className={styles.actionBtn} title="Edit" aria-label="Edit">
                                                        <Edit size={16} />
                                                    </button>
                                                )}
                                                {onDelete && (
                                                    <button onClick={() => onDelete(item)} className={`${styles.actionBtn} ${styles.deleteBtn}`} title="Delete" aria-label="Delete">
                                                        <Trash size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length + 1} className={styles.empty}>No records found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default DataTable;
