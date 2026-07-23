var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component, input, computed } from '@angular/core';
let ShellComponent = class ShellComponent {
    constructor() {
        this.layout = input('header-first');
        this.fullScreen = input(true);
        this.shellClass = computed(() => {
            return [
                'shell',
                `shell--${this.layout()}`,
                this.fullScreen() ? 'shell--full-screen' : '',
            ].filter(Boolean).join(' ');
        });
    }
};
ShellComponent = __decorate([
    Component({
        selector: 'shell',
        standalone: true,
        template: '<div [class]="shellClass()"><ng-content></ng-content></div>'
    })
], ShellComponent);
export { ShellComponent };
let ShellHeaderComponent = class ShellHeaderComponent {
};
ShellHeaderComponent = __decorate([
    Component({
        selector: 'shell-header',
        standalone: true,
        template: '<div class="shell-header"><ng-content></ng-content></div>'
    })
], ShellHeaderComponent);
export { ShellHeaderComponent };
let ShellSidebarComponent = class ShellSidebarComponent {
};
ShellSidebarComponent = __decorate([
    Component({
        selector: 'shell-sidebar',
        standalone: true,
        template: '<div class="shell-sidebar"><ng-content></ng-content></div>'
    })
], ShellSidebarComponent);
export { ShellSidebarComponent };
let ShellMainComponent = class ShellMainComponent {
};
ShellMainComponent = __decorate([
    Component({
        selector: 'shell-main',
        standalone: true,
        template: '<div class="shell-main"><ng-content></ng-content></div>'
    })
], ShellMainComponent);
export { ShellMainComponent };
let ShellContentComponent = class ShellContentComponent {
    constructor() {
        this.scrollable = input(false);
        this.contentClass = computed(() => {
            return [
                'shell-content',
                ,
            ].filter(Boolean).join(' ');
        });
    }
};
ShellContentComponent = __decorate([
    Component({
        selector: 'shell-content',
        standalone: true,
        template: '<div [class]="contentClass()"><ng-content></ng-content></div>'
    })
], ShellContentComponent);
export { ShellContentComponent };
//# sourceMappingURL=shell.component.js.map