var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component, input, computed, inject } from '@angular/core';
import { TabsComponent } from './tabs.component';
let TabsContentComponent = class TabsContentComponent {
    constructor() {
        this.value = input.required();
        this.parent = inject(TabsComponent);
        this.isActive = computed(() => this.parent.isSelected(this.value()));
    }
};
TabsContentComponent = __decorate([
    Component({
        selector: 'tabs-content',
        standalone: true,
        template: `
    <div
      role="tabpanel"
      [id]="'tabpanel-' + value()"
      [attr.aria-labelledby]="'tabtrigger-' + value()"
      tabindex="0"
      class="tabs-content"
      [attr.data-state]="isActive() ? 'active' : null"
      [style.display]="isActive() ? '' : 'none'"
    >
      @if (isActive()) {
        <ng-content></ng-content>
      }
    </div>
  `
    })
], TabsContentComponent);
export { TabsContentComponent };
//# sourceMappingURL=tabs-content.component.js.map