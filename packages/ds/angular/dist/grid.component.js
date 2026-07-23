var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component, input, computed } from '@angular/core';
let GridComponent = class GridComponent {
    constructor() {
        this.mobile = input(false);
        this.multiline = input(true);
        this.gap = input(3);
        this.align = input(undefined);
        this.valign = input(undefined);
        this.gridClass = computed(() => {
            return [
                'grid',
                this.mobile() ? 'grid-mobile' : '',
                this.multiline() ? 'grid-multiline' : '',
                `grid-gap-${this.gap()}`,
                this.align() ? `grid-align-${this.align()}` : '',
                this.valign() ? `grid-valign-${this.valign()}` : '',
            ].filter(Boolean).join(' ');
        });
    }
};
GridComponent = __decorate([
    Component({
        selector: 'grid',
        standalone: true,
        template: '<div [class]="gridClass()"><ng-content></ng-content></div>'
    })
], GridComponent);
export { GridComponent };
let GridColComponent = class GridColComponent {
    constructor() {
        this.span = input(12);
        this.offset = input(undefined);
        this.colClass = computed(() => {
            return [
                'grid-col',
                `grid-col-${this.span()}`,
                this.offset() ? `grid-col-offset-${this.offset()}` : '',
            ].filter(Boolean).join(' ');
        });
    }
};
GridColComponent = __decorate([
    Component({
        selector: 'grid-col',
        standalone: true,
        template: '<div [class]="colClass()"><ng-content></ng-content></div>'
    })
], GridColComponent);
export { GridColComponent };
//# sourceMappingURL=grid.component.js.map