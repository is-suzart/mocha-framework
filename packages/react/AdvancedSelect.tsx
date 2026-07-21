import React, { useState, useRef, useEffect } from 'react';
import { FormControlColor, FormControlSize, FormControlShape, getFormThemeClass } from './FormControls';
import { usePrefix } from './PrefixContext';
import { cn, cnEl } from './cn';

// 1. Click Outside Utility Hook
export const useClickOutside = (ref: React.RefObject<HTMLElement | null>, callback: () => void) => {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        callback();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [ref, callback]);
};

// ==========================================
// MULTISELECT COMPONENT
// ==========================================
export interface MultiSelectOption {
  label: string;
  value: string;
}

export interface MultiSelectProps {
  options: MultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  searchable?: boolean;
  color?: FormControlColor;
  size?: FormControlSize;
  shape?: FormControlShape;
  disabled?: boolean;
  error?: boolean;
  className?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options = [],
  value = [],
  onChange,
  placeholder = 'Selecione...',
  searchable = true,
  color = 'mauve',
  size = 'md',
  shape = 'rounded',
  disabled = false,
  error = false,
  className = '',
}) => {
  const prefix = usePrefix();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown upon click away
  useClickOutside(containerRef, () => {
    setIsOpen(false);
    setSearchQuery('');
  });

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const toggleDropdown = () => {
    if (disabled) return;
    setIsOpen(prev => !prev);
  };

  const handleSelectOption = (optVal: string) => {
    if (value.includes(optVal)) {
      onChange(value.filter(v => v !== optVal));
    } else {
      onChange([...value, optVal]);
    }
  };

  const handleRemoveValue = (e: React.MouseEvent, optVal: string) => {
    e.stopPropagation();
    if (disabled) return;
    onChange(value.filter(v => v !== optVal));
  };

  const filteredOptions = options.filter(opt =>
    opt.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedOptions = options.filter(opt => value.includes(opt.value));

  const triggerClass = [
    cn(prefix, 'select-trigger'),
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      ref={containerRef}
      className={`${cn(prefix, 'advanced-select')} ${className}`} data-color={color}
    >
      <button
        type="button"
        className={triggerClass}
        onClick={toggleDropdown}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        data-size={size}
        data-shape={shape}
        data-state={isOpen ? 'active' : (disabled ? 'disabled' : undefined)}
        data-error={error ? 'true' : undefined}
      >
        {selectedOptions.length === 0 ? (
          <span className={`${prefix}-select-placeholder`}>{placeholder}</span>
        ) : (
          selectedOptions.map(opt => (
            <span key={opt.value} className={`${prefix}-tag-chip`}>
              {opt.label}
              <button
                type="button"
                className={cnEl(prefix, 'tag-chip', 'remove')}
                onClick={(e) => handleRemoveValue(e, opt.value)}
                aria-label={`Remover ${opt.label}`}
              >
                &times;
              </button>
            </span>
          ))
        )}

        <span className={cnEl(prefix, 'select-trigger', 'chevron')}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </span>
      </button>

      {isOpen && (
        <div className={cn(prefix, 'dropdown-menu')}>
          {searchable && (
            <div className={`${prefix}-dropdown-search`}>
              <input
                type="text"
                className={cnEl(prefix, 'dropdown-search', 'input')}
                placeholder="Pesquisar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </div>
          )}

          <div className={`${prefix}-dropdown-list`} role="listbox" aria-multiselectable="true">
            {filteredOptions.length === 0 ? (
              <div className={`${prefix}-dropdown-no-results`}>Nenhum resultado encontrado</div>
            ) : (
              filteredOptions.map(opt => {
                const isSelected = value.includes(opt.value);
                return (
                  <div
                    key={opt.value}
                    role="option"
                    aria-selected={isSelected}
                    className={`${`${prefix}-dropdown-item`} ${isSelected ? `${prefix}-dropdown-item--selected` : ''}`}
                    onClick={() => handleSelectOption(opt.value)}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className={cnEl(prefix, 'dropdown-item', 'checkbox')}>
                        {isSelected && (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        )}
                      </span>
                      {opt.label}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// TREESELECT COMPONENT
// ==========================================
export interface TreeNode {
  label: string;
  value: string;
  children?: TreeNode[];
  disabled?: boolean;
}

export interface TreeSelectProps {
  data: TreeNode[];
  value?: string;
  onChange?: (val: string) => void;
  multiple?: boolean;
  multipleValue?: string[];
  onChangeMultiple?: (val: string[]) => void;
  placeholder?: string;
  color?: FormControlColor;
  size?: FormControlSize;
  shape?: FormControlShape;
  disabled?: boolean;
  error?: boolean;
  className?: string;
}

interface FlattenedNode {
  node: TreeNode;
  depth: number;
  parentValue: string | null;
}

export const TreeSelect: React.FC<TreeSelectProps> = ({
  data = [],
  value = '',
  onChange,
  multiple = false,
  multipleValue = [],
  onChangeMultiple,
  placeholder = 'Selecione...',
  color = 'mauve',
  size = 'md',
  shape = 'rounded',
  disabled = false,
  error = false,
  className = '',
}) => {
  const prefix = usePrefix();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedKeys, setExpandedKeys] = useState<Record<string, boolean>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useClickOutside(containerRef, () => {
    setIsOpen(false);
  });

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const toggleDropdown = () => {
    if (disabled) return;
    setIsOpen(prev => !prev);
  };

  const handleToggleExpand = (e: React.MouseEvent, nodeKey: string) => {
    e.stopPropagation();
    setExpandedKeys(prev => ({
      ...prev,
      [nodeKey]: !prev[nodeKey],
    }));
  };

  // Helper to recursively select/deselect child values
  const getChildValues = (node: TreeNode): string[] => {
    let vals = [node.value];
    if (node.children) {
      node.children.forEach(child => {
        vals = vals.concat(getChildValues(child));
      });
    }
    return vals;
  };

  const handleSelectNode = (node: TreeNode) => {
    if (node.disabled || disabled) return;

    if (multiple && onChangeMultiple) {
      const childVals = getChildValues(node);
      const isSelected = multipleValue.includes(node.value);
      
      let updated: string[];
      if (isSelected) {
        // Deselect current and all children
        updated = multipleValue.filter(v => !childVals.includes(v));
      } else {
        // Select current and all children (avoid duplicates)
        const toAdd = childVals.filter(v => !multipleValue.includes(v));
        updated = [...multipleValue, ...toAdd];
      }
      onChangeMultiple(updated);
    } else if (!multiple && onChange) {
      onChange(node.value);
      setIsOpen(false); // Close on single select
    }
  };

  const handleRemoveTag = (e: React.MouseEvent, nodeVal: string) => {
    e.stopPropagation();
    if (disabled) return;
    if (multiple && onChangeMultiple) {
      onChangeMultiple(multipleValue.filter(v => v !== nodeVal));
    }
  };

  // Helper to flatten tree based on expansion state
  const getVisibleFlattenedNodes = (
    nodes: TreeNode[],
    expanded: Record<string, boolean>,
    depth = 0,
    parentVal: string | null = null
  ): FlattenedNode[] => {
    let result: FlattenedNode[] = [];
    nodes.forEach(node => {
      result.push({ node, depth, parentValue: parentVal });
      if (node.children && node.children.length > 0 && expanded[node.value]) {
        result = result.concat(getVisibleFlattenedNodes(node.children, expanded, depth + 1, node.value));
      }
    });
    return result;
  };

  const visibleNodes = getVisibleFlattenedNodes(data, expandedKeys);

  // Find labels to display on trigger
  const getLabelByValue = (nodes: TreeNode[], val: string): string | null => {
    for (const node of nodes) {
      if (node.value === val) return node.label;
      if (node.children) {
        const found = getLabelByValue(node.children, val);
        if (found) return found;
      }
    }
    return null;
  };

  const triggerClass = [
    cn(prefix, 'select-trigger'),
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      ref={containerRef}
      className={`${cn(prefix, 'advanced-select')} ${className}`} data-color={color}
    >
      <button
        type="button"
        className={triggerClass}
        onClick={toggleDropdown}
        disabled={disabled}
        aria-haspopup="tree"
        aria-expanded={isOpen}
      >
        {multiple ? (
          multipleValue.length === 0 ? (
            <span className={`${prefix}-select-placeholder`}>{placeholder}</span>
          ) : (
            multipleValue.map(val => {
              const label = getLabelByValue(data, val) || val;
              return (
                <span key={val} className={`${prefix}-tag-chip`}>
                  {label}
                  <button
                    type="button"
                    className={cnEl(prefix, 'tag-chip', 'remove')}
                    onClick={(e) => handleRemoveTag(e, val)}
                    aria-label={`Remover ${label}`}
                  >
                    &times;
                  </button>
                </span>
              );
            })
          )
        ) : (
          !value ? (
            <span className={`${prefix}-select-placeholder`}>{placeholder}</span>
          ) : (
            <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
              {getLabelByValue(data, value) || value}
            </span>
          )
        )}

        <span className={cnEl(prefix, 'select-trigger', 'chevron')}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </span>
      </button>

      {isOpen && (
        <div className={cn(prefix, 'dropdown-menu')}>
          <div className={`${prefix}-dropdown-list`} role="tree" aria-multiselectable={multiple}>
            {visibleNodes.length === 0 ? (
              <div className={`${prefix}-dropdown-no-results`}>Nenhum nó disponível</div>
            ) : (
              visibleNodes.map(({ node, depth }) => {
                const isSelected = multiple ? multipleValue.includes(node.value) : value === node.value;
                const hasChildren = node.children && node.children.length > 0;
                const isExpanded = !!expandedKeys[node.value];

                const itemClass = [
                  `${prefix}-dropdown-item`,
                  `${prefix}-dropdown-item--depth-${depth}`,
                  isSelected ? `${prefix}-dropdown-item--selected` : '',
                  node.disabled ? `${prefix}-dropdown-item--disabled` : '',
                ]
                  .filter(Boolean)
                  .join(' ');

                return (
                  <div
                    key={node.value}
                    role="treeitem"
                    aria-selected={isSelected}
                    aria-expanded={hasChildren ? isExpanded : undefined}
                    className={itemClass}
                    onClick={() => handleSelectNode(node)}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {hasChildren ? (
                        <span
                          className={`${`${prefix}-tree-node-arrow`} ${isExpanded ? `${prefix}-tree-node-arrow--expanded` : ''}`}
                          onClick={(e) => handleToggleExpand(e, node.value)}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6"></polyline>
                          </svg>
                        </span>
                      ) : (
                        <span style={{ width: '20px' }} /> /* Spacer for alignment */
                      )}

                      {multiple && (
                        <span className={cnEl(prefix, 'dropdown-item', 'checkbox')} style={{ marginRight: '4px' }}>
                          {isSelected && (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          )}
                        </span>
                      )}

                      {node.label}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
