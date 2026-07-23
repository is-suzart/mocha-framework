var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component, inject } from '@angular/core';
import { ToastService } from './toast.service';
let ToasterComponent = class ToasterComponent {
    constructor() {
        this.toastService = inject(ToastService);
        this.positions = [
            'top-right', 'top-left', 'bottom-right', 'bottom-left', 'top-center', 'bottom-center'
        ];
        this.keys = Object.keys;
    }
    groupedToasts(position) {
        const items = this.toastService.toasts().filter(t => t.position === position);
        return items.length > 0 ? items : null;
    }
    dismiss(id) {
        this.toastService.dismiss(id);
    }
};
ToasterComponent = __decorate([
    Component({
        selector: 'toaster',
        standalone: true,
        template: `
    @for (pos of positions; track pos) {
      @if (groupedToasts(pos); as items) {
        <div class="toast-container" [attr.data-state]="pos">
          @for (item of items; track item.id) {
            <div
              class="toast"
              [class]="item.className"
              [attr.data-state]="item.exiting ? 'exiting' : item.variant"
              [attr.data-color]="item.color || null"
              [attr.data-variant]="item.filled ? 'filled' : null"
              [style]="item.style && keys(item.style).length > 0 ? item.style : null"
              role="alert"
              aria-live="assertive"
            >
              <div class="toast-icon">
                @switch (item.variant) {
                  @case ('success') {
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                      <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                  }
                  @case ('error') {
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="15" y1="9" x2="9" y2="15"/>
                      <line x1="9" y1="9" x2="15" y2="15"/>
                    </svg>
                  }
                  @case ('warning') {
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                      <line x1="12" y1="9" x2="12" y2="13"/>
                      <line x1="12" y1="17" x2="12.01" y2="17"/>
                    </svg>
                  }
                  @case ('info') {
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="16" x2="12" y2="12"/>
                      <line x1="12" y1="8" x2="12.01" y2="8"/>
                    </svg>
                  }
                }
              </div>
              <div class="toast-content">
                @if (item.title) {
                  <div class="toast-title">{{ item.title }}</div>
                }
                @if (item.description) {
                  <div class="toast-description">{{ item.description }}</div>
                }
              </div>
              <button class="toast-close" (click)="dismiss(item.id)" aria-label="Dismiss">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
              @if (item.duration > 0) {
                <div class="toast-progress" [style.animationDuration]="item.duration + 'ms'"></div>
              }
            </div>
          }
        </div>
      }
    }
  `
    })
], ToasterComponent);
export { ToasterComponent };
//# sourceMappingURL=toast.component.js.map