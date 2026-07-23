export declare class CarouselComponent {
    showArrows: import("@angular/core").InputSignal<boolean>;
    showDots: import("@angular/core").InputSignal<boolean>;
    autoPlay: import("@angular/core").InputSignal<boolean>;
    autoPlayInterval: import("@angular/core").InputSignal<number>;
    current: import("@angular/core").WritableSignal<number>;
    slides: number[];
    private intervalId;
    constructor();
    goTo(index: number): void;
    prev(): void;
    next(): void;
}
//# sourceMappingURL=carousel.component.d.ts.map