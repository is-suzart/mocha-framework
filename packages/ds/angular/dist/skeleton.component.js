var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component, input } from '@angular/core';
let SkeletonComponent = class SkeletonComponent {
    constructor() {
        this.variant = input('text');
        this.size = input('md');
        this.width = input('');
        this.height = input('');
        this.animated = input(true);
        this.count = input(1);
        this.gap = input('8px');
    }
    get items() {
        return Array.from({ length: this.count() }, (_, i) => i);
    }
    get classes() {
        return 'skeleton';
    }
    get customStyle() {
        const style = {};
        if (this.width())
            style['width'] = this.width();
        if (this.height())
            style['height'] = this.height();
        return style;
    }
};
SkeletonComponent = __decorate([
    Component({
        selector: 'skeleton',
        standalone: true,
        template: `
    @if (count() > 1) {
      <div class="skeleton-group" [style.gap]="gap()">
        @for (item of items; track item) {
          <div
            class="skeleton"
            [attr.data-variant]="variant()"
            [attr.data-size]="size()"
            [attr.data-full]="width() ? null : 'true'"
            [attr.data-animated]="animated() ? null : 'false'"
            [style]="customStyle"
          ></div>
        }
      </div>
    } @else {
      <div
        class="skeleton"
        [attr.data-variant]="variant()"
        [attr.data-size]="size()"
        [attr.data-full]="width() ? null : 'true'"
        [attr.data-animated]="animated() ? null : 'false'"
        [style]="customStyle"
      ></div>
    }
    <ng-content />
  `,
        styles: [`
    .skeleton-group {
      display: flex;
      flex-direction: column;
    }
  `]
    })
], SkeletonComponent);
export { SkeletonComponent };
//# sourceMappingURL=skeleton.component.js.map