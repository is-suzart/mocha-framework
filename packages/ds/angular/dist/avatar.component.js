var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component, input, signal } from '@angular/core';
let AvatarComponent = class AvatarComponent {
    constructor() {
        this.src = input('');
        this.alt = input('');
        this.fallback = input('');
        this.size = input('md');
        this.imgHasError = signal(false);
        this.imgError = this.imgHasError.asReadonly();
    }
    initials() {
        const fb = this.fallback();
        if (!fb)
            return '?';
        if (fb.length <= 2)
            return fb;
        return fb
            .split(' ')
            .map(w => w[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    }
    onError() {
        this.imgHasError.set(true);
    }
};
AvatarComponent = __decorate([
    Component({
        selector: 'avatar',
        standalone: true,
        template: `
    <div class="avatar" [attr.data-size]="size()" [attr.aria-label]="alt() || fallback() || 'Avatar'">
      @if (src() && !imgError()) {
        <img [src]="src()" [alt]="alt()" (error)="onError()" />
      } @else {
        <span class="avatar-fallback">{{ initials() }}</span>
      }
    </div>
  `
    })
], AvatarComponent);
export { AvatarComponent };
let AvatarGroupComponent = class AvatarGroupComponent {
    constructor() {
        this.size = input('md');
        this.max = input(undefined);
        this.remaining = 0;
    }
    get visibleItems() {
        return [];
    }
    get moreStyle() {
        const s = this.size();
        const px = s === 'sm' ? '28px' : s === 'lg' ? '48px' : '36px';
        return { width: px, height: px };
    }
};
AvatarGroupComponent = __decorate([
    Component({
        selector: 'avatar-group',
        standalone: true,
        template: `
    <div class="avatar-group" [attr.data-size]="size()">
      @for (item of visibleItems; track item) {
        <ng-content select="avatar" />
      }
      @if (remaining > 0) {
        <span class="avatar-group-more" [style]="moreStyle">
          +{{ remaining }}
        </span>
      }
    </div>
  `
    })
], AvatarGroupComponent);
export { AvatarGroupComponent };
//# sourceMappingURL=avatar.component.js.map