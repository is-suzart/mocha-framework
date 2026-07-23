import { ControlValueAccessor } from '@angular/forms';
import { FormControlSize, FormControlColor } from './form-types';
export declare class TextAreaComponent implements ControlValueAccessor {
    size: import("@angular/core").InputSignal<FormControlSize>;
    shape: import("@angular/core").InputSignal<"square" | "rounded">;
    color: import("@angular/core").InputSignal<FormControlColor>;
    error: import("@angular/core").InputSignal<boolean>;
    disabled: import("@angular/core").InputSignal<boolean>;
    placeholder: import("@angular/core").InputSignal<string>;
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
//# sourceMappingURL=textarea.component.d.ts.map