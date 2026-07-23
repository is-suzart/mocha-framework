var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, input, output, ElementRef, HostListener, inject, effect } from '@angular/core';
let PopoverComponent = class PopoverComponent {
    constructor() {
        this.placement = input('bottom');
        this.offset = input(8);
        this.open = input(undefined);
        this.openChange = output();
        this.isOpen = false;
        this.top = 0;
        this.left = 0;
        this.actualPlacement = 'bottom';
        this.el = inject(ElementRef);
        effect(() => {
            const controlled = this.open();
            if (controlled !== undefined) {
                this.isOpen = controlled;
                if (controlled)
                    this.updatePosition();
            }
        });
    }
    toggle() {
        this.isOpen = !this.isOpen;
        this.openChange.emit(this.isOpen);
        if (this.isOpen)
            this.updatePosition();
    }
    openPopover() {
        this.isOpen = true;
        this.openChange.emit(true);
        this.updatePosition();
    }
    closePopover() {
        this.isOpen = false;
        this.openChange.emit(false);
    }
    onDocumentClick(event) {
        if (!this.isOpen)
            return;
        const target = event.target;
        const nativeEl = this.el.nativeElement;
        if (!nativeEl.contains(target)) {
            this.closePopover();
        }
    }
    onEscape() {
        if (this.isOpen)
            this.closePopover();
    }
    updatePosition() {
        const nativeEl = this.el.nativeElement;
        const trigger = nativeEl.querySelector('[ctpPopoverTrigger]');
        const popover = nativeEl.querySelector('.popover');
        if (!trigger || !popover)
            return;
        const triggerRect = trigger.getBoundingClientRect();
        const popoverRect = popover.getBoundingClientRect();
        const offset = this.offset();
        this.actualPlacement = this.placement();
        this.top = triggerRect.bottom + offset;
        this.left = triggerRect.left;
    }
};
__decorate([
    HostListener('document:mousedown', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [MouseEvent]),
    __metadata("design:returntype", void 0)
], PopoverComponent.prototype, "onDocumentClick", null);
__decorate([
    HostListener('document:keydown.escape'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PopoverComponent.prototype, "onEscape", null);
PopoverComponent = __decorate([
    Component({
        selector: 'popover',
        standalone: true,
        template: `
    <div class="popover-trigger" #triggerRef>
      <ng-content select="[ctpPopoverTrigger]" />
    </div>
    @if (isOpen) {
      <div
        #popoverRef
        class="popover" [attr.data-placement]="actualPlacement"
        [style.position]="'fixed'"
        [style.zIndex]="'1100'"
        [style.top.px]="top"
        [style.left.px]="left"
      >
        <div class="popover-arrow"></div>
        <ng-content />
      </div>
    }
  `,
    }),
    __metadata("design:paramtypes", [])
], PopoverComponent);
export { PopoverComponent };
//# sourceMappingURL=popover.component.js.map