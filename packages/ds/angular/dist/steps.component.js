var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component, input, output, computed } from '@angular/core';
let StepsComponent = class StepsComponent {
    constructor() {
        this.currentStep = input(0);
        this.stepsCount = input(0);
        this.labels = input([]);
        this.variant = input('timeline');
        this.color = input('mauve');
        this.orientation = input('horizontal');
        this.changeStep = output();
        this.stepIndexes = computed(() => Array.from({ length: this.stepsCount() }, (_, i) => i));
        this.progressWidth = computed(() => {
            const count = this.stepsCount();
            if (count <= 1)
                return 0;
            return (this.currentStep() / (count - 1)) * 100;
        });
    }
    onStepClick(index) {
        this.changeStep.emit(index);
    }
    getItemClass(index) {
        const isActive = index === this.currentStep();
        const isCompleted = index < this.currentStep();
        return [
            'steps-item',
            isActive ? 'steps-item--active' : '',
            isCompleted ? 'steps-item--completed' : ''
        ]
            .filter(Boolean)
            .join(' ');
    }
};
StepsComponent = __decorate([
    Component({
        selector: 'steps',
        standalone: true,
        template: `
    @if (variant() === 'carousel') {
      <div class="steps-carousel" [attr.data-color]="color()">
        @for (i of stepIndexes(); track i) {
          <button
            [class]="'steps-carousel-dot ' + (i === currentStep() ? 'steps-carousel-dot--active' : '')"
            (click)="onStepClick(i)"
            [attr.aria-label]="'Go to step ' + (i + 1)"
          ></button>
        }
      </div>
    }

    @if (variant() === 'timeline') {
      <div
        [class]="'steps-timeline ' + (orientation() === 'vertical' ? 'steps-timeline--vertical' : 'steps-timeline--horizontal') + ' steps--' + color()"
      >
        <div class="steps-track">
          <div
            class="steps-progress"
            [style.width.%]="orientation() === 'horizontal' ? progressWidth() : null"
            [style.height.%]="orientation() === 'vertical' ? progressWidth() : null"
          ></div>
        </div>

        @for (i of stepIndexes(); track i) {
          <button
            [class]="getItemClass(i)"
            (click)="onStepClick(i)"
            [attr.aria-label]="'Step ' + (i + 1)"
          >
            <div class="steps-dot"></div>
            @if (labels() && labels()[i]) {
              <span class="steps-label">{{ labels()[i] }}</span>
            }
          </button>
        }
      </div>
    }
  `
    })
], StepsComponent);
export { StepsComponent };
//# sourceMappingURL=steps.component.js.map