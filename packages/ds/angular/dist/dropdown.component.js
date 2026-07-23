var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component, input, output, inject } from '@angular/core';
let DropdownComponent = class DropdownComponent {
    constructor() {
        this.isOpen = input(false);
        this.color = input('mauve');
        this.isOpenChange = output();
    }
    toggle() {
        this.isOpenChange.emit(!this.isOpen());
    }
    close() {
        this.isOpenChange.emit(false);
    }
};
DropdownComponent = __decorate([
    Component({
        selector: 'dropdown',
        standalone: true,
        template: `
    <div class="dropdown-wrapper" style="position:relative;display:inline-block">
      <ng-content select="[trigger]"></ng-content>
      @if (isOpen()) {
        <div
          class="dropdown-menu"
          [style.position]="'absolute'"
          [style.zIndex]="'1050'"
          role="menu"
        >
          <ng-content></ng-content>
        </div>
      }
    </div>
  `
    })
], DropdownComponent);
export { DropdownComponent };
let DropdownItemComponent = class DropdownItemComponent {
    constructor() {
        this.disabled = input(false);
        this.danger = input(false);
        this.color = input('mauve');
        this.parent = inject(DropdownComponent, { optional: true });
    }
    handleClick() {
        if (this.disabled())
            return;
        if (this.parent)
            this.parent.close();
    }
};
DropdownItemComponent = __decorate([
    Component({
        selector: 'dropdown-item',
        standalone: true,
        template: `
    <button
      type="button"
      class="dropdown-item"
      [attr.data-color]="danger() ? 'danger' : color()"
      [attr.data-state]="disabled() ? 'disabled' : null"
      [disabled]="disabled()"
      role="menuitem"
      (click)="handleClick()"
    >
      <ng-content></ng-content>
    </button>
  `
    })
], DropdownItemComponent);
export { DropdownItemComponent };
let DropdownDividerComponent = class DropdownDividerComponent {
};
DropdownDividerComponent = __decorate([
    Component({
        selector: 'dropdown-divider',
        standalone: true,
        template: '<div class="dropdown-divider" role="separator"></div>'
    })
], DropdownDividerComponent);
export { DropdownDividerComponent };
let DropdownHeaderComponent = class DropdownHeaderComponent {
};
DropdownHeaderComponent = __decorate([
    Component({
        selector: 'dropdown-header',
        standalone: true,
        template: '<div class="dropdown-header"><ng-content></ng-content></div>'
    })
], DropdownHeaderComponent);
export { DropdownHeaderComponent };
//# sourceMappingURL=dropdown.component.js.map