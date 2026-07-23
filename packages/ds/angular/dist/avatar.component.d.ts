type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';
export declare class AvatarComponent {
    src: import("@angular/core").InputSignal<string>;
    alt: import("@angular/core").InputSignal<string>;
    fallback: import("@angular/core").InputSignal<string>;
    size: import("@angular/core").InputSignal<AvatarSize>;
    private imgHasError;
    imgError: import("@angular/core").Signal<boolean>;
    initials(): string;
    onError(): void;
}
export declare class AvatarGroupComponent {
    size: import("@angular/core").InputSignal<AvatarSize>;
    max: import("@angular/core").InputSignal<number | undefined>;
    remaining: number;
    get visibleItems(): number[];
    get moreStyle(): Record<string, string>;
}
export {};
//# sourceMappingURL=avatar.component.d.ts.map