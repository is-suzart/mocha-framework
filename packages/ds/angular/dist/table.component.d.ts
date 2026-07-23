export type TableSize = 'sm' | 'md' | 'lg';
export type TableColor = 'rosewater' | 'flamingo' | 'pink' | 'mauve' | 'red' | 'maroon' | 'peach' | 'yellow' | 'green' | 'teal' | 'sky' | 'sapphire' | 'blue' | 'lavender';
export interface Column {
    key: string;
    header: string;
    sortable?: boolean;
    editable?: boolean;
    align?: 'left' | 'center' | 'right';
}
export declare class TableComponent {
    private el;
    data: import("@angular/core").InputSignal<any[]>;
    columns: import("@angular/core").InputSignal<Column[]>;
    rowKey: import("@angular/core").InputSignal<(row: any) => string | number>;
    size: import("@angular/core").InputSignal<TableSize>;
    color: import("@angular/core").InputSignal<TableColor>;
    emptyState: import("@angular/core").InputSignal<string>;
    sortField: import("@angular/core").InputSignal<string>;
    sortOrder: import("@angular/core").InputSignal<"" | "desc" | "asc">;
    selectedRowIds: import("@angular/core").InputSignal<(string | number)[] | undefined>;
    isLoading: import("@angular/core").InputSignal<boolean>;
    loadingRowsCount: import("@angular/core").InputSignal<number>;
    sortFieldChange: import("@angular/core").OutputEmitterRef<string>;
    sortOrderChange: import("@angular/core").OutputEmitterRef<"" | "desc" | "asc">;
    selectedRowIdsChange: import("@angular/core").OutputEmitterRef<(string | number)[]>;
    cellEdit: import("@angular/core").OutputEmitterRef<{
        rowId: string | number;
        columnKey: string;
        newValue: any;
    }>;
    protected editValue: import("@angular/core").WritableSignal<string>;
    private editingRowId;
    private editingColKey;
    protected containerClass: import("@angular/core").Signal<string>;
    protected showCheckbox: import("@angular/core").Signal<boolean>;
    protected colspan: import("@angular/core").Signal<number>;
    protected skeletonRows: import("@angular/core").Signal<number[]>;
    protected allSelected: import("@angular/core").Signal<boolean>;
    protected someSelected: import("@angular/core").Signal<boolean>;
    protected sortedData: import("@angular/core").Signal<any[]>;
    toggleSort(field: string): void;
    protected isSelected(row: any): boolean;
    protected handleSelectAll(event: Event): void;
    protected handleSelectRow(row: any, event: Event): void;
    protected isEditing(row: any, col: Column): boolean;
    protected startEditing(row: any, col: Column): void;
    protected saveEdit(row: any, col: Column): void;
    protected cancelEdit(): void;
}
//# sourceMappingURL=table.component.d.ts.map