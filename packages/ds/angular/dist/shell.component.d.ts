export type ShellLayout = 'header-first' | 'sidebar-first' | 'simple' | 'custom';
export declare class ShellComponent {
    layout: import("@angular/core").InputSignal<ShellLayout>;
    fullScreen: import("@angular/core").InputSignal<boolean>;
    protected shellClass: import("@angular/core").Signal<string>;
}
export declare class ShellHeaderComponent {
}
export declare class ShellSidebarComponent {
}
export declare class ShellMainComponent {
}
export declare class ShellContentComponent {
    scrollable: import("@angular/core").InputSignal<boolean>;
    protected contentClass: import("@angular/core").Signal<string>;
}
//# sourceMappingURL=shell.component.d.ts.map