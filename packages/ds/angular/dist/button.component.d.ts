import { AfterViewInit, OnDestroy } from '@angular/core';
export type ButtonVariant = 'filled' | 'tonal' | 'outline' | 'ghost';
export type ButtonColor = 'rosewater' | 'flamingo' | 'pink' | 'mauve' | 'red' | 'maroon' | 'peach' | 'yellow' | 'green' | 'teal' | 'sky' | 'sapphire' | 'blue' | 'lavender';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonShape = 'square' | 'rounded' | 'pill';
export declare class ButtonComponent implements AfterViewInit, OnDestroy {
    variant: import("@angular/core").InputSignal<ButtonVariant>;
    color: import("@angular/core").InputSignal<ButtonColor>;
    size: import("@angular/core").InputSignal<ButtonSize>;
    shape: import("@angular/core").InputSignal<ButtonShape>;
    isLoading: import("@angular/core").InputSignal<boolean>;
    leftIcon: import("@angular/core").InputSignal<string>;
    rightIcon: import("@angular/core").InputSignal<string>;
    value: import("@angular/core").InputSignal<any>;
    disabled: import("@angular/core").InputSignal<boolean>;
    click: import("@angular/core").OutputEmitterRef<MouseEvent>;
    private buttonGroup;
    private el;
    isGroupSingle: import("@angular/core").Signal<boolean>;
    isGroupDisabled: import("@angular/core").Signal<boolean>;
    isDisabled: import("@angular/core").Signal<boolean>;
    isActive: import("@angular/core").Signal<boolean>;
    resolvedState: import("@angular/core").Signal<string | undefined>;
    handleClick(event: MouseEvent): void;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
}
//# sourceMappingURL=button.component.d.ts.map