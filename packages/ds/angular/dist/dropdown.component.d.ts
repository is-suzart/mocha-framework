export type DropdownColor = 'rosewater' | 'flamingo' | 'pink' | 'mauve' | 'red' | 'maroon' | 'peach' | 'yellow' | 'green' | 'teal' | 'sky' | 'sapphire' | 'blue' | 'lavender';
export declare class DropdownComponent {
    isOpen: import("@angular/core").InputSignal<boolean>;
    color: import("@angular/core").InputSignal<DropdownColor>;
    isOpenChange: import("@angular/core").OutputEmitterRef<boolean>;
    toggle(): void;
    close(): void;
}
export declare class DropdownItemComponent {
    disabled: import("@angular/core").InputSignal<boolean>;
    danger: import("@angular/core").InputSignal<boolean>;
    color: import("@angular/core").InputSignal<DropdownColor>;
    parent: DropdownComponent | null;
    handleClick(): void;
}
export declare class DropdownDividerComponent {
}
export declare class DropdownHeaderComponent {
}
//# sourceMappingURL=dropdown.component.d.ts.map