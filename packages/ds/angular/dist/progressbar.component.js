var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component, input, computed } from '@angular/core';
let ProgressBarComponent = class ProgressBarComponent {
    constructor() {
        this.value = input(0);
        this.max = input(100);
        this.size = input('md');
        this.color = input('mauve');
        this.striped = input(false);
        this.animated = input(false);
        this.indeterminate = input(false);
        this.showValue = input(false);
        this.valuePosition = input('outside');
        this.label = input(undefined);
        this.normalizedValue = computed(() => {
            if (this.indeterminate())
                return 0;
            return Math.min(this.max(), Math.max(0, this.value()));
        });
        this.percent = computed(() => {
            if (this.max() <= 0)
                return 0;
            return (this.normalizedValue() / this.max()) * 100;
        });
        this.progressPercent = computed(() => {
            return Math.round(this.percent());
        });
    }
};
ProgressBarComponent = __decorate([
    Component({
        selector: 'progressbar',
        standalone: true,
        template: `
    <div
      class="progressbar"
      [attr.data-size]="size()"
      [attr.data-color]="color()"
      [attr.data-state]="indeterminate() ? 'indeterminate' : (animated() ? 'animated' : (striped() ? 'striped' : null))"
      role="progressbar"
      [attr.aria-valuenow]="indeterminate() ? null : normalizedValue()"
      [attr.aria-valuemin]="indeterminate() ? null : 0"
      [attr.aria-valuemax]="indeterminate() ? null : max()"
      [attr.aria-label]="label() || null"
    >
      <!-- Label group outside -->
      @if (label() || (showValue() && valuePosition() === 'outside')) {
        <div class="progressbar-label-group">
          @if (label()) {
            <span class="progressbar-label">{{ label() }}</span>
          }
          @if (showValue() && valuePosition() === 'outside' && !indeterminate()) {
            <span class="progressbar-value-text">
              {{ progressPercent() }}%
            </span>
          }
        </div>
      }

      <!-- Track & Fill -->
      <div class="progressbar-track">
        <div
          class="progressbar-fill"
          [style.width.%]="indeterminate() ? null : percent()"
        >
          <!-- Value inside -->
          @if (showValue() && valuePosition() === 'inside' && size() === 'lg' && !indeterminate()) {
            <span class="progressbar-value-inside">
              {{ progressPercent() }}%
            </span>
          }
        </div>
      </div>
    </div>
  `
    })
], ProgressBarComponent);
export { ProgressBarComponent };
//# sourceMappingURL=progressbar.component.js.map