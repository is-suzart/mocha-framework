type SkeletonVariant = 'text' | 'circle' | 'rect';
type SkeletonSize = 'sm' | 'md' | 'lg' | 'xl';
export declare class SkeletonComponent {
    variant: import("@angular/core").InputSignal<SkeletonVariant>;
    size: import("@angular/core").InputSignal<SkeletonSize>;
    width: import("@angular/core").InputSignal<string>;
    height: import("@angular/core").InputSignal<string>;
    animated: import("@angular/core").InputSignal<boolean>;
    count: import("@angular/core").InputSignal<number>;
    gap: import("@angular/core").InputSignal<string>;
    get items(): number[];
    get classes(): string;
    get customStyle(): Record<string, string>;
}
export {};
//# sourceMappingURL=skeleton.component.d.ts.map