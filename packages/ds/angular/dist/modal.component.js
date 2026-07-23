var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component, input, output } from '@angular/core';
import { OverlayComponent } from './overlay.component';
let ModalComponent = class ModalComponent {
    constructor() {
        this.isOpen = input(false);
        this.size = input('md');
        this.title = input('');
        this.closeOnOverlayClick = input(true);
        this.closeOnEsc = input(true);
        this.showCloseButton = input(true);
        this.hasFooter = input(false);
        this.close = output();
        this.hasHeader = () => {
            return !!(this.title() || this.showCloseButton());
        };
    }
};
ModalComponent = __decorate([
    Component({
        selector: 'modal',
        standalone: true,
        imports: [OverlayComponent],
        template: `
    <overlay
      [isOpen]="isOpen()"
      [closeOnOverlayClick]="closeOnOverlayClick()"
      [closeOnEsc]="closeOnEsc()"
      (close)="close.emit()"
    >
      <div class="modal" [attr.data-size]="size()" role="dialog" aria-modal="true">
        @if (hasHeader()) {
          <div class="modal-header">
            <div class="modal-title">
              @if (title()) {
                {{ title() }}
              }
              <ng-content select="[header]"></ng-content>
            </div>
            @if (showCloseButton()) {
              <button
                class="modal-close-btn"
                (click)="close.emit()"
                aria-label="Close modal"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            }
          </div>
        }
        <div class="modal-body">
          <ng-content></ng-content>
        </div>
        @if (hasFooter()) {
          <div class="modal-footer">
            <ng-content select="[footer]"></ng-content>
          </div>
        }
      </div>
    </overlay>
  `
    })
], ModalComponent);
export { ModalComponent };
//# sourceMappingURL=modal.component.js.map