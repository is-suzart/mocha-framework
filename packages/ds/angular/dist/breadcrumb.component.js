var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component, input } from '@angular/core';
let BreadcrumbComponent = class BreadcrumbComponent {
    constructor() {
        this.items = input([]);
    }
};
BreadcrumbComponent = __decorate([
    Component({
        selector: 'breadcrumb',
        standalone: true,
        template: `
    <nav class="breadcrumb" aria-label="Breadcrumb">
      @for (item of items(); track $index) {
        @if (!$first) {
          <span class="breadcrumb-separator" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </span>
        }
        @if (item.href && !$last) {
          <a [href]="item.href" class="breadcrumb-item">{{ item.label }}</a>
        } @else {
          <span
            class="breadcrumb-item{{ $last ? ' breadcrumb-item--active' : '' }}"
            [attr.aria-current]="$last ? 'page' : undefined"
          >
            {{ item.label }}
          </span>
        }
      }
    </nav>
  `
    })
], BreadcrumbComponent);
export { BreadcrumbComponent };
//# sourceMappingURL=breadcrumb.component.js.map