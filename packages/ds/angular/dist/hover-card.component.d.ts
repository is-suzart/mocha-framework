type HoverCardPlacement = 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end' | 'right' | 'right-start' | 'right-end';
export declare class HoverCardComponent {
    placement: import("@angular/core").InputSignal<HoverCardPlacement>;
    offset: import("@angular/core").InputSignal<number>;
    openDelay: import("@angular/core").InputSignal<number>;
    closeDelay: import("@angular/core").InputSignal<number>;
    isVisible: boolean;
    top: number;
    left: number;
    actualPlacement: HoverCardPlacement;
    private timeoutId;
    private el;
    onMouseEnter(): void;
    onMouseLeave(): void;
    onFocus(): void;
    onBlur(): void;
    onCardEnter(): void;
    onCardLeave(): void;
    private updatePosition;
}
export {};
//# sourceMappingURL=hover-card.component.d.ts.map