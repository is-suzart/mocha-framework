var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component, input, computed, output } from '@angular/core';
export const DOTS = '...';
let PaginationComponent = class PaginationComponent {
    constructor() {
        this.currentPage = input(1);
        this.totalPages = input(1);
        this.siblingCount = input(1);
        this.size = input('md');
        this.shape = input('rounded');
        this.color = input('mauve');
        this.pageChange = output();
        this.range = computed(() => this.getRange());
        this.containerClass = computed(() => {
            return [
                'pagination',
                `pagination--${this.size()}`,
                `pagination--${this.shape()}`,
                `pagination--${this.color()}`,
            ].filter(Boolean).join(' ');
        });
    }
    getRange() {
        const current = this.currentPage();
        const total = this.totalPages();
        const siblings = this.siblingCount();
        const totalPageNumbers = siblings * 2 + 5;
        if (totalPageNumbers >= total) {
            return Array.from({ length: Math.max(total, 1) }, (_, i) => i + 1);
        }
        const leftSibling = Math.max(current - siblings, 1);
        const rightSibling = Math.min(current + siblings, total);
        const showLeftDots = leftSibling > 2;
        const showRightDots = rightSibling < total - 2;
        if (!showLeftDots && showRightDots) {
            const leftCount = 3 + 2 * siblings;
            const leftRange = Array.from({ length: leftCount }, (_, i) => i + 1);
            return [...leftRange, DOTS, total];
        }
        if (showLeftDots && !showRightDots) {
            const rightCount = 3 + 2 * siblings;
            const rightRange = Array.from({ length: rightCount }, (_, i) => total - rightCount + i + 1);
            return [1, DOTS, ...rightRange];
        }
        const middleRange = Array.from({ length: rightSibling - leftSibling + 1 }, (_, i) => leftSibling + i);
        return [1, DOTS, ...middleRange, DOTS, total];
    }
    goTo(page) {
        if (page < 1 || page > this.totalPages() || page === this.currentPage())
            return;
        this.pageChange.emit(page);
    }
};
PaginationComponent = __decorate([
    Component({
        selector: 'pagination',
        standalone: true,
        template: `
    <nav [class]="containerClass()" aria-label="Pagination">
      <button
        class="pagination-item"
        [class]="'pagination-item--' + size()"
        [disabled]="currentPage() <= 1"
        (click)="goTo(currentPage() - 1)"
        aria-label="Previous page"
      >
        &lsaquo;
      </button>

      @for (item of range(); track $index) {
        @if (item === DOTS) {
          <span class="pagination-ellipsis">{{ DOTS }}</span>
        } @else {
          <button
            class="pagination-item"
            [class]="'pagination-item--' + size()"
            [class.pagination-item--active]="item === currentPage()"
            (click)="goTo(Number(item))"
            [attr.aria-current]="item === currentPage() ? 'page' : null"
          >
            {{ item }}
          </button>
        }
      }

      <button
        class="pagination-item"
        [class]="'pagination-item--' + size()"
        [disabled]="currentPage() >= totalPages()"
        (click)="goTo(currentPage() + 1)"
        aria-label="Next page"
      >
        &rsaquo;
      </button>
    </nav>
  `
    })
], PaginationComponent);
export { PaginationComponent };
//# sourceMappingURL=pagination.component.js.map