type ButtonColor = 'rosewater' | 'flamingo' | 'pink' | 'mauve' | 'red' | 'maroon' | 'peach' | 'yellow' | 'green' | 'teal' | 'sky' | 'sapphire' | 'blue' | 'lavender';
export interface StepItem {
    label: string;
    description?: string;
    icon?: string;
}
export declare class StepperComponent {
    steps: import("@angular/core").InputSignal<StepItem[]>;
    currentStep: import("@angular/core").InputSignal<number>;
    orientation: import("@angular/core").InputSignal<"horizontal" | "vertical">;
    variant: import("@angular/core").InputSignal<"default" | "icon" | "dots" | "labeled-icon">;
    color: import("@angular/core").InputSignal<ButtonColor>;
    segments: import("@angular/core").Signal<number>;
    progressPercent: import("@angular/core").Signal<number>;
    cssStyle: import("@angular/core").Signal<{
        '--ctp-total-steps': string;
        '--ctp-stepper-progress': string;
    }>;
    getStepStatus(index: number): string;
}
export {};
//# sourceMappingURL=stepper.component.d.ts.map