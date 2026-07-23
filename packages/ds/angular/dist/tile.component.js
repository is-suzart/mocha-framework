var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component, input, computed } from '@angular/core';
let TileComponent = class TileComponent {
    constructor() {
        this.variant = input('flat');
        this.size = input('md');
        this.shape = input('rounded');
        this.orientation = input('horizontal');
        this.color = input('mauve');
        this.indicator = input('none');
        this.isInteractive = input(false);
        this.isSelected = input(false);
        this.isDisabled = input(false);
        this.title = input(undefined);
        this.subtitle = input(undefined);
        this.hasIcon = input(false);
        this.hasContent = input(false);
        this.hasMeta = input(false);
        this.tileClass = computed(() => {
            return [
                'tile',
                `tile--${this.variant()}`,
                `tile--${this.size()}`,
                `tile--${this.shape()}`,
                `tile--${this.orientation()}`,
                this.color() ? `tile--${this.color()}` : '',
                this.indicator() !== 'none' ? `tile--indicator-${this.indicator()}` : '',
                this.isInteractive() ? 'tile--interactive' : '',
                this.isSelected() ? 'tile--selected' : '',
                this.isDisabled() ? 'tile--disabled' : ''
            ].filter(Boolean).join(' ');
        });
    }
};
TileComponent = __decorate([
    Component({
        selector: 'tile',
        standalone: true,
        template: `
    <div [class]="tileClass()">
      <ng-content>
        @if (hasIcon()) {
          <div class="tile-icon">
            <ng-content select="[icon]"></ng-content>
          </div>
        }
        @if (title() || subtitle() || hasContent()) {
          <div class="tile-content">
            @if (title()) {
              <span class="tile-title">{{ title() }}</span>
            }
            @if (subtitle()) {
              <span class="tile-subtitle">{{ subtitle() }}</span>
            }
            <ng-content select="[content]"></ng-content>
          </div>
        }
        @if (hasMeta()) {
          <div class="tile-meta">
            <ng-content select="[meta]"></ng-content>
          </div>
        }
      </ng-content>
    </div>
  `
    })
], TileComponent);
export { TileComponent };
//# sourceMappingURL=tile.component.js.map