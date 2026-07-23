var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component, input, computed } from '@angular/core';
let SidebarComponent = class SidebarComponent {
    constructor() {
        this.collapsed = input(false);
        this.collapsible = input(false);
        this.sidebarClass = computed(() => {
            return [
                'sidebar',
                this.collapsed() ? 'sidebar--collapsed' : '',
                this.collapsible() ? 'sidebar--collapsible' : '',
            ].filter(Boolean).join(' ');
        });
    }
};
SidebarComponent = __decorate([
    Component({
        selector: 'sidebar',
        standalone: true,
        template: '<aside [class]="sidebarClass()"><ng-content></ng-content></aside>'
    })
], SidebarComponent);
export { SidebarComponent };
let SidebarHeaderComponent = class SidebarHeaderComponent {
};
SidebarHeaderComponent = __decorate([
    Component({
        selector: 'sidebar-header',
        standalone: true,
        template: '<div class="sidebar-header"><ng-content></ng-content></div>'
    })
], SidebarHeaderComponent);
export { SidebarHeaderComponent };
let SidebarSectionComponent = class SidebarSectionComponent {
};
SidebarSectionComponent = __decorate([
    Component({
        selector: 'sidebar-section',
        standalone: true,
        template: '<div class="sidebar-section"><ng-content></ng-content></div>'
    })
], SidebarSectionComponent);
export { SidebarSectionComponent };
let SidebarItemComponent = class SidebarItemComponent {
    constructor() {
        this.active = input(false);
        this.icon = input('');
    }
};
SidebarItemComponent = __decorate([
    Component({
        selector: 'sidebar-item',
        standalone: true,
        template: `
    <a class="sidebar-item" [attr.data-state]="active() ? 'active' : null">
      @if (icon()) {
        <span class="sidebar-item-icon">{{ icon() }}</span>
      }
      <span class="sidebar-item-label"><ng-content></ng-content></span>
    </a>
  `
    })
], SidebarItemComponent);
export { SidebarItemComponent };
//# sourceMappingURL=sidebar.component.js.map