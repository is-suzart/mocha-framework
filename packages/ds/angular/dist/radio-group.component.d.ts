import { ControlValueAccessor } from '@angular/forms';
import { FormControlColor } from './form-types';
export declare class RadioGroupComponent implements ControlValueAccessor {
    value: import("@angular/core").ModelSignal<any>;
    name: import("@angular/core").InputSignal<string>;
    options: import("@angular/core").InputSignal<{
        label: string;
        value: any;
    }[]>;
    color: import("@angular/core").InputSignal<FormControlColor>;
    disabled: import("@angular/core").InputSignal<boolean>;
    private _onChange;
    private _onTouched;
    writeValue(val: any): void;
    registerOnChange(fn: any): void;
    registerOnTouched(fn: any): void;
    setDisabledState(isDisabled: boolean): void;
    onSelect(val: any): void;
}
//# sourceMappingURL=radio-group.component.d.ts.map