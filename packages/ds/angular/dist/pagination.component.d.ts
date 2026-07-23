export type PaginationSize = 'sm' | 'md' | 'lg';
export type PaginationShape = 'square' | 'rounded' | 'pill';
export type PaginationColor = 'rosewater' | 'flamingo' | 'pink' | 'mauve' | 'red' | 'maroon' | 'peach' | 'yellow' | 'green' | 'teal' | 'sky' | 'sapphire' | 'blue' | 'lavender';
export declare const DOTS = "...";
export declare class PaginationComponent {
    currentPage: import("@angular/core").InputSignal<number>;
    totalPages: import("@angular/core").InputSignal<number>;
    siblingCount: import("@angular/core").InputSignal<number>;
    size: import("@angular/core").InputSignal<PaginationSize>;
    shape: import("@angular/core").InputSignal<PaginationShape>;
    color: import("@angular/core").InputSignal<PaginationColor>;
    pageChange: import("@angular/core").OutputEmitterRef<number>;
    protected range: import("@angular/core").Signal<(string | number)[]>;
    protected containerClass: import("@angular/core").Signal<string>;
    private getRange;
    goTo(page: number): void;
}
//# sourceMappingURL=pagination.component.d.ts.map