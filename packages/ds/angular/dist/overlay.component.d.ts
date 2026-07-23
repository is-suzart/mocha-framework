import { OnDestroy, ElementRef } from '@angular/core';
export declare class OverlayComponent implements OnDestroy {
    isOpen: import("@angular/core").InputSignal<boolean>;
    closeOnOverlayClick: import("@angular/core").InputSignal<boolean>;
    closeOnEsc: import("@angular/core").InputSignal<boolean>;
    placement: import("@angular/core").InputSignal<string>;
    close: import("@angular/core").OutputEmitterRef<void>;
    overlayElement: ElementRef;
    shouldRender: boolean;
    isAnimatedIn: boolean;
    zIndex: number;
    private timeoutId;
    constructor();
    ngOnDestroy(): void;
    handleOverlayClick(event: MouseEvent): void;
    private handleKeyDown;
}
//# sourceMappingURL=overlay.component.d.ts.map