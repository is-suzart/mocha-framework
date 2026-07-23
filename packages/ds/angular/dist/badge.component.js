var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component, input, output } from '@angular/core';
let BadgeComponent = class BadgeComponent {
    constructor() {
        this.variant = input('filled');
        this.size = input('md');
        this.shape = input('pill');
        this.color = input('mauve');
        this.icon = input('');
        this.isDismissible = input(false);
        this.dismiss = output();
    }
};
BadgeComponent = __decorate([
    Component({
        selector: 'badge',
        standalone: true,
        host: {
            '[class.badge]': 'true',
            '[attr.data-variant]': 'variant()',
            '[attr.data-size]': 'size()',
            '[attr.data-shape]': 'shape()',
            '[attr.data-color]': 'color()',
        },
        template: `
    @if (icon()) {
      <span class="badge-icon" style="display: inline-flex; align-items: center">
        <span [innerHTML]="icon()"></span>
      </span>
    }
    <span class="badge-content">
      <ng-content></ng-content>
    </span>
    @if (isDismissible()) {
      <button
        class="badge-close-btn"
        (click)="dismiss.emit($event)"
        aria-label="Dismiss badge"
        style="display: inline-flex; align-items: center; margin-left: 4px;"
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    }
  `
    })
], BadgeComponent);
export { BadgeComponent };
//# sourceMappingURL=badge.component.js.map