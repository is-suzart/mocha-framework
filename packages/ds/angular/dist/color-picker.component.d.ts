import { ElementRef } from '@angular/core';
type ColorPickerVariant = 'swatches' | 'custom' | 'both';
type ColorPickerSize = 'sm' | 'md' | 'lg';
type ColorPickerColor = 'rosewater' | 'flamingo' | 'pink' | 'mauve' | 'red' | 'maroon' | 'peach' | 'yellow' | 'green' | 'teal' | 'sky' | 'sapphire' | 'blue' | 'lavender';
export declare class ColorPickerComponent {
    value: import("@angular/core").InputSignal<string>;
    flavor: import("@angular/core").InputSignal<"latte" | "frappe" | "macchiato" | "mocha">;
    variant: import("@angular/core").InputSignal<ColorPickerVariant>;
    size: import("@angular/core").InputSignal<ColorPickerSize>;
    color: import("@angular/core").InputSignal<ColorPickerColor>;
    showHexInput: import("@angular/core").InputSignal<boolean>;
    change: import("@angular/core").OutputEmitterRef<string>;
    popoverWrapper: ElementRef;
    pad: ElementRef;
    localHex: import("@angular/core").WritableSignal<string>;
    showPopover: boolean;
    h: import("@angular/core").WritableSignal<number>;
    s: import("@angular/core").WritableSignal<number>;
    v: import("@angular/core").WritableSignal<number>;
    constructor();
    swatches: import("@angular/core").Signal<{
        name: string;
        hex: any;
    }[]>;
    hueColor: import("@angular/core").Signal<string>;
    togglePopover(): void;
    onDocumentClick(event: MouseEvent): void;
    handleSwatchClick(hexVal: string): void;
    handlePadChange(clientX: number, clientY: number): void;
    handlePadMouseDown(e: MouseEvent): void;
    handlePadTouchStart(e: TouchEvent): void;
    handleHueSliderChange(e: Event): void;
    handleTextInputChange(e: Event): void;
}
export {};
//# sourceMappingURL=color-picker.component.d.ts.map