var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component, input, model, output, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
let TextAreaComponent = class TextAreaComponent {
    constructor() {
        this.size = input('md');
        this.shape = input('rounded');
        this.color = input('mauve');
        this.error = input(false);
        this.disabled = input(false);
        this.placeholder = input('');
        this.value = model('');
        this.change = output();
        this._onChange = () => { };
        this._onTouched = () => { };
    }
    writeValue(val) { this.value.set(val ?? ''); }
    registerOnChange(fn) { this._onChange = fn; }
    registerOnTouched(fn) { this._onTouched = fn; }
    setDisabledState(isDisabled) { }
    onInputChange(event) {
        const val = event.target.value;
        this.value.set(val);
        this._onChange(val);
        this.change.emit(val);
    }
    onTouchedCallback() { this._onTouched(); }
};
TextAreaComponent = __decorate([
    Component({
        selector: 'textarea[textarea]',
        standalone: true,
        template: '',
        host: {
            '[class.form-control]': 'true',
            '[attr.data-size]': 'size()',
            '[attr.data-shape]': 'shape()',
            '[attr.data-state]': 'error() ? "error" : null',
            '[attr.data-color]': 'color()',
            '[disabled]': 'disabled() ? true : null',
            '[placeholder]': 'placeholder()',
            '(input)': 'onInputChange($event)',
            '(blur)': 'onTouchedCallback()',
        },
        providers: [{
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => TextAreaComponent),
                multi: true,
            }],
    })
], TextAreaComponent);
export { TextAreaComponent };
//# sourceMappingURL=textarea.component.js.map