import { ElementRef, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
export type ButtonGroupVariant = 'filled' | 'outline' | 'ghost';
export type ButtonGroupSelectionMode = 'none' | 'single' | 'multiple';
export declare class ButtonGroupComponent implements ControlValueAccessor, AfterViewInit, OnDestroy {
    private cdr;
    orientation: import("@angular/core").InputSignal<"horizontal" | "vertical">;
    variant: import("@angular/core").InputSignal<ButtonGroupVariant>;
    shape: import("@angular/core").InputSignal<"square" | "rounded" | "pill">;
    selectionMode: import("@angular/core").InputSignal<ButtonGroupSelectionMode>;
    value: import("@angular/core").ModelSignal<any>;
    disabled: import("@angular/core").ModelSignal<boolean>;
    change: import("@angular/core").OutputEmitterRef<any>;
    containerRef: ElementRef<HTMLDivElement>;
    private buttonElementsMap;
    private resizeObserver?;
    onChangeFn: any;
    onTouchedFn: any;
    constructor(cdr: ChangeDetectorRef);
    protected isPillReady: import("@angular/core").Signal<boolean>;
    pillStyle: import("@angular/core").Signal<{
        opacity: string;
        pointerEvents: string;
        transform?: undefined;
        width?: undefined;
        height?: undefined;
    } | {
        transform: string;
        width: string;
        height: string;
        opacity?: undefined;
        pointerEvents?: undefined;
    }>;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    registerButton(val: any, el: HTMLElement): void;
    unregisterButton(val: any): void;
    selectButton(btnValue: any): void;
    isButtonActive(btnValue: any): boolean;
    writeValue(value: any): void;
    registerOnChange(fn: any): void;
    registerOnTouched(fn: any): void;
    setDisabledState?(isDisabled: boolean): void;
    handleKeyDown(e: KeyboardEvent): void;
}
//# sourceMappingURL=button-group.component.d.ts.map