var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component, input } from '@angular/core';
let CardComponent = class CardComponent {
    constructor() {
        this.variant = input('filled');
        this.shape = input('rounded');
        this.padding = input('md');
        this.accentColor = input(undefined);
        this.accentPosition = input('none');
        this.isInteractive = input(false);
    }
};
CardComponent = __decorate([
    Component({
        selector: 'card',
        standalone: true,
        host: {
            '[class.card]': 'true',
            '[attr.data-variant]': 'variant()',
            '[attr.data-shape]': 'shape()',
            '[attr.data-padding]': 'padding()',
            '[attr.data-color]': 'accentColor() || null',
            '[attr.data-accent]': 'accentColor() && accentPosition() !== "none" ? accentPosition() : null',
            '[attr.data-interactive]': 'isInteractive() ? "true" : null',
        },
        template: `<ng-content></ng-content>`
    })
], CardComponent);
export { CardComponent };
let CardHeaderComponent = class CardHeaderComponent {
    constructor() {
        this.title = input('');
        this.subtitle = input('');
        this.hasAvatar = input(false);
    }
};
CardHeaderComponent = __decorate([
    Component({
        selector: 'header[card-header]',
        standalone: true,
        host: {
            '[class.card-header]': 'true',
        },
        template: `
    @if (hasAvatar()) {
      <div class="card-avatar">
        <ng-content select="[avatar]"></ng-content>
      </div>
    }
    @if (title() || subtitle()) {
      <div class="card-header-content">
        @if (title()) {
          <h3 class="card-title">{{ title() }}</h3>
        }
        @if (subtitle()) {
          <p class="card-subtitle">{{ subtitle() }}</p>
        }
        <ng-content select="[header-content]"></ng-content>
      </div>
    }
    <ng-content></ng-content>
    <div class="card-actions">
      <ng-content select="[actions]"></ng-content>
    </div>
  `
    })
], CardHeaderComponent);
export { CardHeaderComponent };
let CardBodyComponent = class CardBodyComponent {
};
CardBodyComponent = __decorate([
    Component({
        selector: 'card-body, [card-body]',
        standalone: true,
        host: {
            '[class.card-body]': 'true',
        },
        template: `<ng-content></ng-content>`
    })
], CardBodyComponent);
export { CardBodyComponent };
let CardFooterComponent = class CardFooterComponent {
};
CardFooterComponent = __decorate([
    Component({
        selector: 'card-footer, [card-footer]',
        standalone: true,
        host: {
            '[class.card-footer]': 'true',
        },
        template: `<ng-content></ng-content>`
    })
], CardFooterComponent);
export { CardFooterComponent };
let CardMediaComponent = class CardMediaComponent {
    constructor() {
        this.src = input(undefined);
        this.alt = input('');
    }
};
CardMediaComponent = __decorate([
    Component({
        selector: 'card-media, [card-media]',
        standalone: true,
        host: {
            '[class.card-media]': 'true',
        },
        template: `
    @if (src()) {
      <img [src]="src()" [alt]="alt()" />
    } @else {
      <ng-content></ng-content>
    }
  `
    })
], CardMediaComponent);
export { CardMediaComponent };
//# sourceMappingURL=card.component.js.map