type ProgressBarSize = 'sm' | 'md' | 'lg';
type ProgressBarColor = 'rosewater' | 'flamingo' | 'pink' | 'mauve' | 'red' | 'maroon' | 'peach' | 'yellow' | 'green' | 'teal' | 'sky' | 'sapphire' | 'blue' | 'lavender';
export declare class ProgressBarComponent {
    value: import("@angular/core").InputSignal<number>;
    max: import("@angular/core").InputSignal<number>;
    size: import("@angular/core").InputSignal<ProgressBarSize>;
    color: import("@angular/core").InputSignal<ProgressBarColor>;
    striped: import("@angular/core").InputSignal<boolean>;
    animated: import("@angular/core").InputSignal<boolean>;
    indeterminate: import("@angular/core").InputSignal<boolean>;
    showValue: import("@angular/core").InputSignal<boolean>;
    valuePosition: import("@angular/core").InputSignal<"inside" | "outside">;
    label: import("@angular/core").InputSignal<string | undefined>;
    normalizedValue: import("@angular/core").Signal<number>;
    percent: import("@angular/core").Signal<number>;
    progressPercent: import("@angular/core").Signal<number>;
}
export {};
//# sourceMappingURL=progressbar.component.d.ts.map