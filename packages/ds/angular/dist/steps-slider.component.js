var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, input, ContentChildren, QueryList, ElementRef, effect, Renderer2 } from '@angular/core';
let StepsSliderComponent = class StepsSliderComponent {
    constructor(renderer) {
        this.renderer = renderer;
        this.currentStep = input(0);
        effect(() => {
            this.updateChildrenClasses();
        });
    }
    ngAfterContentInit() {
        this.updateChildrenClasses();
        this.children.changes.subscribe(() => {
            this.updateChildrenClasses();
        });
    }
    updateChildrenClasses() {
        if (!this.children)
            return;
        this.children.forEach((child, index) => {
            const el = child.nativeElement;
            this.renderer.addClass(el, 'steps-content-slide');
            if (index === this.currentStep()) {
                this.renderer.addClass(el, 'steps-content-slide--active');
            }
            else {
                this.renderer.removeClass(el, 'steps-content-slide--active');
            }
        });
    }
};
__decorate([
    ContentChildren('*', { read: ElementRef }),
    __metadata("design:type", QueryList)
], StepsSliderComponent.prototype, "children", void 0);
StepsSliderComponent = __decorate([
    Component({
        selector: 'steps-slider',
        standalone: true,
        template: `
    <div class="steps-content-wrapper">
      <div
        class="steps-content-stage"
        [style.transform]="'translateX(-' + (currentStep() * 100) + '%)'"
      >
        <ng-content></ng-content>
      </div>
    </div>
  `
    }),
    __metadata("design:paramtypes", [Renderer2])
], StepsSliderComponent);
export { StepsSliderComponent };
//# sourceMappingURL=steps-slider.component.js.map