export type CardVariant = 'filled' | 'elevated' | 'outline' | 'flat' | 'colored';
export type CardShape = 'square' | 'rounded' | 'pill';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';
export type CardAccentColor = 'rosewater' | 'flamingo' | 'pink' | 'mauve' | 'red' | 'maroon' | 'peach' | 'yellow' | 'green' | 'teal' | 'sky' | 'sapphire' | 'blue' | 'lavender';
export type CardAccentPosition = 'top' | 'left' | 'none';
export declare class CardComponent {
    variant: import("@angular/core").InputSignal<CardVariant>;
    shape: import("@angular/core").InputSignal<CardShape>;
    padding: import("@angular/core").InputSignal<CardPadding>;
    accentColor: import("@angular/core").InputSignal<CardAccentColor | undefined>;
    accentPosition: import("@angular/core").InputSignal<CardAccentPosition>;
    isInteractive: import("@angular/core").InputSignal<boolean>;
}
export declare class CardHeaderComponent {
    title: import("@angular/core").InputSignal<string>;
    subtitle: import("@angular/core").InputSignal<string>;
    hasAvatar: import("@angular/core").InputSignal<boolean>;
}
export declare class CardBodyComponent {
}
export declare class CardFooterComponent {
}
export declare class CardMediaComponent {
    src: import("@angular/core").InputSignal<string | undefined>;
    alt: import("@angular/core").InputSignal<string>;
}
//# sourceMappingURL=card.component.d.ts.map