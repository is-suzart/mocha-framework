var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, input, output, ElementRef, ViewChild, effect } from '@angular/core';
let activeOverlayCount = 0;
let OverlayComponent = class OverlayComponent {
    constructor() {
        this.isOpen = input(false);
        this.closeOnOverlayClick = input(true);
        this.closeOnEsc = input(true);
        this.placement = input('');
        this.close = output();
        this.shouldRender = false;
        this.isAnimatedIn = false;
        this.zIndex = 1000;
        this.timeoutId = null;
        this.handleKeyDown = (event) => {
            if (event.key === 'Escape' && this.isOpen() && this.closeOnEsc()) {
                if (this.zIndex === 1000 + activeOverlayCount) {
                    this.close.emit();
                }
            }
        };
        effect(() => {
            const open = this.isOpen();
            clearTimeout(this.timeoutId);
            if (open) {
                activeOverlayCount++;
                this.zIndex = 1000 + activeOverlayCount;
                this.shouldRender = true;
                document.body.style.overflow = 'hidden';
                this.timeoutId = setTimeout(() => {
                    this.isAnimatedIn = true;
                }, 10);
                window.addEventListener('keydown', this.handleKeyDown);
            }
            else {
                this.isAnimatedIn = false;
                window.removeEventListener('keydown', this.handleKeyDown);
                this.timeoutId = setTimeout(() => {
                    this.shouldRender = false;
                    if (activeOverlayCount > 0) {
                        activeOverlayCount--;
                    }
                    if (activeOverlayCount === 0) {
                        document.body.style.overflow = '';
                    }
                }, 200);
            }
        });
    }
    ngOnDestroy() {
        clearTimeout(this.timeoutId);
        window.removeEventListener('keydown', this.handleKeyDown);
        if (this.isOpen()) {
            if (activeOverlayCount > 0) {
                activeOverlayCount--;
            }
            if (activeOverlayCount === 0) {
                document.body.style.overflow = '';
            }
        }
    }
    handleOverlayClick(event) {
        if (this.closeOnOverlayClick() && event.target === this.overlayElement.nativeElement) {
            this.close.emit();
        }
    }
};
__decorate([
    ViewChild('overlayElement'),
    __metadata("design:type", ElementRef)
], OverlayComponent.prototype, "overlayElement", void 0);
OverlayComponent = __decorate([
    Component({
        selector: 'overlay',
        standalone: true,
        template: `
    @if (shouldRender) {
      <div
        #overlayElement
        class="overlay"
        [attr.data-state]="isAnimatedIn ? 'open' : null"
        [attr.data-placement]="placement()"
        [style.zIndex]="zIndex"
        (click)="handleOverlayClick($event)"
        role="presentation"
      >
        <ng-content></ng-content>
      </div>
    }
  `
    }),
    __metadata("design:paramtypes", [])
], OverlayComponent);
export { OverlayComponent };
//# sourceMappingURL=overlay.component.js.map