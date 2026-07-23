var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component, input, model, output, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
let SwitchComponent = class SwitchComponent {
    constructor() {
        this.label = input.required();
        this.color = input('mauve');
        this.disabled = input(false);
        this.checked = model(false);
        this.change = output();
        this._onChange = () => { };
        this._onTouched = () => { };
    }
    writeValue(val) { this.checked.set(!!val); }
    registerOnChange(fn) { this._onChange = fn; }
    registerOnTouched(fn) { this._onTouched = fn; }
    setDisabledState(isDisabled) { }
    onToggle() {
        const next = !this.checked();
        this.checked.set(next);
        this._onChange(next);
        this._onTouched();
        this.change.emit(next);
    }
};
SwitchComponent = __decorate([
    Component({
        selector: 'switch',
        standalone: true,
        template: `
    <label
      class="switch-row"
      [attr.data-state]="disabled() ? 'disabled' : null"
      [attr.data-color]="color()"
    >
      <input
        type="checkbox"
        [disabled]="disabled()"
        [checked]="checked()"
        (change)="onToggle()"
      />
      <span class="switch-track">
        <span class="switch-thumb"></span>
      </span>
      <span>{{ label() }}</span>
    </label>
  `,
        providers: [{
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => SwitchComponent),
                multi: true,
            }],
    })
], SwitchComponent);
export { SwitchComponent };
//# sourceMappingURL=switch.component.js.map