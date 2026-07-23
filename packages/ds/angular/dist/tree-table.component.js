var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, input, computed, output, signal, effect } from '@angular/core';
let TreeTableComponent = class TreeTableComponent {
    constructor() {
        this.data = input([]);
        this.columns = input([]);
        this.rowKey = input((row) => row.id);
        this.childrenKey = input('children');
        this.cascadeSelection = input(true);
        this.size = input('md');
        this.color = input('mauve');
        this.emptyState = input('Nenhum registro encontrado.');
        this.isLoading = input(false);
        this.loadingRowsCount = input(5);
        this.globalFilter = input('');
        this.globalFilterFields = input([]);
        // Controlled/Uncontrolled model emulation using signals + outputs
        this.sortField = input('');
        this.sortOrder = input('');
        this.expandedRowIds = input([]);
        this.selectedRowIds = input(undefined);
        this.sortFieldChange = output();
        this.sortOrderChange = output();
        this.expandedRowIdsChange = output();
        this.selectedRowIdsChange = output();
        // Local fallbacks
        this.localSortField = signal('');
        this.localSortOrder = signal('');
        this.localExpandedIds = signal(new Set());
        this.localSelectedIds = signal([]);
        // Active states resolved between inputs and local fallback signals
        this.activeSortField = computed(() => this.sortField() !== '' ? this.sortField() : this.localSortField());
        this.activeSortOrder = computed(() => this.sortOrder() !== '' ? this.sortOrder() : this.localSortOrder());
        this.activeExpandedIds = computed(() => {
            // If input expandedRowIds is populated, use it. Otherwise use localExpandedIds.
            // Note: since expandedRowIds defaults to [] (empty array), we check if it is explicitly controlled
            // by comparing with empty array unless we check output connections. However, simply converting input to Set is clean.
            return new Set(this.expandedRowIds().length > 0 ? this.expandedRowIds() : Array.from(this.localExpandedIds()));
        });
        this.activeSelectedIds = computed(() => this.selectedRowIds() !== undefined ? this.selectedRowIds() : this.localSelectedIds());
        this.activeSelectedSet = computed(() => new Set(this.activeSelectedIds()));
        this.containerClass = computed(() => {
            return [
                'table-container',
                `table--${this.size()}`,
                `table--${this.color()}`,
            ].filter(Boolean).join(' ');
        });
        this.showCheckbox = computed(() => this.selectedRowIds() !== undefined);
        this.colspan = computed(() => this.columns().length + (this.showCheckbox() ? 1 : 0));
        this.skeletonRows = computed(() => Array.from({ length: this.loadingRowsCount() }, (_, i) => i));
        // Data Pipeline computed signals
        this.processedData = computed(() => {
            let result = this.data();
            // 1. Filter
            const query = this.globalFilter();
            const fields = this.globalFilterFields();
            if (query && fields.length > 0) {
                result = this.filterTreeData(result, query, fields);
            }
            // 2. Sort
            const field = this.activeSortField();
            const order = this.activeSortOrder();
            if (field && order) {
                result = this.sortTreeData(result, field, order);
            }
            return result;
        });
        this.visibleRows = computed(() => {
            return this.flattenTreeNodes(this.processedData(), 0, null, [], this.activeExpandedIds());
        });
        // Checkbox state calculations
        this.totalVisibleNodesCount = computed(() => {
            let count = 0;
            const countNodes = (nodes) => {
                nodes.forEach(node => {
                    count++;
                    const children = node[this.childrenKey()];
                    if (Array.isArray(children))
                        countNodes(children);
                });
            };
            countNodes(this.processedData());
            return count;
        });
        this.allRowsSelected = computed(() => {
            if (this.totalVisibleNodesCount() === 0)
                return false;
            let allSelected = true;
            const checkNodes = (nodes) => {
                for (const node of nodes) {
                    if (!this.activeSelectedSet().has(this.rowKey()(node))) {
                        allSelected = false;
                        return false;
                    }
                    const children = node[this.childrenKey()];
                    if (Array.isArray(children)) {
                        if (!checkNodes(children))
                            return false;
                    }
                }
                return true;
            };
            checkNodes(this.processedData());
            return allSelected;
        });
        this.someRowsSelected = computed(() => {
            if (this.totalVisibleNodesCount() === 0 || this.activeSelectedSet().size === 0)
                return false;
            let selectedCount = 0;
            const countSelected = (nodes) => {
                nodes.forEach(node => {
                    if (this.activeSelectedSet().has(this.rowKey()(node))) {
                        selectedCount++;
                    }
                    const children = node[this.childrenKey()];
                    if (Array.isArray(children))
                        countSelected(children);
                });
            };
            countSelected(this.processedData());
            return selectedCount > 0 && selectedCount < this.totalVisibleNodesCount();
        });
        // Effect to handle auto-expansion on filter matches
        effect(() => {
            const query = this.globalFilter();
            const fields = this.globalFilterFields();
            const data = this.data();
            const childKey = this.childrenKey();
            if (query && data.length > 0 && fields.length > 0) {
                const matchedParentIds = new Set();
                const findMatches = (nodes, path) => {
                    nodes.forEach(node => {
                        const id = this.rowKey()(node);
                        const currentPath = [...path, id];
                        const hasMatch = fields.some(field => {
                            const val = node[field];
                            return val !== undefined && val !== null && String(val).toLowerCase().includes(query.toLowerCase());
                        });
                        if (hasMatch) {
                            path.forEach(parentId => matchedParentIds.add(parentId));
                        }
                        const children = node[childKey];
                        if (Array.isArray(children)) {
                            findMatches(children, currentPath);
                        }
                    });
                };
                findMatches(data, []);
                if (matchedParentIds.size > 0) {
                    const ids = Array.from(matchedParentIds);
                    this.localExpandedIds.set(matchedParentIds);
                    this.expandedRowIdsChange.emit(ids);
                }
            }
        });
    }
    // Range generator helper for template
    makeRange(count) {
        return Array.from({ length: count }, (_, i) => i);
    }
    isSelected(row) {
        return this.activeSelectedSet().has(this.rowKey()(row));
    }
    // Tree Table operations
    filterTreeData(data, query, fields) {
        const lowercaseQuery = query.toLowerCase();
        const childrenKey = this.childrenKey();
        const filterNode = (node) => {
            const children = node[childrenKey];
            let filteredChildren = [];
            if (Array.isArray(children)) {
                filteredChildren = children
                    .map(child => filterNode(child))
                    .filter(Boolean);
            }
            const selfMatches = fields.some(field => {
                const val = node[field];
                return val !== undefined && val !== null && String(val).toLowerCase().includes(lowercaseQuery);
            });
            if (selfMatches || filteredChildren.length > 0) {
                return {
                    ...node,
                    [childrenKey]: filteredChildren,
                };
            }
            return null;
        };
        return data.map(node => filterNode(node)).filter(Boolean);
    }
    sortTreeData(data, field, order) {
        const sorted = [...data];
        const column = this.columns().find(c => c.key === field);
        const childrenKey = this.childrenKey();
        sorted.sort((a, b) => {
            const aVal = column?.sortValue ? column.sortValue(a) : a[field];
            const bVal = column?.sortValue ? column.sortValue(b) : b[field];
            if (aVal === undefined || aVal === null)
                return 1;
            if (bVal === undefined || bVal === null)
                return -1;
            if (typeof aVal === 'string' && typeof bVal === 'string') {
                return order === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
            }
            if (aVal < bVal)
                return order === 'asc' ? -1 : 1;
            if (aVal > bVal)
                return order === 'asc' ? 1 : -1;
            return 0;
        });
        return sorted.map(item => {
            const children = item[childrenKey];
            if (Array.isArray(children) && children.length > 0) {
                return {
                    ...item,
                    [childrenKey]: this.sortTreeData(children, field, order),
                };
            }
            return item;
        });
    }
    flattenTreeNodes(nodes, depth, parentId, path, expandedIds, result = []) {
        for (const node of nodes) {
            const id = this.rowKey()(node);
            const children = node[this.childrenKey()];
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
                this.flattenTreeNodes(children, depth + 1, id, nodePath, expandedIds, result);
            }
        }
        return result;
    }
    getAllChildIds(node) {
        const children = node[this.childrenKey()];
        if (!Array.isArray(children))
            return [];
        const ids = [];
        for (const child of children) {
            ids.push(this.rowKey()(child));
            ids.push(...this.getAllChildIds(child));
        }
        return ids;
    }
    updateSelectionCascading(targetNodeId, checked) {
        const selectedSet = new Set(this.activeSelectedIds());
        let targetNode = null;
        const findNode = (nodes) => {
            for (const node of nodes) {
                if (this.rowKey()(node) === targetNodeId) {
                    targetNode = node;
                    return true;
                }
                const children = node[this.childrenKey()];
                if (Array.isArray(children) && findNode(children)) {
                    return true;
                }
            }
            return false;
        };
        findNode(this.data());
        if (!targetNode)
            return this.activeSelectedIds();
        const descendants = this.getAllChildIds(targetNode);
        if (checked) {
            selectedSet.add(targetNodeId);
            descendants.forEach(id => selectedSet.add(id));
        }
        else {
            selectedSet.delete(targetNodeId);
            descendants.forEach(id => selectedSet.delete(id));
        }
        const parentMap = new Map();
        const buildParentMap = (nodes, parentId) => {
            const siblingIds = nodes.map(n => this.rowKey()(n));
            for (const node of nodes) {
                const id = this.rowKey()(node);
                if (parentId !== null) {
                    parentMap.set(id, { parentId, siblingIds });
                }
                const children = node[this.childrenKey()];
                if (Array.isArray(children)) {
                    buildParentMap(children, id);
                }
            }
        };
        buildParentMap(this.data(), null);
        let currentId = targetNodeId;
        while (parentMap.has(currentId)) {
            const info = parentMap.get(currentId);
            const parentId = info.parentId;
            const siblingIds = info.siblingIds;
            const allSiblingsSelected = siblingIds.every(id => selectedSet.has(id));
            if (allSiblingsSelected) {
                selectedSet.add(parentId);
            }
            else {
                selectedSet.delete(parentId);
            }
            currentId = parentId;
        }
        return Array.from(selectedSet);
    }
    // Event handlers
    handleHeaderClick(column) {
        let nextOrder = 'asc';
        if (this.activeSortField() === column.key) {
            if (this.activeSortOrder() === 'asc') {
                nextOrder = 'desc';
            }
            else if (this.activeSortOrder() === 'desc') {
                nextOrder = '';
            }
            else {
                nextOrder = 'asc';
            }
        }
        const nextField = nextOrder === '' ? '' : column.key;
        this.localSortField.set(nextField);
        this.localSortOrder.set(nextOrder);
        this.sortFieldChange.emit(nextField);
        this.sortOrderChange.emit(nextOrder);
    }
    toggleExpand(row) {
        const rowId = this.rowKey()(row);
        const nextSet = new Set(this.activeExpandedIds());
        if (nextSet.has(rowId)) {
            nextSet.delete(rowId);
        }
        else {
            nextSet.add(rowId);
        }
        const list = Array.from(nextSet);
        this.localExpandedIds.set(nextSet);
        this.expandedRowIdsChange.emit(list);
    }
    handleSelectRow(row, event) {
        const checked = event.target.checked;
        const rowId = this.rowKey()(row);
        let nextSelected = [];
        if (this.cascadeSelection()) {
            nextSelected = this.updateSelectionCascading(rowId, checked);
        }
        else {
            const nextSet = new Set(this.activeSelectedIds());
            if (checked) {
                nextSet.add(rowId);
            }
            else {
                nextSet.delete(rowId);
            }
            nextSelected = Array.from(nextSet);
        }
        this.localSelectedIds.set(nextSelected);
        this.selectedRowIdsChange.emit(nextSelected);
    }
    handleSelectAll(event) {
        const checked = event.target.checked;
        let nextSelected = [];
        if (checked) {
            const allIds = [];
            const addAllIds = (nodes) => {
                nodes.forEach(node => {
                    allIds.push(this.rowKey()(node));
                    const children = node[this.childrenKey()];
                    if (Array.isArray(children))
                        addAllIds(children);
                });
            };
            addAllIds(this.processedData());
            nextSelected = allIds;
        }
        else {
            nextSelected = [];
        }
        this.localSelectedIds.set(nextSelected);
        this.selectedRowIdsChange.emit(nextSelected);
    }
};
TreeTableComponent = __decorate([
    Component({
        selector: 'tree-table',
        standalone: true,
        template: `
    <div [class]="containerClass()">
      <table class="table">
        <thead>
          <tr>
            @if (showCheckbox()) {
              <th style="width: 40px; text-align: center">
                <input
                  type="checkbox"
                  class="table-checkbox"
                  [checked]="allRowsSelected()"
                  [indeterminate]="someRowsSelected()"
                  (change)="handleSelectAll($event)"
                  [disabled]="isLoading()"
                />
              </th>
            }
            @for (col of columns(); track col.key) {
              <th
                [class.table-th--sortable]="col.sortable"
                [class.table-th--active]="sortField() === col.key"
                [class.table-cell--align-left]="(!col.align || col.align === 'left')"
                [class.table-cell--align-center]="col.align === 'center'"
                [class.table-cell--align-right]="col.align === 'right'"
                (click)="col.sortable && handleHeaderClick(col)"
                [style.cursor]="col.sortable ? 'pointer' : 'default'"
              >
                <div class="table-th-content">
                  {{ col.header }}
                  @if (col.sortable) {
                    <span [class.table-sort-icon]="true" [class.table-sort-icon--active]="sortField() === col.key">
                      @if (sortField() === col.key && sortOrder() === 'asc') {
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                          <polyline points="18 15 12 9 6 15" />
                        </svg>
                      } @else if (sortField() === col.key && sortOrder() === 'desc') {
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      } @else {
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.4">
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      }
                    </span>
                  }
                </div>
              </th>
            }
          </tr>
        </thead>
        <tbody>
          @if (isLoading()) {
            @for (rIdx of skeletonRows(); track rIdx) {
              @if (rIdx === 0) {
                <tr class="table-header-spacer">
                  <td [attr.colspan]="colspan()">
                    <div class="table-header-spacer-inner"></div>
                  </td>
                </tr>
              }
              <tr
                class="table-skeleton-row"
                [class.table-tr--first]="rIdx === 0"
                [class.table-tr--last]="rIdx === loadingRowsCount() - 1"
              >
                @if (showCheckbox()) {
                  <td style="text-align: center">
                    <div class="table-skeleton-bar" style="width: 16px; margin: 0 auto"></div>
                  </td>
                }
                @for (col of columns(); track col.key; let colIdx = $index) {
                  <td [class]="col.align ? 'table-cell--align-' + col.align : ''">
                    @if (colIdx === 0) {
                      <div style="display: flex; align-items: center; gap: 8px">
                        <div class="table-skeleton-bar" style="width: 16px; height: 16px; border-radius: 4px"></div>
                        <div class="table-skeleton-bar" style="width: 70%"></div>
                      </div>
                    } @else {
                      <div
                        class="table-skeleton-bar"
                        [style.width]="col.align === 'right' ? '70%' : col.align === 'center' ? '50%' : '85%'"
                        [style.marginLeft]="col.align === 'right' ? 'auto' : col.align === 'center' ? 'auto' : '0'"
                        [style.marginRight]="col.align === 'center' ? 'auto' : '0'"
                      ></div>
                    }
                  </td>
                }
              </tr>
            }
          } @else if (visibleRows().length === 0) {
            <tr>
              <td [attr.colspan]="colspan()" class="table-empty">
                {{ emptyState() }}
              </td>
            </tr>
          } @else {
            @for (rowItem of visibleRows(); track rowKey()(rowItem.row); let idx = $index) {
              @if (idx === 0) {
                <tr class="table-header-spacer">
                  <td [attr.colspan]="colspan()">
                    <div class="table-header-spacer-inner"></div>
                  </td>
                </tr>
              }
              <tr
                [class.table-tr--selected]="isSelected(rowItem.row)"
                [class.table-tr--first]="idx === 0"
                [class.table-tr--last]="idx === visibleRows().length - 1"
              >
                @if (showCheckbox()) {
                  <td style="text-align: center" (click)="$event.stopPropagation()">
                    <input
                      type="checkbox"
                      class="table-checkbox"
                      [checked]="isSelected(rowItem.row)"
                      (change)="handleSelectRow(rowItem.row, $event)"
                    />
                  </td>
                }
                @for (col of columns(); track col.key; let colIdx = $index) {
                  <td
                    [class]="'table-cell--align-' + (col.align || 'left') + ' table-cell--key-' + col.key"
                  >
                    @if (colIdx === 0) {
                      <div style="display: flex; align-items: center">
                        <!-- Indent guides -->
                        @for (i of makeRange(rowItem.depth); track i) {
                          <div
                            class="tree-indent-guide"
                            style="width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; position: relative;"
                          >
                            <div
                              style="width: 1px; height: 100%; border-left: 1px dashed var(--ctp-surface2); position: absolute; left: 11px; top: 0; bottom: 0;"
                            ></div>
                          </div>
                        }

                        <!-- Toggle button -->
                        @if (rowItem.hasChildren) {
                          <button
                            type="button"
                            (click)="toggleExpand(rowItem.row)"
                            class="tree-toggle-btn"
                            [attr.aria-label]="rowItem.isExpanded ? 'Colapsar' : 'Expandir'"
                          >
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              [style.transform]="rowItem.isExpanded ? 'rotate(90deg)' : 'rotate(0deg)'"
                              style="transition: transform 0.2s ease"
                            >
                              <polyline points="9 18 15 12 9 6" />
                            </svg>
                          </button>
                        } @else {
                          <div style="width: 24px; height: 24px; flex-shrink: 0;"></div>
                        }

                        <!-- Cell value -->
                        <span style="margin-left: 4px">
                          @if (col.render) {
                            <span [innerHTML]="col.render(rowItem.row, rowItem.row[col.key], rowItem.depth, rowItem.isExpanded, rowItem.hasChildren)"></span>
                          } @else {
                            {{ rowItem.row[col.key] }}
                          }
                        </span>
                      </div>
                    } @else {
                      @if (col.render) {
                        <span [innerHTML]="col.render(rowItem.row, rowItem.row[col.key], rowItem.depth, rowItem.isExpanded, rowItem.hasChildren)"></span>
                      } @else {
                        {{ rowItem.row[col.key] }}
                      }
                    }
                  </td>
                }
              </tr>
            }
          }
        </tbody>
      </table>
    </div>
  `
    }),
    __metadata("design:paramtypes", [])
], TreeTableComponent);
export { TreeTableComponent };
//# sourceMappingURL=tree-table.component.js.map