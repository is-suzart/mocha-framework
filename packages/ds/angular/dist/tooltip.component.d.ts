import { ElementRef } from '@angular/core';
export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';
export declare class TooltipDirective {
    private el;
    content: import("@angular/core").InputSignal<string>;
    placement: import("@angular/core").InputSignal<TooltipPlacement>;
    color: import("@angular/core").InputSignal<string>;
    delay: import("@angular/core").InputSignal<number>;
    isVisible: boolean;
    private timeoutId;
    constructor(el: ElementRef);
    protected tooltipClass: import("@angular/core").Signal<string>;
    onMouseEnter(): void;
    onMouseLeave(): void;
    onFocus(): void;
    onBlur(): void;
}
//# sourceMappingURL=tooltip.component.d.ts.map