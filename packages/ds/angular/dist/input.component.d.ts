import { ControlValueAccessor } from '@angular/forms';
import { FormControlSize, FormControlShape, FormControlColor } from './form-types';
export declare class InputComponent implements ControlValueAccessor {
    size: import("@angular/core").InputSignal<FormControlSize>;
    shape: import("@angular/core").InputSignal<FormControlShape>;
    color: import("@angular/core").InputSignal<FormControlColor>;
    error: import("@angular/core").InputSignal<boolean>;
    disabled: import("@angular/core").InputSignal<boolean>;
    placeholder: import("@angular/core").InputSignal<string>;
    type: import("@angular/core").InputSignal<string>;
    value: import("@angular/core").ModelSignal<string>;
    change: import("@angular/core").OutputEmitterRef<string>;
    private _onChange;
    private _onTouched;
    writeValue(val: any): void;
    registerOnChange(fn: any): void;
    registerOnTouched(fn: any): void;
    setDisabledState(isDisabled: boolean): void;
    onInputChange(event: Event): void;
    onTouchedCallback(): void;
}
//# sourceMappingURL=input.component.d.ts.map