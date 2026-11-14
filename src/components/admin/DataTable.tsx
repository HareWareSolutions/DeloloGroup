import React, { useState, useEffect } from 'react';
import { Edit, Trash, Search, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
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
    enableSelection?: boolean;
    onSelectionChange?: (selectedIds: (string | number)[]) => void;
    itemsPerPage?: number;
    rowClassName?: (item: T) => string;
}

function DataTable<T extends { id?: string | number }>({
    data,
    columns,
    onEdit,
    onDelete,
    onView,
    filterPlaceholder = "Search...",
    filterKeys,
    enableSelection = false,
    onSelectionChange,
    itemsPerPage = 10,
    rowClassName
}: DataTableProps<T>) {
    const [filter, setFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selected, setSelected] = useState<Set<string | number>>(new Set());

    // Reset page and selection when filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [filter]);

    const filteredData = data.filter(item => {
        if (!filter) return true;
        if (!filterKeys) return true;

        return filterKeys.some(key => {
            const val = item[key];
            return String(val).toLowerCase().includes(filter.toLowerCase());
        });
    });

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            const allIds = new Set(filteredData.map(item => item.id!));
            setSelected(allIds);
            onSelectionChange?.(Array.from(allIds));
        } else {
            setSelected(new Set());
            onSelectionChange?.([]);
        }
    };

    const handleSelectRow = (id: string | number) => {
        const newSelected = new Set(selected);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelected(newSelected);
        onSelectionChange?.(Array.from(newSelected));
    };

    const isAllSelected = filteredData.length > 0 && selected.size === filteredData.length;
    const isIndeterminate = selected.size > 0 && selected.size < filteredData.length;

    return (
        <div className={styles.container}>
            <div className={styles.filterBar}>
                {filterKeys && (
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
                )}
                {/* Could add more filters here later */}
            </div>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            {enableSelection && (
                                <th style={{ width: '1%' }}>
                                    <input
                                        type="checkbox"
                                        checked={isAllSelected}
                                        ref={input => { if (input) input.indeterminate = isIndeterminate; }}
                                        onChange={handleSelectAll}
                                    />
                                </th>
                            )}
                            {columns.map((col, idx) => (
                                <th key={idx}>{col.label}</th>
                            ))}
                            {(onEdit || onDelete || onView) && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.length > 0 ? (
                            paginatedData.map((item, idx) => (
                                <tr key={item.id || idx} className={rowClassName ? rowClassName(item) : ''}>
                                    {enableSelection && (
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={selected.has(item.id!)}
                                                onChange={() => handleSelectRow(item.id!)}
                                            />
                                        </td>
                                    )}
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
                                <td colSpan={columns.length + (enableSelection ? 2 : 1)} className={styles.empty}>No records found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className={styles.pagination}>
                    <div>
                        Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} entries
                    </div>
                    <div className={styles.pageControls}>
                        <button
                            className={styles.pageBtn}
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <span className={styles.pageInfo}>Page {currentPage} of {totalPages}</span>
                        <button
                            className={styles.pageBtn}
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DataTable;
