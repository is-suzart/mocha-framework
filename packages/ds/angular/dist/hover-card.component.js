var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component, input, ElementRef, inject } from '@angular/core';
let HoverCardComponent = class HoverCardComponent {
    constructor() {
        this.placement = input('bottom');
        this.offset = input(8);
        this.openDelay = input(400);
        this.closeDelay = input(300);
        this.isVisible = false;
        this.top = 0;
        this.left = 0;
        this.actualPlacement = 'bottom';
        this.timeoutId = null;
        this.el = inject(ElementRef);
    }
    onMouseEnter() {
        clearTimeout(this.timeoutId);
        this.timeoutId = setTimeout(() => {
            this.isVisible = true;
            this.updatePosition();
        }, this.openDelay());
    }
    onMouseLeave() {
        clearTimeout(this.timeoutId);
        this.timeoutId = setTimeout(() => {
            this.isVisible = false;
        }, this.closeDelay());
    }
    onFocus() {
        clearTimeout(this.timeoutId);
        this.isVisible = true;
        this.updatePosition();
    }
    onBlur() {
        clearTimeout(this.timeoutId);
        this.isVisible = false;
    }
    onCardEnter() {
        clearTimeout(this.timeoutId);
    }
    onCardLeave() {
        clearTimeout(this.timeoutId);
        this.timeoutId = setTimeout(() => {
            this.isVisible = false;
        }, this.closeDelay());
    }
    updatePosition() {
        const nativeEl = this.el.nativeElement;
        const trigger = nativeEl.querySelector('[ctpHoverCardTrigger]');
        const card = nativeEl.querySelector('.hover-card');
        if (!trigger || !card)
            return;
        const triggerRect = trigger.getBoundingClientRect();
        const offset = this.offset();
        this.actualPlacement = this.placement();
        this.top = triggerRect.bottom + offset;
        this.left = triggerRect.left;
    }
};
HoverCardComponent = __decorate([
    Component({
        selector: 'hover-card',
        standalone: true,
        template: `
    <span class="hover-card-trigger" #triggerRef
      (mouseenter)="onMouseEnter()" (mouseleave)="onMouseLeave()"
      (focusin)="onFocus()" (focusout)="onBlur()"
    >
      <ng-content select="[ctpHoverCardTrigger]" />
    </span>
    @if (isVisible) {
      <div
        #cardRef
        class="hover-card" [attr.data-placement]="actualPlacement"
        [style.position]="'fixed'"
        [style.zIndex]="'1100'"
        [style.top.px]="top"
        [style.left.px]="left"
        (mouseenter)="onCardEnter()"
        (mouseleave)="onCardLeave()"
      >
        <div class="hover-card-arrow"></div>
        <ng-content />
      </div>
    }
  `,
    })
], HoverCardComponent);
export { HoverCardComponent };
//# sourceMappingURL=hover-card.component.js.map