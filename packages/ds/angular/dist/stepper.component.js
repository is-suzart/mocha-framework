var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component, input, computed } from '@angular/core';
let StepperComponent = class StepperComponent {
    constructor() {
        this.steps = input([]);
        this.currentStep = input(0);
        this.orientation = input('horizontal');
        this.variant = input('default');
        this.color = input('mauve');
        this.segments = computed(() => Math.max(1, this.steps().length - 1));
        this.progressPercent = computed(() => {
            return Math.min(100, Math.max(0, (this.currentStep() / this.segments()) * 100));
        });
        this.cssStyle = computed(() => {
            return {
                '--ctp-total-steps': String(this.steps().length),
                '--ctp-stepper-progress': `${this.progressPercent()}%`,
            };
        });
    }
    getStepStatus(index) {
        let status = 'upcoming';
        if (index < this.currentStep()) {
            status = 'completed';
        }
        else if (index === this.currentStep()) {
            status = 'active';
        }
        return status;
    }
};
StepperComponent = __decorate([
    Component({
        selector: 'stepper',
        standalone: true,
        template: `
    <div
      class="stepper-wrapper stepper"
      [attr.data-orientation]="orientation()"
      [attr.data-state]="variant()"
      [attr.data-color]="color()"
      [style]="cssStyle()"
    >
      <!-- Background line track -->
      <div class="stepper-track">
        <div class="stepper-track-active"></div>
      </div>

      <!-- Steps -->
      @for (step of steps(); track $index) {
        <div class="stepper-step" [attr.data-state]="getStepStatus($index)">
          <!-- Step node icon / dot / number -->
          <div class="stepper-node">
            @if (variant() !== 'dots') {
              @if ($index < currentStep()) {
                <!-- Completed check icon -->
                <svg viewBox="0 0 24 24" fill="currentColor" style="width: 1.1em; height: 1.1em">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              } @else if ((variant() === 'icon' || variant() === 'labeled-icon') && step.icon) {
                <span>{{ step.icon }}</span>
              } @else {
                <span>{{ $index + 1 }}</span>
              }
            }
          </div>

          <!-- Vertical track segment inside step item for vertical layout styling -->
          @if (orientation() === 'vertical' && $index < steps().length - 1) {
            <div class="stepper-track">
              <div 
                class="stepper-track-active"
                [style.height]="$index < currentStep() ? '100%' : $index === currentStep() ? '50%' : '0%'"
              ></div>
            </div>
          }

          <!-- Labels -->
          @if (!(variant() === 'dots' && orientation() === 'horizontal')) {
            <div class="stepper-label-group">
              <h4 class="stepper-title">{{ step.label }}</h4>
              @if (step.description) {
                <p class="stepper-description">{{ step.description }}</p>
              }
            </div>
          }
        </div>
      }
    </div>
  `
    })
], StepperComponent);
export { StepperComponent };
//# sourceMappingURL=stepper.component.js.map