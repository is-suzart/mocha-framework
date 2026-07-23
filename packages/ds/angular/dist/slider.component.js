var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component, input, model, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
let SliderComponent = class SliderComponent {
    constructor() {
        this.value = model(50);
        this.min = input(0);
        this.max = input(100);
        this.color = input('mauve');
        this.showValue = input(true);
        this.disabled = input(false);
        this._onChange = () => { };
        this._onTouched = () => { };
    }
    writeValue(val) { this.value.set(Number(val) || 0); }
    registerOnChange(fn) { this._onChange = fn; }
    registerOnTouched(fn) { this._onTouched = fn; }
    setDisabledState(isDisabled) { }
    onSliderInput(event) {
        const val = Number(event.target.value);
        this.value.set(val);
        this._onChange(val);
    }
    onTouchedCallback() { this._onTouched(); }
};
SliderComponent = __decorate([
    Component({
        selector: 'slider',
        standalone: true,
        template: `
    <div class="slider-container" [attr.data-color]="color()">
      <input
        type="range"
        [min]="min()"
        [max]="max()"
        [value]="value()"
        [disabled]="disabled()"
        class="slider"
        (input)="onSliderInput($event)"
        (blur)="onTouchedCallback()"
      />
      @if (showValue()) {
        <span class="slider-value">{{ value() }}</span>
      }
    </div>
  `,
        providers: [{
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => SliderComponent),
                multi: true,
            }],
    })
], SliderComponent);
export { SliderComponent };
//# sourceMappingURL=slider.component.js.map