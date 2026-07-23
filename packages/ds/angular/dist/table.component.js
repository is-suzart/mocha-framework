var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component, input, computed, output, signal, ElementRef, inject } from '@angular/core';
let TableComponent = class TableComponent {
    constructor() {
        this.el = inject(ElementRef);
        this.data = input([]);
        this.columns = input([]);
        this.rowKey = input((row) => row.id);
        this.size = input('md');
        this.color = input('mauve');
        this.emptyState = input('No records found.');
        this.sortField = input('');
        this.sortOrder = input('');
        this.selectedRowIds = input(undefined);
        this.isLoading = input(false);
        this.loadingRowsCount = input(5);
        this.sortFieldChange = output();
        this.sortOrderChange = output();
        this.selectedRowIdsChange = output();
        this.cellEdit = output();
        this.editValue = signal('');
        this.editingRowId = null;
        this.editingColKey = null;
        this.containerClass = computed(() => {
            return [
                'table-container',
                `table--${this.size()}`,
                `table--${this.color()}`,
            ].filter(Boolean).join(' ');
        });
        this.showCheckbox = computed(() => this.selectedRowIds() !== undefined);
        this.colspan = computed(() => {
            return this.columns().length + (this.showCheckbox() ? 1 : 0);
        });
        this.skeletonRows = computed(() => {
            return Array.from({ length: this.loadingRowsCount() }, (_, i) => i);
        });
        this.allSelected = computed(() => {
            const data = this.data();
            const ids = this.selectedRowIds();
            if (data.length === 0 || !ids)
                return false;
            return data.every(row => ids.includes(this.rowKey()(row)));
        });
        this.someSelected = computed(() => {
            const data = this.data();
            const ids = this.selectedRowIds();
            if (!ids || data.length === 0)
                return false;
            const count = data.filter(row => ids.includes(this.rowKey()(row))).length;
            return count > 0 && count < data.length;
        });
        this.sortedData = computed(() => {
            const rows = [...this.data()];
            const field = this.sortField();
            const order = this.sortOrder();
            if (field && order) {
                rows.sort((a, b) => {
                    const aVal = a[field];
                    const bVal = b[field];
                    if (aVal < bVal)
                        return order === 'asc' ? -1 : 1;
                    if (aVal > bVal)
                        return order === 'asc' ? 1 : -1;
                    return 0;
                });
            }
            return rows;
        });
    }
    toggleSort(field) {
        if (this.sortField() === field) {
            const nextOrder = this.sortOrder() === 'asc' ? 'desc' : this.sortOrder() === 'desc' ? '' : 'asc';
            this.sortOrderChange.emit(nextOrder);
        }
        else {
            this.sortFieldChange.emit(field);
            this.sortOrderChange.emit('asc');
        }
    }
    isSelected(row) {
        const ids = this.selectedRowIds();
        if (!ids)
            return false;
        return ids.includes(this.rowKey()(row));
    }
    handleSelectAll(event) {
        const checked = event.target.checked;
        if (checked) {
            this.selectedRowIdsChange.emit(this.data().map(row => this.rowKey()(row)));
        }
        else {
            this.selectedRowIdsChange.emit([]);
        }
    }
    handleSelectRow(row, event) {
        const checked = event.target.checked;
        const id = this.rowKey()(row);
        const current = [...(this.selectedRowIds() || [])];
        if (checked) {
            current.push(id);
        }
        else {
            const idx = current.indexOf(id);
            if (idx !== -1)
                current.splice(idx, 1);
        }
        this.selectedRowIdsChange.emit(current);
    }
    isEditing(row, col) {
        return this.editingRowId === this.rowKey()(row) && this.editingColKey === col.key;
    }
    startEditing(row, col) {
        if (!col.editable)
            return;
        this.editingRowId = this.rowKey()(row);
        this.editingColKey = col.key;
        this.editValue.set(String(row[col.key] ?? ''));
        setTimeout(() => {
            const input = this.el.nativeElement.querySelector('.table-inline-edit');
            input?.focus();
            input?.select();
        });
    }
    saveEdit(row, col) {
        if (this.editingRowId === null)
            return;
        this.cellEdit.emit({
            rowId: this.rowKey()(row),
            columnKey: col.key,
            newValue: this.editValue(),
        });
        this.cancelEdit();
    }
    cancelEdit() {
        this.editingRowId = null;
        this.editingColKey = null;
        this.editValue.set('');
    }
};
TableComponent = __decorate([
    Component({
        selector: 'table',
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
                  [checked]="allSelected()"
                  [indeterminate]="someSelected()"
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
                [attr.aria-sort]="sortField() === col.key ? (sortOrder() === 'asc' ? 'ascending' : 'descending') : undefined"
                (click)="col.sortable && toggleSort(col.key)"
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
          @if (!isLoading() && data().length === 0) {
            <tr>
              <td [attr.colspan]="colspan()" class="table-empty">
                {{ emptyState() }}
              </td>
            </tr>
          }

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
                @for (col of columns(); track col.key) {
                  <td [class]="col.align ? 'table-cell--align-' + col.align : ''">
                    <div
                      class="table-skeleton-bar"
                      [style.width]="col.align === 'right' ? '70%' : col.align === 'center' ? '50%' : '85%'"
                      [style.marginLeft]="col.align === 'right' ? 'auto' : col.align === 'center' ? 'auto' : '0'"
                      [style.marginRight]="col.align === 'center' ? 'auto' : '0'"
                    ></div>
                  </td>
                }
              </tr>
            }
          }

          @if (!isLoading()) {
            @for (row of sortedData(); track rowKey(row); let idx = $index) {
              @if (idx === 0) {
                <tr class="table-header-spacer">
                  <td [attr.colspan]="colspan()">
                    <div class="table-header-spacer-inner"></div>
                  </td>
                </tr>
              }
              <tr
                [class.table-tr--selected]="isSelected(row)"
                [class.table-tr--first]="idx === 0"
                [class.table-tr--last]="idx === sortedData().length - 1"
              >
                @if (showCheckbox()) {
                  <td style="text-align: center" (click)="$event.stopPropagation()">
                    <input
                      type="checkbox"
                      class="table-checkbox"
                      [checked]="isSelected(row)"
                      (change)="handleSelectRow(row, $event)"
                    />
                  </td>
                }
                @for (col of columns(); track col.key) {
                  <td
                    [class]="'table-cell--align-' + (col.align || 'left') + ' table-cell--key-' + col.key"
                    (dblclick)="startEditing(row, col)"
                    [title]="col.editable ? 'Clique duas vezes para editar' : undefined"
                  >
                    @if (isEditing(row, col)) {
                      <input
                        type="text"
                        class="table-inline-edit"
                        [value]="editValue()"
                        (input)="editValue.set($any($event).target.value)"
                        (blur)="saveEdit(row, col)"
                        (keydown.enter)="saveEdit(row, col)"
                        (keydown.escape)="cancelEdit()"
                      />
                    } @else {
                      {{ row[col.key] }}
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
    })
], TableComponent);
export { TableComponent };
//# sourceMappingURL=table.component.js.map