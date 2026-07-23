import { ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
export type AnimationName = 'fade-in' | 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'scale-in' | 'slide-up' | 'slide-down' | 'blur-in' | 'bounce-in' | 'spin' | 'pulse';
export type AnimationDuration = 'fast' | 'normal' | 'slow' | 'slower' | 'slowest';
export type AnimationEasing = 'out' | 'in-out' | 'spring';
export declare class AnimateComponent implements AfterViewInit, OnDestroy {
    animation: import("@angular/core").InputSignal<AnimationName>;
    duration: import("@angular/core").InputSignal<AnimationDuration>;
    delay: import("@angular/core").InputSignal<number>;
    easing: import("@angular/core").InputSignal<AnimationEasing>;
    once: import("@angular/core").InputSignal<boolean>;
    threshold: import("@angular/core").InputSignal<number>;
    containerRef: ElementRef<HTMLDivElement>;
    private visible;
    private observer;
    get isBrowser(): boolean;
    animClass: import("@angular/core").Signal<string>;
    animStyle: import("@angular/core").Signal<Record<string, string | null>>;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    private createObserver;
}
//# sourceMappingURL=animate.component.d.ts.map