var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component, inject } from '@angular/core';
import { TabsComponent } from './tabs.component';
let TabsListComponent = class TabsListComponent {
    constructor() {
        this.parent = inject(TabsComponent);
    }
    handleKeyDown(event) {
        const list = event.currentTarget;
        const triggers = Array.from(list.querySelectorAll('[role="tab"]:not([disabled])'));
        const activeIndex = triggers.findIndex(el => el.getAttribute('aria-selected') === 'true');
        if (activeIndex === -1)
            return;
        let nextIndex = activeIndex;
        const isHorizontal = this.parent.orientation() === 'horizontal';
        if (isHorizontal) {
            if (event.key === 'ArrowRight') {
                nextIndex = (activeIndex + 1) % triggers.length;
            }
            else if (event.key === 'ArrowLeft') {
                nextIndex = (activeIndex - 1 + triggers.length) % triggers.length;
            }
        }
        else {
            if (event.key === 'ArrowDown') {
                nextIndex = (activeIndex + 1) % triggers.length;
            }
            else if (event.key === 'ArrowUp') {
                nextIndex = (activeIndex - 1 + triggers.length) % triggers.length;
            }
        }
        if (nextIndex !== activeIndex) {
            event.preventDefault();
            const nextTrigger = triggers[nextIndex];
            nextTrigger.focus();
            nextTrigger.click();
        }
    }
};
TabsListComponent = __decorate([
    Component({
        selector: 'tabs-list',
        standalone: true,
        template: `
    <div
      role="tablist"
      [attr.aria-orientation]="parent.orientation()"
      class="tabs-list"
      [attr.data-variant]="parent.variant()"
      (keydown)="handleKeyDown($event)"
    >
      <ng-content></ng-content>
    </div>
  `
    })
], TabsListComponent);
export { TabsListComponent };
//# sourceMappingURL=tabs-list.component.js.map