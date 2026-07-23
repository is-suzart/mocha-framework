type PopoverPlacement = 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end' | 'right' | 'right-start' | 'right-end';
export declare class PopoverComponent {
    placement: import("@angular/core").InputSignal<PopoverPlacement>;
    offset: import("@angular/core").InputSignal<number>;
    open: import("@angular/core").InputSignal<boolean | undefined>;
    openChange: import("@angular/core").OutputEmitterRef<boolean>;
    isOpen: boolean;
    top: number;
    left: number;
    actualPlacement: PopoverPlacement;
    private el;
    constructor();
    toggle(): void;
    openPopover(): void;
    closePopover(): void;
    onDocumentClick(event: MouseEvent): void;
    onEscape(): void;
    private updatePosition;
}
export {};
//# sourceMappingURL=popover.component.d.ts.map