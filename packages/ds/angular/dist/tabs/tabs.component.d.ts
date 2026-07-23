export type TabsVariant = 'default' | 'underline' | 'pills' | 'segmented';
export type TabsOrientation = 'horizontal' | 'vertical';
export type TabsMode = 'state' | 'router';
export type TabColor = 'rosewater' | 'flamingo' | 'pink' | 'mauve' | 'red' | 'maroon' | 'peach' | 'yellow' | 'green' | 'teal' | 'sky' | 'sapphire' | 'blue' | 'lavender';
export declare class TabsComponent {
    value: import("@angular/core").InputSignal<string>;
    variant: import("@angular/core").InputSignal<TabsVariant>;
    size: import("@angular/core").InputSignal<string>;
    color: import("@angular/core").InputSignal<TabColor>;
    orientation: import("@angular/core").InputSignal<TabsOrientation>;
    mode: import("@angular/core").InputSignal<TabsMode>;
    valueChange: import("@angular/core").OutputEmitterRef<string>;
    private router;
    private route;
    activeValue: import("@angular/core").WritableSignal<string>;
    selectTab(val: string): void;
    isSelected(val: string): boolean;
}
//# sourceMappingURL=tabs.component.d.ts.map