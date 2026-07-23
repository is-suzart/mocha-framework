export type GridGap = 0 | 1 | 2 | 3 | 4 | 5;
export type GridAlign = 'start' | 'center' | 'end' | 'space-between' | 'space-around';
export type GridValign = 'start' | 'center' | 'end';
export type GridColSpan = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export type GridOffset = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
export declare class GridComponent {
    mobile: import("@angular/core").InputSignal<boolean>;
    multiline: import("@angular/core").InputSignal<boolean>;
    gap: import("@angular/core").InputSignal<GridGap>;
    align: import("@angular/core").InputSignal<GridAlign | undefined>;
    valign: import("@angular/core").InputSignal<GridValign | undefined>;
    protected gridClass: import("@angular/core").Signal<string>;
}
export declare class GridColComponent {
    span: import("@angular/core").InputSignal<GridColSpan>;
    offset: import("@angular/core").InputSignal<GridOffset | undefined>;
    protected colClass: import("@angular/core").Signal<string>;
}
//# sourceMappingURL=grid.component.d.ts.map