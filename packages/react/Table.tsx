import React, { useState, useEffect, useRef } from 'react';
import { FormControlSize, FormControlShape, FormControlColor } from './FormControls';
import { usePrefix } from './PrefixContext';
import { cn, cnEl } from './cn';

export interface Column<T> {
  key: string;
  header: React.ReactNode;
  sortable?: boolean;
  editable?: boolean;
  align?: 'left' | 'center' | 'right';
  render?: (row: T, value: any, rowIndex: number) => React.ReactNode;
}

export interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  rowKey: (row: T) => string | number;
  
  // Sorting (Controlled)
  sortField?: string;
  sortOrder?: 'asc' | 'desc' | '';
  onSort?: (field: string, order: 'asc' | 'desc' | '') => void;
  
  // Selection
  selectedRowIds?: (string | number)[];
  onSelectionChange?: (selectedIds: (string | number)[]) => void;
  
  // Inline cell editing
  onCellEdit?: (rowId: string | number, columnKey: string, newValue: any) => void;
  
  // Styling
  size?: FormControlSize;
  color?: FormControlColor;
  
  // Loading & Empty States
  isLoading?: boolean;
  loadingRowsCount?: number;
  emptyState?: React.ReactNode;
  
  // Additional classes
  className?: string;
}

interface EditingCell {
  rowId: string | number;
  columnKey: string;
  value: string;
}

export function Table<T>({
  data,
  columns,
  rowKey,
  sortField,
  sortOrder,
  onSort,
  selectedRowIds,
  onSelectionChange,
  onCellEdit,
  size = 'md',
  color = 'mauve',
  isLoading = false,
  loadingRowsCount = 5,
  emptyState = 'Nenhum registro encontrado.',
  className = '',
}: TableProps<T>) {
  const prefix = usePrefix();
  
  // Inline edit state
  const [editingCell, setEditingCell] = useState<EditingCell | null>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  // Focus edit input when it opens
  useEffect(() => {
    if (editingCell && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingCell]);

  // Selection helpers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onSelectionChange) return;
    
    if (e.target.checked) {
      const allIds = data.map(row => rowKey(row));
      onSelectionChange(allIds);
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectRow = (rowId: string | number, checked: boolean) => {
    if (!onSelectionChange || !selectedRowIds) return;
    
    if (checked) {
      onSelectionChange([...selectedRowIds, rowId]);
    } else {
      onSelectionChange(selectedRowIds.filter(id => id !== rowId));
    }
  };

  const isRowSelected = (rowId: string | number) => {
    return selectedRowIds ? selectedRowIds.includes(rowId) : false;
  };

  const areAllRowsSelected = () => {
    if (data.length === 0) return false;
    return selectedRowIds ? data.every(row => selectedRowIds.includes(rowKey(row))) : false;
  };

  const isSomeRowsSelected = () => {
    if (data.length === 0 || !selectedRowIds) return false;
    const selectedCount = data.filter(row => selectedRowIds.includes(rowKey(row))).length;
    return selectedCount > 0 && selectedCount < data.length;
  };

  // Sorting helper
  const handleHeaderClick = (column: Column<T>) => {
    if (!column.sortable || !onSort) return;
    
    let nextOrder: 'asc' | 'desc' | '' = 'asc';
    
    if (sortField === column.key) {
      if (sortOrder === 'asc') {
        nextOrder = 'desc';
      } else if (sortOrder === 'desc') {
        nextOrder = ''; // Reset sort
      } else {
        nextOrder = 'asc';
      }
    }
    
    onSort(nextOrder === '' ? '' : column.key, nextOrder);
  };

  // Inline editing handlers
  const handleCellDoubleClick = (rowId: string | number, column: Column<T>, currentValue: any) => {
    if (!onCellEdit || !column.editable) return;
    setEditingCell({
      rowId,
      columnKey: column.key,
      value: String(currentValue),
    });
  };

  const handleInlineEditSave = () => {
    if (!editingCell || !onCellEdit) return;
    onCellEdit(editingCell.rowId, editingCell.columnKey, editingCell.value);
    setEditingCell(null);
  };

  const handleInlineEditKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleInlineEditSave();
    } else if (e.key === 'Escape') {
      setEditingCell(null);
    }
  };

  // CSS structure builder
  const containerClasses = [
    cn(prefix, 'table-container'),
    `${prefix}-table--${size}`,
    `${prefix}-table--${color}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const showCheckbox = !!onSelectionChange;

  return (
    <div className={containerClasses}>
      <table className={cn(prefix, 'table')}>
        <thead>
          <tr>
            {showCheckbox && (
              <th style={{ width: '40px', textAlign: 'center' }}>
                <input
                  type="checkbox"
                  className={`${prefix}-table-checkbox`}
                  checked={areAllRowsSelected()}
                  ref={el => {
                    if (el) {
                      el.indeterminate = isSomeRowsSelected();
                    }
                  }}
                  onChange={handleSelectAll}
                  aria-label="Selecionar todas as linhas"
                  disabled={isLoading}
                />
              </th>
            )}
            {columns.map(col => {
              const isSortedThis = sortField === col.key;
              const thClasses = [
                col.sortable ? `${prefix}-table-th--sortable` : '',
                isSortedThis ? `${prefix}-table-th--active` : '',
                col.align ? `${prefix}-table-cell--align-${col.align}` : `${prefix}-table-cell--align-left`,
                `${prefix}-table-th--key-${col.key}`
              ]
                .filter(Boolean)
                .join(' ');

              return (
                <th
                  key={col.key}
                  className={thClasses}
                  onClick={() => handleHeaderClick(col)}
                  style={{ cursor: col.sortable ? 'pointer' : 'default' }}
                >
                  <div className={`${prefix}-table-th-content`}>
                    {col.header}
                    {col.sortable && (
                      <span className={`${prefix}-table-sort-icon ${isSortedThis ? `${prefix}-table-sort-icon--active` : ''}`}>
                        {isSortedThis && sortOrder === 'asc' && (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="18 15 12 9 6 15" />
                          </svg>
                        )}
                        {isSortedThis && sortOrder === 'desc' && (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        )}
                        {(!isSortedThis || !sortOrder) && (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.4">
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        )}
                      </span>
                    )}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            // Skeleton loaders
            Array.from({ length: loadingRowsCount }).map((_, rIdx) => {
              const trClasses = [
                `${prefix}-table-skeleton-row`,
                rIdx === 0 ? `${prefix}-table-tr--first` : '',
                rIdx === loadingRowsCount - 1 ? `${prefix}-table-tr--last` : '',
              ]
                .filter(Boolean)
                .join(' ');

              return (
                <React.Fragment key={`skeleton-row-${rIdx}`}>
                  {rIdx === 0 && (
                    <tr className={`${prefix}-table-header-spacer`}>
                      <td colSpan={columns.length + (showCheckbox ? 1 : 0)}>
                        <div className={`${prefix}-table-header-spacer-inner`} />
                      </td>
                    </tr>
                  )}
                  <tr className={trClasses}>
                    {showCheckbox && (
                      <td style={{ textAlign: 'center' }}>
                        <div className={`${prefix}-table-skeleton-bar`} style={{ width: '16px', margin: '0 auto' }}></div>
                      </td>
                    )}
                    {columns.map(col => (
                      <td key={`skeleton-cell-${col.key}`} className={col.align ? `${prefix}-table-cell--align-${col.align}` : ''}>
                        <div className={`${prefix}-table-skeleton-bar`} style={{ width: col.align === 'right' ? '70%' : col.align === 'center' ? '50%' : '85%', marginLeft: col.align === 'right' ? 'auto' : col.align === 'center' ? 'auto' : '0', marginRight: col.align === 'center' ? 'auto' : '0' }}></div>
                      </td>
                    ))}
                  </tr>
                </React.Fragment>
              );
            })
          ) : data.length === 0 ? (
            // Empty State
            <tr>
              <td colSpan={columns.length + (showCheckbox ? 1 : 0)} className={`${prefix}-table-empty`}>
                {emptyState}
              </td>
            </tr>
          ) : (
            // Render actual rows
            data.map((row, rowIndex) => {
              const rId = rowKey(row);
              const isSelected = isRowSelected(rId);
              
              const trClasses = [
                isSelected ? `${prefix}-table-tr--selected` : '',
                rowIndex === 0 ? `${prefix}-table-tr--first` : '',
                rowIndex === data.length - 1 ? `${prefix}-table-tr--last` : '',
              ]
                .filter(Boolean)
                .join(' ');

              return (
                <React.Fragment key={rId}>
                  {rowIndex === 0 && (
                    <tr className={`${prefix}-table-header-spacer`}>
                      <td colSpan={columns.length + (showCheckbox ? 1 : 0)}>
                        <div className={`${prefix}-table-header-spacer-inner`} />
                      </td>
                    </tr>
                  )}
                  <tr className={trClasses}>
                    {showCheckbox && (
                      <td style={{ textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          className={`${prefix}-table-checkbox`}
                          checked={isSelected}
                          onChange={(e) => handleSelectRow(rId, e.target.checked)}
                          aria-label={`Selecionar linha ${rId}`}
                        />
                      </td>
                    )}
                    {columns.map(col => {
                      const rawValue = (row as any)[col.key];
                      const isEditingThisCell = editingCell && editingCell.rowId === rId && editingCell.columnKey === col.key;
                      
                      const cellAlignClass = col.align ? `${prefix}-table-cell--align-${col.align}` : `${prefix}-table-cell--align-left`;

                      return (
                        <td
                          key={col.key}
                          className={`${cellAlignClass} ${prefix}-table-cell--key-${col.key}`}
                          onDoubleClick={() => handleCellDoubleClick(rId, col, rawValue)}
                          title={col.editable ? 'Clique duas vezes para editar' : undefined}
                        >
                          {isEditingThisCell ? (
                            <input
                              ref={editInputRef}
                              type="text"
                              className={`${prefix}-table-inline-edit`}
                              value={editingCell.value}
                              onChange={(e) => setEditingCell({ ...editingCell, value: e.target.value })}
                              onBlur={handleInlineEditSave}
                              onKeyDown={handleInlineEditKeyDown}
                            />
                          ) : col.render ? (
                            col.render(row, rawValue, rowIndex)
                          ) : (
                            String(rawValue ?? '')
                          )}
                        </td>
                      );
                    })}
                  </tr>
                </React.Fragment>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
