import { ControlValueAccessor } from '@angular/forms';
import { FormControlSize, FormControlShape, FormControlColor } from './form-types';
interface SelectOption {
    label: string;
    value: any;
}
export declare class SelectComponent implements ControlValueAccessor {
    size: import("@angular/core").InputSignal<FormControlSize>;
    shape: import("@angular/core").InputSignal<FormControlShape>;
    color: import("@angular/core").InputSignal<FormControlColor>;
    error: import("@angular/core").InputSignal<boolean>;
    disabled: import("@angular/core").InputSignal<boolean>;
    options: import("@angular/core").InputSignal<SelectOption[]>;
    value: import("@angular/core").ModelSignal<any>;
    change: import("@angular/core").OutputEmitterRef<any>;
    private _onChange;
    private _onTouched;
    writeValue(val: any): void;
    registerOnChange(fn: any): void;
    registerOnTouched(fn: any): void;
    setDisabledState(isDisabled: boolean): void;
    onSelectChange(event: Event): void;
    onTouchedCallback(): void;
}
export {};
//# sourceMappingURL=select.component.d.ts.map