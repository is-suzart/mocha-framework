export type BadgeVariant = 'filled' | 'tonal' | 'outline' | 'flat';
export type BadgeSize = 'sm' | 'md' | 'lg';
export type BadgeShape = 'square' | 'rounded' | 'pill';
export type BadgeColor = 'rosewater' | 'flamingo' | 'pink' | 'mauve' | 'red' | 'maroon' | 'peach' | 'yellow' | 'green' | 'teal' | 'sky' | 'sapphire' | 'blue' | 'lavender';
export declare class BadgeComponent {
    variant: import("@angular/core").InputSignal<BadgeVariant>;
    size: import("@angular/core").InputSignal<BadgeSize>;
    shape: import("@angular/core").InputSignal<BadgeShape>;
    color: import("@angular/core").InputSignal<BadgeColor>;
    icon: import("@angular/core").InputSignal<string>;
    isDismissible: import("@angular/core").InputSignal<boolean>;
    dismiss: import("@angular/core").OutputEmitterRef<MouseEvent>;
}
//# sourceMappingURL=badge.component.d.ts.map