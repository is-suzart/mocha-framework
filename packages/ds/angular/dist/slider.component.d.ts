import { ControlValueAccessor } from '@angular/forms';
import { FormControlColor } from './form-types';
export declare class SliderComponent implements ControlValueAccessor {
    value: import("@angular/core").ModelSignal<number>;
    min: import("@angular/core").InputSignal<number>;
    max: import("@angular/core").InputSignal<number>;
    color: import("@angular/core").InputSignal<FormControlColor>;
    showValue: import("@angular/core").InputSignal<boolean>;
    disabled: import("@angular/core").InputSignal<boolean>;
    private _onChange;
    private _onTouched;
    writeValue(val: any): void;
    registerOnChange(fn: any): void;
    registerOnTouched(fn: any): void;
    setDisabledState(isDisabled: boolean): void;
    onSliderInput(event: Event): void;
    onTouchedCallback(): void;
}
//# sourceMappingURL=slider.component.d.ts.map