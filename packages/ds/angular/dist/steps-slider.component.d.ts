import { QueryList, ElementRef, AfterContentInit, Renderer2 } from '@angular/core';
export declare class StepsSliderComponent implements AfterContentInit {
    private renderer;
    currentStep: import("@angular/core").InputSignal<number>;
    children: QueryList<ElementRef>;
    constructor(renderer: Renderer2);
    ngAfterContentInit(): void;
    private updateChildrenClasses;
}
//# sourceMappingURL=steps-slider.component.d.ts.map