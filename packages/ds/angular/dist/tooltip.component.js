var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, input, computed, HostListener, ElementRef } from '@angular/core';
let TooltipDirective = class TooltipDirective {
    constructor(el) {
        this.el = el;
        this.content = input.required();
        this.placement = input('top');
        this.color = input('dark');
        this.delay = input(200);
        this.isVisible = false;
        this.timeoutId = null;
        this.tooltipClass = computed(() => {
            const colorClass = this.color() === 'dark' || this.color() === 'light'
                ? `tooltip--preset-${this.color()}`
                : `tooltip--${this.color()}`;
            return [
                'tooltip',
                `tooltip--placement-${this.placement()}`,
                colorClass,
            ].filter(Boolean).join(' ');
        });
    }
    onMouseEnter() {
        clearTimeout(this.timeoutId);
        this.timeoutId = setTimeout(() => {
            this.isVisible = true;
        }, this.delay());
    }
    onMouseLeave() {
        clearTimeout(this.timeoutId);
        this.isVisible = false;
    }
    onFocus() {
        clearTimeout(this.timeoutId);
        this.isVisible = true;
    }
    onBlur() {
        clearTimeout(this.timeoutId);
        this.isVisible = false;
    }
};
__decorate([
    HostListener('mouseenter'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TooltipDirective.prototype, "onMouseEnter", null);
__decorate([
    HostListener('mouseleave'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TooltipDirective.prototype, "onMouseLeave", null);
__decorate([
    HostListener('focusin'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TooltipDirective.prototype, "onFocus", null);
__decorate([
    HostListener('focusout'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TooltipDirective.prototype, "onBlur", null);
TooltipDirective = __decorate([
    Component({
        selector: '[tooltip]',
        standalone: true,
        template: `
    <ng-content></ng-content>
    @if (isVisible) {
      <div
        [class]="tooltipClass()"
        [style.position]="'fixed'"
        [style.zIndex]="'1100'"
        role="tooltip"
      >
        <div class="tooltip-content">{{ content() }}</div>
        <div class="tooltip-arrow"></div>
      </div>
    }
  `,
        host: {
            '[style.position]': '"relative"',
        }
    }),
    __metadata("design:paramtypes", [ElementRef])
], TooltipDirective);
export { TooltipDirective };
//# sourceMappingURL=tooltip.component.js.map