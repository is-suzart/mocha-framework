var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component, input, output, signal } from '@angular/core';
let KanbanComponent = class KanbanComponent {
    constructor() {
        this.columns = input([]);
        this.items = input([]);
        this.color = input('mauve');
        this.className = input('');
        this.renderItem = input(undefined);
        this.renderColumnHeader = input(undefined);
        this.itemsChange = output();
        this.itemClick = output();
        this.draggedItem = signal(null);
    }
    getColumnItems(columnId) {
        return this.items().filter(item => item.columnId === columnId);
    }
    onDragStart(event, item) {
        this.draggedItem.set(item);
        if (event.dataTransfer) {
            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.setData('text/plain', item.id);
        }
    }
    onDragEnd() {
        this.draggedItem.set(null);
    }
    onDragEnterCard(event, targetItem) {
        const dragged = this.draggedItem();
        if (!dragged || dragged.id === targetItem.id)
            return;
        const currentItems = [...this.items()];
        const activeIndex = currentItems.findIndex(i => i.id === dragged.id);
        const targetIndex = currentItems.findIndex(i => i.id === targetItem.id);
        if (activeIndex !== -1 && targetIndex !== -1) {
            const updatedDragged = { ...dragged, columnId: targetItem.columnId };
            currentItems.splice(activeIndex, 1);
            currentItems.splice(targetIndex, 0, updatedDragged);
            this.itemsChange.emit(currentItems);
            this.draggedItem.set(updatedDragged);
        }
    }
    onDropColumn(event, columnId) {
        const dragged = this.draggedItem();
        if (!dragged)
            return;
        const currentItems = [...this.items()];
        const activeIndex = currentItems.findIndex(i => i.id === dragged.id);
        if (activeIndex !== -1) {
            const item = currentItems[activeIndex];
            if (item.columnId !== columnId) {
                currentItems.splice(activeIndex, 1);
                currentItems.push({ ...item, columnId });
                this.itemsChange.emit(currentItems);
            }
        }
        this.draggedItem.set(null);
    }
    handleCardClick(item) {
        this.itemClick.emit(item);
    }
};
KanbanComponent = __decorate([
    Component({
        selector: 'kanban',
        standalone: true,
        template: `
    <div [class]="'pro-kanban-board pro-kanban-board--' + color() + ' ' + className()">
      @for (column of columns(); track column.id) {
        <div
          [class]="'pro-kanban-column pro-kanban-column--' + (column.color || color())"
          (dragover)="$event.preventDefault()"
          (drop)="onDropColumn($event, column.id)"
        >
          @if (renderColumnHeader()) {
            <div [innerHTML]="renderColumnHeader()!(column, getColumnItems(column.id))"></div>
          } @else {
            <div class="pro-kanban-column-header">
              <div class="pro-kanban-column-title-container">
                <span class="pro-kanban-column-dot"></span>
                <h3 class="pro-kanban-column-title">{{ column.title }}</h3>
              </div>
              <span class="pro-kanban-column-badge">{{ getColumnItems(column.id).length }}</span>
            </div>
          }

          <div class="pro-kanban-cards-container">
            @for (item of getColumnItems(column.id); track item.id) {
              <div
                draggable="true"
                (dragstart)="onDragStart($event, item)"
                (dragend)="onDragEnd()"
                (dragover)="$event.preventDefault()"
                (dragenter)="onDragEnterCard($event, item)"
                [class.pro-kanban-card--dragging]="draggedItem()?.id === item.id"
                class="pro-kanban-card"
                (click)="handleCardClick(item)"
              >
                @if (renderItem()) {
                  <div [innerHTML]="renderItem()!(item)"></div>
                } @else {
                  <div class="pro-kanban-card-title">{{ item.title }}</div>
                  @if (item.description) {
                    <div class="pro-kanban-card-desc">{{ item.description }}</div>
                  }
                  @if (item.tags && item.tags.length > 0) {
                    <div class="pro-kanban-card-tags">
                      @for (tag of item.tags; track tag) {
                        <span class="pro-kanban-card-tag">{{ tag }}</span>
                      }
                    </div>
                  }
                }
              </div>
            }

            @if (getColumnItems(column.id).length === 0) {
              <div class="pro-kanban-empty-column-placeholder">
                Solte itens aqui
              </div>
            }
          </div>
        </div>
      }
    </div>
  `
    })
], KanbanComponent);
export { KanbanComponent };
//# sourceMappingURL=kanban.component.js.map