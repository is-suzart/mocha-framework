import type { TableSize, TableColor } from './table.component';
export interface TreeColumn {
    key: string;
    header: string;
    sortable?: boolean;
    align?: 'left' | 'center' | 'right';
    sortValue?: (row: any) => any;
    render?: (row: any, value: any, depth: number, isExpanded: boolean, hasChildren: boolean) => any;
}
interface FlattenedTreeRow {
    row: any;
    depth: number;
    hasChildren: boolean;
    isExpanded: boolean;
    parentId: string | number | null;
    path: (string | number)[];
}
export declare class TreeTableComponent {
    data: import("@angular/core").InputSignal<any[]>;
    columns: import("@angular/core").InputSignal<TreeColumn[]>;
    rowKey: import("@angular/core").InputSignal<(row: any) => string | number>;
    childrenKey: import("@angular/core").InputSignal<string>;
    cascadeSelection: import("@angular/core").InputSignal<boolean>;
    size: import("@angular/core").InputSignal<TableSize>;
    color: import("@angular/core").InputSignal<TableColor>;
    emptyState: import("@angular/core").InputSignal<string>;
    isLoading: import("@angular/core").InputSignal<boolean>;
    loadingRowsCount: import("@angular/core").InputSignal<number>;
    globalFilter: import("@angular/core").InputSignal<string>;
    globalFilterFields: import("@angular/core").InputSignal<string[]>;
    sortField: import("@angular/core").InputSignal<string>;
    sortOrder: import("@angular/core").InputSignal<"" | "desc" | "asc">;
    expandedRowIds: import("@angular/core").InputSignal<(string | number)[]>;
    selectedRowIds: import("@angular/core").InputSignal<(string | number)[] | undefined>;
    sortFieldChange: import("@angular/core").OutputEmitterRef<string>;
    sortOrderChange: import("@angular/core").OutputEmitterRef<"" | "desc" | "asc">;
    expandedRowIdsChange: import("@angular/core").OutputEmitterRef<(string | number)[]>;
    selectedRowIdsChange: import("@angular/core").OutputEmitterRef<(string | number)[]>;
    protected localSortField: import("@angular/core").WritableSignal<string>;
    protected localSortOrder: import("@angular/core").WritableSignal<"" | "desc" | "asc">;
    protected localExpandedIds: import("@angular/core").WritableSignal<Set<string | number>>;
    protected localSelectedIds: import("@angular/core").WritableSignal<(string | number)[]>;
    protected activeSortField: import("@angular/core").Signal<string>;
    protected activeSortOrder: import("@angular/core").Signal<"" | "desc" | "asc">;
    protected activeExpandedIds: import("@angular/core").Signal<Set<string | number>>;
    protected activeSelectedIds: import("@angular/core").Signal<(string | number)[]>;
    protected activeSelectedSet: import("@angular/core").Signal<Set<string | number>>;
    protected containerClass: import("@angular/core").Signal<string>;
    protected showCheckbox: import("@angular/core").Signal<boolean>;
    protected colspan: import("@angular/core").Signal<number>;
    protected skeletonRows: import("@angular/core").Signal<number[]>;
    constructor();
    protected processedData: import("@angular/core").Signal<any[]>;
    protected visibleRows: import("@angular/core").Signal<FlattenedTreeRow[]>;
    protected totalVisibleNodesCount: import("@angular/core").Signal<number>;
    protected allRowsSelected: import("@angular/core").Signal<boolean>;
    protected someRowsSelected: import("@angular/core").Signal<boolean>;
    protected makeRange(count: number): number[];
    protected isSelected(row: any): boolean;
    private filterTreeData;
    private sortTreeData;
    private flattenTreeNodes;
    private getAllChildIds;
    private updateSelectionCascading;
    protected handleHeaderClick(column: TreeColumn): void;
    protected toggleExpand(row: any): void;
    protected handleSelectRow(row: any, event: Event): void;
    protected handleSelectAll(event: Event): void;
}
export {};
//# sourceMappingURL=tree-table.component.d.ts.map