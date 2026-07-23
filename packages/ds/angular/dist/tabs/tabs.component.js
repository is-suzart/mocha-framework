var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component, input, output, signal, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
let TabsComponent = class TabsComponent {
    constructor() {
        this.value = input('');
        this.variant = input('default');
        this.size = input('md');
        this.color = input('mauve');
        this.orientation = input('horizontal');
        this.mode = input('state');
        this.valueChange = output();
        this.router = inject(Router, { optional: true });
        this.route = inject(ActivatedRoute, { optional: true });
        this.activeValue = signal('');
    }
    selectTab(val) {
        this.activeValue.set(val);
        this.valueChange.emit(val);
        if (this.mode() === 'router' && this.router) {
            this.router.navigate([val], { relativeTo: this.route || undefined });
        }
    }
    isSelected(val) {
        if (this.mode() === 'router' && this.route) {
            return this.route.snapshot.url.map(s => s.path).includes(val);
        }
        return this.activeValue() === val;
    }
};
TabsComponent = __decorate([
    Component({
        selector: 'tabs',
        standalone: true,
        template: `
    <div class="tabs" [attr.data-orientation]="orientation()" [attr.data-color]="color()">
      <ng-content></ng-content>
    </div>
  `
    })
], TabsComponent);
export { TabsComponent };
//# sourceMappingURL=tabs.component.js.map