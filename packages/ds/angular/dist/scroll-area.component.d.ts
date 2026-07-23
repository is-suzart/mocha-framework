import { ElementRef } from '@angular/core';
export declare class ScrollAreaComponent {
    height: import("@angular/core").InputSignal<string>;
    viewportEl: ElementRef<HTMLDivElement>;
    showVertical: import("@angular/core").WritableSignal<boolean>;
    showHorizontal: import("@angular/core").WritableSignal<boolean>;
    thumbTop: import("@angular/core").WritableSignal<number>;
    thumbLeft: import("@angular/core").WritableSignal<number>;
    thumbHeight: import("@angular/core").WritableSignal<number>;
    thumbWidth: import("@angular/core").WritableSignal<number>;
    isDraggingV: boolean;
    isDraggingH: boolean;
    updateThumbs(): void;
    startDragV(e: MouseEvent): void;
    startDragH(e: MouseEvent): void;
}
//# sourceMappingURL=scroll-area.component.d.ts.map