export type TileVariant = 'flat' | 'elevated' | 'outline' | 'tonal' | 'colored';
export type TileSize = 'sm' | 'md' | 'lg';
export type TileShape = 'square' | 'rounded' | 'pill';
export type TileOrientation = 'horizontal' | 'vertical' | 'vertical-center';
export type TileIndicator = 'none' | 'top' | 'bottom' | 'left' | 'right';
export type TileColor = 'rosewater' | 'flamingo' | 'pink' | 'mauve' | 'red' | 'maroon' | 'peach' | 'yellow' | 'green' | 'teal' | 'sky' | 'sapphire' | 'blue' | 'lavender';
export declare class TileComponent {
    variant: import("@angular/core").InputSignal<TileVariant>;
    size: import("@angular/core").InputSignal<TileSize>;
    shape: import("@angular/core").InputSignal<TileShape>;
    orientation: import("@angular/core").InputSignal<TileOrientation>;
    color: import("@angular/core").InputSignal<TileColor>;
    indicator: import("@angular/core").InputSignal<TileIndicator>;
    isInteractive: import("@angular/core").InputSignal<boolean>;
    isSelected: import("@angular/core").InputSignal<boolean>;
    isDisabled: import("@angular/core").InputSignal<boolean>;
    title: import("@angular/core").InputSignal<string | undefined>;
    subtitle: import("@angular/core").InputSignal<string | undefined>;
    hasIcon: import("@angular/core").InputSignal<boolean>;
    hasContent: import("@angular/core").InputSignal<boolean>;
    hasMeta: import("@angular/core").InputSignal<boolean>;
    tileClass: import("@angular/core").Signal<string>;
}
//# sourceMappingURL=tile.component.d.ts.map