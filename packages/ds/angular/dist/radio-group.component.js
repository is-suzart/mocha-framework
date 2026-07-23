var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component, input, model, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
let RadioGroupComponent = class RadioGroupComponent {
    constructor() {
        this.value = model(null);
        this.name = input.required();
        this.options = input([]);
        this.color = input('mauve');
        this.disabled = input(false);
        this._onChange = () => { };
        this._onTouched = () => { };
    }
    writeValue(val) { this.value.set(val); }
    registerOnChange(fn) { this._onChange = fn; }
    registerOnTouched(fn) { this._onTouched = fn; }
    setDisabledState(isDisabled) { }
    onSelect(val) {
        this.value.set(val);
        this._onChange(val);
        this._onTouched();
    }
};
RadioGroupComponent = __decorate([
    Component({
        selector: 'radio-group',
        standalone: true,
        template: `
    <div [class]="'radio-group'" role="radiogroup">
      @for (opt of options(); track opt.value) {
        <label class="radio-item" [attr.data-state]="disabled() ? 'disabled' : null" [attr.data-color]="color()">
          <input
            type="radio"
            [name]="name()"
            [value]="opt.value"
            [checked]="value() === opt.value"
            [disabled]="disabled()"
            (change)="onSelect(opt.value)"
          />
          <span class="radio-circle">
            <span class="radio-dot"></span>
          </span>
          <span>{{ opt.label }}</span>
        </label>
      }
    </div>
  `,
        providers: [{
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => RadioGroupComponent),
                multi: true,
            }],
    })
], RadioGroupComponent);
export { RadioGroupComponent };
//# sourceMappingURL=radio-group.component.js.map