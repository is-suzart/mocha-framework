type StepsVariant = 'timeline' | 'carousel';
type StepsColor = 'rosewater' | 'flamingo' | 'pink' | 'mauve' | 'red' | 'maroon' | 'peach' | 'yellow' | 'green' | 'teal' | 'sky' | 'sapphire' | 'blue' | 'lavender';
export declare class StepsComponent {
    currentStep: import("@angular/core").InputSignal<number>;
    stepsCount: import("@angular/core").InputSignal<number>;
    labels: import("@angular/core").InputSignal<string[]>;
    variant: import("@angular/core").InputSignal<StepsVariant>;
    color: import("@angular/core").InputSignal<StepsColor>;
    orientation: import("@angular/core").InputSignal<"horizontal" | "vertical">;
    changeStep: import("@angular/core").OutputEmitterRef<number>;
    stepIndexes: import("@angular/core").Signal<number[]>;
    progressWidth: import("@angular/core").Signal<number>;
    onStepClick(index: number): void;
    getItemClass(index: number): string;
}
export {};
//# sourceMappingURL=steps.component.d.ts.map