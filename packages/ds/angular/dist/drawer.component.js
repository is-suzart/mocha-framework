var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component, input, output } from '@angular/core';
import { OverlayComponent } from './overlay.component';
let DrawerComponent = class DrawerComponent {
    constructor() {
        this.isOpen = input(false);
        this.position = input('right');
        this.size = input('md');
        this.color = input('mauve');
        this.title = input('');
        this.footer = input('');
        this.closeOnOverlayClick = input(true);
        this.closeOnEsc = input(true);
        this.showCloseButton = input(true);
        this.close = output();
    }
    onClose() {
        this.close.emit();
    }
};
DrawerComponent = __decorate([
    Component({
        selector: 'drawer',
        standalone: true,
        imports: [OverlayComponent],
        template: `
    <overlay
      [isOpen]="isOpen()"
      [closeOnOverlayClick]="closeOnOverlayClick()"
      [closeOnEsc]="closeOnEsc()"
      [placement]="'drawer-' + position()"
      (close)="onClose()"
    >
      <div
        class="drawer"
        [attr.data-placement]="position()"
        [attr.data-size]="size()"
        [attr.data-color]="color()"
        role="dialog"
        aria-modal="true"
      >
        @if (title() || showCloseButton()) {
          <div class="drawer-header">
            <div class="drawer-title" id="drawer-title">
              {{ title() }}
            </div>
            @if (showCloseButton()) {
              <button class="drawer-close-btn" (click)="onClose()" aria-label="Close drawer">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            }
          </div>
        }
        <div class="drawer-body">
          <ng-content></ng-content>
        </div>
        @if (footer()) {
          <div class="drawer-footer">{{ footer() }}</div>
        }
      </div>
    </overlay>
  `
    })
], DrawerComponent);
export { DrawerComponent };
//# sourceMappingURL=drawer.component.js.map