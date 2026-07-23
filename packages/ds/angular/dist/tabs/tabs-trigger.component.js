var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component, input, computed, inject } from '@angular/core';
import { TabsComponent } from './tabs.component';
let TabsTriggerComponent = class TabsTriggerComponent {
    constructor() {
        this.value = input.required();
        this.disabled = input(false);
        this.routerLink = input('');
        this.parent = inject(TabsComponent);
        this.isSelected = computed(() => this.parent.isSelected(this.value()));
    }
    handleClick() {
        if (this.disabled())
            return;
        this.parent.selectTab(this.value());
    }
};
TabsTriggerComponent = __decorate([
    Component({
        selector: 'tabs-trigger',
        standalone: true,
        template: `
    <button
      type="button"
      role="tab"
      [attr.aria-selected]="isSelected()"
      [attr.aria-controls]="'tabpanel-' + value()"
      [id]="'tabtrigger-' + value()"
      [attr.data-value]="value()"
      [attr.tabindex]="isSelected() ? 0 : -1"
      [disabled]="disabled()"
      class="tabs-trigger"
      [attr.data-variant]="parent.variant()"
      [attr.data-size]="parent.size()"
      [attr.data-state]="isSelected() ? 'active' : null"
      (click)="handleClick()"
    >
      <ng-content></ng-content>
    </button>
  `
    })
], TabsTriggerComponent);
export { TabsTriggerComponent };
//# sourceMappingURL=tabs-trigger.component.js.map