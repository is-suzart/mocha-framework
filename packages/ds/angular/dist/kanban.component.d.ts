export interface KanbanColumn {
    id: string;
    title: string;
    color?: string;
}
export interface KanbanItem {
    id: string;
    columnId: string;
    title: string;
    description?: string;
    tags?: string[];
    [key: string]: any;
}
export declare class KanbanComponent {
    columns: import("@angular/core").InputSignal<KanbanColumn[]>;
    items: import("@angular/core").InputSignal<KanbanItem[]>;
    color: import("@angular/core").InputSignal<string>;
    className: import("@angular/core").InputSignal<string>;
    renderItem: import("@angular/core").InputSignal<((item: KanbanItem) => any) | undefined>;
    renderColumnHeader: import("@angular/core").InputSignal<((column: KanbanColumn, columnItems: KanbanItem[]) => any) | undefined>;
    itemsChange: import("@angular/core").OutputEmitterRef<KanbanItem[]>;
    itemClick: import("@angular/core").OutputEmitterRef<KanbanItem>;
    protected draggedItem: import("@angular/core").WritableSignal<KanbanItem | null>;
    protected getColumnItems(columnId: string): KanbanItem[];
    protected onDragStart(event: DragEvent, item: KanbanItem): void;
    protected onDragEnd(): void;
    protected onDragEnterCard(event: DragEvent, targetItem: KanbanItem): void;
    protected onDropColumn(event: DragEvent, columnId: string): void;
    protected handleCardClick(item: KanbanItem): void;
}
//# sourceMappingURL=kanban.component.d.ts.map