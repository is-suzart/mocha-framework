import React, { useState, useMemo, useEffect } from 'react';
import { FormControlSize, FormControlColor } from './FormControls';
import { usePrefix } from './PrefixContext';
import { cn } from './cn';

export interface TreeColumn<T> {
  key: string;
  header: React.ReactNode;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  sortValue?: (row: T) => any;
  render?: (
    row: T,
    value: any,
    depth: number,
    isExpanded: boolean,
    hasChildren: boolean
  ) => React.ReactNode;
}

export interface TreeTableProps<T> {
  data: T[];
  columns: TreeColumn<T>[];
  rowKey: (row: T) => string | number;
  childrenKey?: string; // Default is 'children'

  // Sorting (Controlled or Uncontrolled)
  sortField?: string;
  sortOrder?: 'asc' | 'desc' | '';
  onSort?: (field: string, order: 'asc' | 'desc' | '') => void;

  // Expansion (Controlled or Uncontrolled)
  expandedRowIds?: (string | number)[];
  onExpandedRowsChange?: (expandedIds: (string | number)[]) => void;
  defaultExpanded?: boolean;
  defaultExpandedRowIds?: (string | number)[];

  // Selection (Controlled or Uncontrolled)
  selectedRowIds?: (string | number)[];
  onSelectionChange?: (selectedIds: (string | number)[]) => void;
  cascadeSelection?: boolean; // Default: true

  // Styling
  size?: FormControlSize;
  color?: FormControlColor;
  isLoading?: boolean;
  loadingRowsCount?: number;
  emptyState?: React.ReactNode;
  className?: string;

  // Search/Filter
  globalFilter?: string;
  globalFilterFields?: string[]; // Fields to inspect during filter
}

interface FlattenedTreeRow<T> {
  row: T;
  depth: number;
  hasChildren: boolean;
  isExpanded: boolean;
  parentId: string | number | null;
  path: (string | number)[];
}

// ---------------------------------------------------------------------------
// Helper Functions
// ---------------------------------------------------------------------------

// Get all child IDs recursively
function getAllChildIds<T>(
  node: T,
  childrenKey: string,
  rowKey: (row: T) => string | number
): (string | number)[] {
  const children = (node as any)[childrenKey] as T[] | undefined;
  if (!Array.isArray(children)) return [];
  const ids: (string | number)[] = [];
  for (const child of children) {
    ids.push(rowKey(child));
    ids.push(...getAllChildIds(child, childrenKey, rowKey));
  }
  return ids;
}

// Recursively filter tree data
function filterTreeData<T>(
  data: T[],
  query: string,
  childrenKey: string,
  rowKey: (row: T) => string | number,
  searchFields: string[]
): T[] {
  if (!query) return data;

  const lowercaseQuery = query.toLowerCase();

  const filterNode = (node: T): T | null => {
    const children = (node as any)[childrenKey] as T[] | undefined;
    let filteredChildren: T[] = [];
    if (Array.isArray(children)) {
      filteredChildren = children
        .map(child => filterNode(child))
        .filter(Boolean) as T[];
    }

    const selfMatches = searchFields.some(field => {
      const val = (node as any)[field];
      return (
        val !== undefined &&
        val !== null &&
        String(val).toLowerCase().includes(lowercaseQuery)
      );
    });

    if (selfMatches || filteredChildren.length > 0) {
      return {
        ...node,
        [childrenKey]: filteredChildren,
      };
    }

    return null;
  };

  return data.map(node => filterNode(node)).filter(Boolean) as T[];
}

// Recursively sort tree data
function sortTreeData<T>(
  data: T[],
  sortField: string,
  sortOrder: 'asc' | 'desc' | '',
  childrenKey: string,
  rowKey: (row: T) => string | number,
  columns: TreeColumn<T>[]
): T[] {
  if (!sortField || !sortOrder) return data;

  const sorted = [...data];
  const column = columns.find(c => c.key === sortField);

  sorted.sort((a: any, b: any) => {
    const aVal = column?.sortValue ? column.sortValue(a) : a[sortField];
    const bVal = column?.sortValue ? column.sortValue(b) : b[sortField];

    if (aVal === undefined || aVal === null) return 1;
    if (bVal === undefined || bVal === null) return -1;

    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortOrder === 'asc'
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }

    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  return sorted.map(item => {
    const children = (item as any)[childrenKey];
    if (Array.isArray(children) && children.length > 0) {
      return {
        ...item,
        [childrenKey]: sortTreeData(
          children,
          sortField,
          sortOrder,
          childrenKey,
          rowKey,
          columns
        ),
      };
    }
    return item;
  });
}

// Flatten tree nodes into visible rows
function flattenTreeNodes<T>(
  nodes: T[],
  depth: number,
  parentId: string | number | null,
  path: (string | number)[],
  childrenKey: string,
  rowKey: (row: T) => string | number,
  expandedIds: Set<string | number>,
  result: FlattenedTreeRow<T>[] = []
): FlattenedTreeRow<T>[] {
  for (const node of nodes) {
    const id = rowKey(node);
    const children = (node as any)[childrenKey];
    const hasChildren = Array.isArray(children) && children.length > 0;
    const isExpanded = expandedIds.has(id);
    const nodePath = [...path, id];

    result.push({
      row: node,
      depth,
      hasChildren,
      isExpanded,
      parentId,
      path: nodePath,
    });

    if (hasChildren && isExpanded) {
      flattenTreeNodes(
        children,
        depth + 1,
        id,
        nodePath,
        childrenKey,
        rowKey,
        expandedIds,
        result
      );
    }
  }
  return result;
}

// ---------------------------------------------------------------------------
// TreeTable Component
// ---------------------------------------------------------------------------

export function TreeTable<T>({
  data,
  columns,
  rowKey,
  childrenKey = 'children',

  sortField,
  sortOrder,
  onSort,

  expandedRowIds,
  onExpandedRowsChange,
  defaultExpanded = false,
  defaultExpandedRowIds,

  selectedRowIds,
  onSelectionChange,
  cascadeSelection = true,

  size = 'md',
  color = 'mauve',
  isLoading = false,
  loadingRowsCount = 5,
  emptyState = 'Nenhum registro encontrado.',
  className = '',

  globalFilter = '',
  globalFilterFields = [],
}: TreeTableProps<T>) {
  const prefix = usePrefix();

  // -------------------------------------------------------------------------
  // Sorting state (Internal fallback)
  // -------------------------------------------------------------------------
  const [internalSortField, setInternalSortField] = useState<string>('');
  const [internalSortOrder, setInternalSortOrder] = useState<'asc' | 'desc' | ''>('');

  const activeSortField = sortField !== undefined ? sortField : internalSortField;
  const activeSortOrder = sortOrder !== undefined ? sortOrder : internalSortOrder;

  const handleHeaderClick = (column: TreeColumn<T>) => {
    if (!column.sortable) return;

    let nextOrder: 'asc' | 'desc' | '' = 'asc';
    if (activeSortField === column.key) {
      if (activeSortOrder === 'asc') {
        nextOrder = 'desc';
      } else if (activeSortOrder === 'desc') {
        nextOrder = '';
      } else {
        nextOrder = 'asc';
      }
    }

    if (onSort) {
      onSort(nextOrder === '' ? '' : column.key, nextOrder);
    } else {
      setInternalSortField(nextOrder === '' ? '' : column.key);
      setInternalSortOrder(nextOrder);
    }
  };

  // -------------------------------------------------------------------------
  // Expansion state (Internal fallback)
  // -------------------------------------------------------------------------
  const [internalExpandedIds, setInternalExpandedIds] = useState<Set<string | number>>(() => {
    const initialSet = new Set<string | number>();
    if (defaultExpandedRowIds) {
      defaultExpandedRowIds.forEach(id => initialSet.add(id));
    } else if (defaultExpanded) {
      const addAllIds = (nodes: T[]) => {
        nodes.forEach(node => {
          initialSet.add(rowKey(node));
          const children = (node as any)[childrenKey];
          if (Array.isArray(children)) addAllIds(children);
        });
      };
      addAllIds(data);
    }
    return initialSet;
  });

  const activeExpandedIds = useMemo(() => {
    if (expandedRowIds !== undefined) {
      return new Set(expandedRowIds);
    }
    return internalExpandedIds;
  }, [expandedRowIds, internalExpandedIds]);

  const toggleExpand = (rowId: string | number) => {
    const nextSet = new Set(activeExpandedIds);
    if (nextSet.has(rowId)) {
      nextSet.delete(rowId);
    } else {
      nextSet.add(rowId);
    }

    if (onExpandedRowsChange) {
      onExpandedRowsChange(Array.from(nextSet));
    } else {
      setInternalExpandedIds(nextSet);
    }
  };

  // Auto-expand parents when global filter is applied
  useEffect(() => {
    if (globalFilter && data.length > 0) {
      const matchedParentIds = new Set<string | number>();
      
      const findMatchesAndParents = (nodes: T[], path: (string | number)[]) => {
        nodes.forEach(node => {
          const id = rowKey(node);
          const currentPath = [...path, id];
          
          const hasMatch = globalFilterFields.some(field => {
            const val = (node as any)[field];
            return (
              val !== undefined &&
              val !== null &&
              String(val).toLowerCase().includes(globalFilter.toLowerCase())
            );
          });

          if (hasMatch) {
            // Add all ancestors to expansion list
            path.forEach(parentId => matchedParentIds.add(parentId));
          }

          const children = (node as any)[childrenKey];
          if (Array.isArray(children)) {
            findMatchesAndParents(children, currentPath);
          }
        });
      };

      findMatchesAndParents(data, []);

      if (matchedParentIds.size > 0) {
        if (onExpandedRowsChange) {
          onExpandedRowsChange(Array.from(matchedParentIds));
        } else {
          setInternalExpandedIds(matchedParentIds);
        }
      }
    }
  }, [globalFilter, data, childrenKey, rowKey, globalFilterFields, onExpandedRowsChange]);

  // -------------------------------------------------------------------------
  // Selection state (Internal fallback)
  // -------------------------------------------------------------------------
  const [internalSelectedIds, setInternalSelectedIds] = useState<(string | number)[]>([]);

  const activeSelectedIds = selectedRowIds !== undefined ? selectedRowIds : internalSelectedIds;
  const activeSelectedSet = useMemo(() => new Set(activeSelectedIds), [activeSelectedIds]);

  const handleSelectRow = (targetNodeId: string | number, checked: boolean) => {
    let nextSelected: (string | number)[] = [];

    if (cascadeSelection) {
      nextSelected = updateSelectionCascading(
        data,
        activeSelectedIds,
        targetNodeId,
        checked,
        childrenKey,
        rowKey
      );
    } else {
      const nextSet = new Set(activeSelectedSet);
      if (checked) {
        nextSet.add(targetNodeId);
      } else {
        nextSet.delete(targetNodeId);
      }
      nextSelected = Array.from(nextSet);
    }

    if (onSelectionChange) {
      onSelectionChange(nextSelected);
    } else {
      setInternalSelectedIds(nextSelected);
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    let nextSelected: (string | number)[] = [];
    if (e.target.checked) {
      // Get all keys in the filtered dataset
      const allIds: (string | number)[] = [];
      const addAllIds = (nodes: T[]) => {
        nodes.forEach(node => {
          allIds.push(rowKey(node));
          const children = (node as any)[childrenKey];
          if (Array.isArray(children)) addAllIds(children);
        });
      };
      addAllIds(processedData);
      nextSelected = allIds;
    } else {
      nextSelected = [];
    }

    if (onSelectionChange) {
      onSelectionChange(nextSelected);
    } else {
      setInternalSelectedIds(nextSelected);
    }
  };

  // -------------------------------------------------------------------------
  // Data Pipeline (Filter -> Sort -> Flatten)
  // -------------------------------------------------------------------------
  const processedData = useMemo(() => {
    let result = data;
    // 1. Filter
    if (globalFilter && globalFilterFields.length > 0) {
      result = filterTreeData(result, globalFilter, childrenKey, rowKey, globalFilterFields);
    }
    // 2. Sort
    if (activeSortField && activeSortOrder) {
      result = sortTreeData(result, activeSortField, activeSortOrder, childrenKey, rowKey, columns);
    }
    return result;
  }, [data, globalFilter, globalFilterFields, activeSortField, activeSortOrder, childrenKey, rowKey, columns]);

  const visibleRows = useMemo(() => {
    return flattenTreeNodes(
      processedData,
      0,
      null,
      [],
      childrenKey,
      rowKey,
      activeExpandedIds
    );
  }, [processedData, childrenKey, rowKey, activeExpandedIds]);

  // Selection properties for header checkbox
  const totalVisibleNodesCount = useMemo(() => {
    let count = 0;
    const countNodes = (nodes: T[]) => {
      nodes.forEach(node => {
        count++;
        const children = (node as any)[childrenKey];
        if (Array.isArray(children)) countNodes(children);
      });
    };
    countNodes(processedData);
    return count;
  }, [processedData, childrenKey]);

  const areAllRowsSelected = () => {
    if (totalVisibleNodesCount === 0) return false;
    let allSelected = true;
    const checkNodes = (nodes: T[]): boolean => {
      for (const node of nodes) {
        if (!activeSelectedSet.has(rowKey(node))) {
          allSelected = false;
          return false;
        }
        const children = (node as any)[childrenKey];
        if (Array.isArray(children)) {
          if (!checkNodes(children)) return false;
        }
      }
      return true;
    };
    checkNodes(processedData);
    return allSelected;
  };

  const isSomeRowsSelected = () => {
    if (totalVisibleNodesCount === 0 || activeSelectedSet.size === 0) return false;
    let selectedCount = 0;
    const countSelected = (nodes: T[]) => {
      nodes.forEach(node => {
        if (activeSelectedSet.has(rowKey(node))) {
          selectedCount++;
        }
        const children = (node as any)[childrenKey];
        if (Array.isArray(children)) countSelected(children);
      });
    };
    countSelected(processedData);
    return selectedCount > 0 && selectedCount < totalVisibleNodesCount;
  };

  // -------------------------------------------------------------------------
  // Rendering Helpers
  // -------------------------------------------------------------------------
  const containerClasses = [
    cn(prefix, 'table-container'),
    `${prefix}-table--${size}`,
    `${prefix}-table--${color}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const showCheckbox = !!onSelectionChange || selectedRowIds !== undefined;

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
                  aria-label="Selecionar todos os itens da árvore"
                  disabled={isLoading}
                />
              </th>
            )}
            {columns.map(col => {
              const isSortedThis = activeSortField === col.key;
              const thClasses = [
                col.sortable ? `${prefix}-table-th--sortable` : '',
                isSortedThis ? `${prefix}-table-th--active` : '',
                col.align ? `${prefix}-table-cell--align-${col.align}` : `${prefix}-table-cell--align-left`,
                `${prefix}-table-th--key-${col.key}`,
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
                      <span
                        className={`${prefix}-table-sort-icon ${
                          isSortedThis ? `${prefix}-table-sort-icon--active` : ''
                        }`}
                      >
                        {isSortedThis && activeSortOrder === 'asc' && (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="18 15 12 9 6 15" />
                          </svg>
                        )}
                        {isSortedThis && activeSortOrder === 'desc' && (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        )}
                        {(!isSortedThis || !activeSortOrder) && (
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
                    {columns.map((col, colIdx) => (
                      <td key={`skeleton-cell-${col.key}`} className={col.align ? `${prefix}-table-cell--align-${col.align}` : ''}>
                        {colIdx === 0 ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div className={`${prefix}-table-skeleton-bar`} style={{ width: '16px', height: '16px', borderRadius: '4px' }}></div>
                            <div className={`${prefix}-table-skeleton-bar`} style={{ width: '70%' }}></div>
                          </div>
                        ) : (
                          <div
                            className={`${prefix}-table-skeleton-bar`}
                            style={{
                              width: col.align === 'right' ? '70%' : col.align === 'center' ? '50%' : '85%',
                              marginLeft: col.align === 'right' ? 'auto' : col.align === 'center' ? 'auto' : '0',
                              marginRight: col.align === 'center' ? 'auto' : '0',
                            }}
                          ></div>
                        )}
                      </td>
                    ))}
                  </tr>
                </React.Fragment>
              );
            })
          ) : visibleRows.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (showCheckbox ? 1 : 0)} className={`${prefix}-table-empty`}>
                {emptyState}
              </td>
            </tr>
          ) : (
            visibleRows.map(({ row, depth, hasChildren, isExpanded }, rowIndex) => {
              const rId = rowKey(row);
              const isSelected = activeSelectedSet.has(rId);

              const trClasses = [
                isSelected ? `${prefix}-table-tr--selected` : '',
                rowIndex === 0 ? `${prefix}-table-tr--first` : '',
                rowIndex === visibleRows.length - 1 ? `${prefix}-table-tr--last` : '',
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
                      <td style={{ textAlign: 'center' }} onClick={e => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          className={`${prefix}-table-checkbox`}
                          checked={isSelected}
                          onChange={e => handleSelectRow(rId, e.target.checked)}
                          aria-label={`Selecionar item ${rId}`}
                        />
                      </td>
                    )}
                    {columns.map((col, colIdx) => {
                      const rawValue = (row as any)[col.key];
                      const cellAlignClass = col.align
                        ? `${prefix}-table-cell--align-${col.align}`
                        : `${prefix}-table-cell--align-left`;

                      if (colIdx === 0) {
                        return (
                          <td key={col.key} className={`${cellAlignClass} ${prefix}-table-cell--key-${col.key}`}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              {/* Depth connector lines */}
                              {Array.from({ length: depth }).map((_, i) => (
                                <div
                                  key={i}
                                  className={`${prefix}-tree-indent-guide`}
                                  style={{
                                    width: '24px',
                                    height: '24px',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                    position: 'relative',
                                  }}
                                >
                                  <div
                                    style={{
                                      width: '1px',
                                      height: '100%',
                                      borderLeft: '1px dashed var(--ctp-surface2)',
                                      position: 'absolute',
                                      left: '11px',
                                      top: 0,
                                      bottom: 0,
                                    }}
                                  />
                                </div>
                              ))}

                              {/* Toggle expand button */}
                              {hasChildren ? (
                                <button
                                  type="button"
                                  onClick={() => toggleExpand(rId)}
                                  className={`${prefix}-tree-toggle-btn`}
                                  aria-label={isExpanded ? 'Colapsar' : 'Expandir'}
                                >
                                  <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    style={{
                                      transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                                      transition: 'transform 0.2s ease',
                                    }}
                                  >
                                    <polyline points="9 18 15 12 9 6" />
                                  </svg>
                                </button>
                              ) : (
                                <div style={{ width: '24px', height: '24px', flexShrink: 0 }} />
                              )}

                              {/* Render column value */}
                              <span style={{ marginLeft: '4px' }}>
                                {col.render
                                  ? col.render(row, rawValue, depth, isExpanded, hasChildren)
                                  : String(rawValue ?? '')}
                              </span>
                            </div>
                          </td>
                        );
                      }

                      return (
                        <td key={col.key} className={`${cellAlignClass} ${prefix}-table-cell--key-${col.key}`}>
                          {col.render
                            ? col.render(row, rawValue, depth, isExpanded, hasChildren)
                            : String(rawValue ?? '')}
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

// Cascading selection algorithm helper
function updateSelectionCascading<T>(
  data: T[],
  currentSelected: (string | number)[],
  targetNodeId: string | number,
  checked: boolean,
  childrenKey: string,
  rowKey: (row: T) => string | number
): (string | number)[] {
  const selectedSet = new Set(currentSelected);

  // Find target node in the tree structure
  let targetNode: T | null = null;
  const findNode = (nodes: T[]): boolean => {
    for (const node of nodes) {
      if (rowKey(node) === targetNodeId) {
        targetNode = node;
        return true;
      }
      const children = (node as any)[childrenKey] as T[] | undefined;
      if (Array.isArray(children) && findNode(children)) {
        return true;
      }
    }
    return false;
  };
  findNode(data);

  if (!targetNode) return currentSelected;

  // 1. Update target and its descendants (downward propagation)
  const descendants = getAllChildIds(targetNode, childrenKey, rowKey);
  if (checked) {
    selectedSet.add(targetNodeId);
    descendants.forEach(id => selectedSet.add(id));
  } else {
    selectedSet.delete(targetNodeId);
    descendants.forEach(id => selectedSet.delete(id));
  }

  // 2. Build map of parents and siblings to propagate upwards
  const parentMap = new Map<
    string | number,
    { parentId: string | number; siblingIds: (string | number)[] }
  >();
  const buildParentMap = (nodes: T[], parentId: string | number | null) => {
    const siblingIds = nodes.map(n => rowKey(n));
    for (const node of nodes) {
      const id = rowKey(node);
      if (parentId !== null) {
        parentMap.set(id, { parentId, siblingIds });
      }
      const children = (node as any)[childrenKey] as T[] | undefined;
      if (Array.isArray(children)) {
        buildParentMap(children, id);
      }
    }
  };
  buildParentMap(data, null);

  // 3. Propagate upward
  let currentId = targetNodeId;
  while (parentMap.has(currentId)) {
    const info = parentMap.get(currentId)!;
    const parentId = info.parentId;
    const siblingIds = info.siblingIds;

    const allSiblingsSelected = siblingIds.every(id => selectedSet.has(id));
    if (allSiblingsSelected) {
      selectedSet.add(parentId);
    } else {
      selectedSet.delete(parentId);
    }
    currentId = parentId;
  }

  return Array.from(selectedSet);
}
