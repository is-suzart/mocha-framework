import { ControlValueAccessor } from '@angular/forms';
import { FormControlColor } from './form-types';
export declare class SwitchComponent implements ControlValueAccessor {
    label: import("@angular/core").InputSignal<string>;
    color: import("@angular/core").InputSignal<FormControlColor>;
    disabled: import("@angular/core").InputSignal<boolean>;
    checked: import("@angular/core").ModelSignal<boolean>;
    change: import("@angular/core").OutputEmitterRef<boolean>;
    private _onChange;
    private _onTouched;
    writeValue(val: any): void;
    registerOnChange(fn: any): void;
    registerOnTouched(fn: any): void;
    setDisabledState(isDisabled: boolean): void;
    onToggle(): void;
}
//# sourceMappingURL=switch.component.d.ts.map