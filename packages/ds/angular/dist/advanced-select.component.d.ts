import { ElementRef } from '@angular/core';
export type SelectColor = 'rosewater' | 'flamingo' | 'pink' | 'mauve' | 'red' | 'maroon' | 'peach' | 'yellow' | 'green' | 'teal' | 'sky' | 'sapphire' | 'blue' | 'lavender';
export interface SelectOption {
    label: string;
    value: string;
}
export declare class MultiSelectComponent {
    private el;
    options: import("@angular/core").InputSignal<SelectOption[]>;
    value: import("@angular/core").InputSignal<string[]>;
    placeholder: import("@angular/core").InputSignal<string>;
    searchable: import("@angular/core").InputSignal<boolean>;
    color: import("@angular/core").InputSignal<SelectColor>;
    valueChange: import("@angular/core").OutputEmitterRef<string[]>;
    isOpen: import("@angular/core").WritableSignal<boolean>;
    searchQuery: import("@angular/core").WritableSignal<string>;
    constructor(el: ElementRef);
    protected containerClass: import("@angular/core").Signal<string>;
    protected selectedLabels: import("@angular/core").Signal<string[]>;
    protected filteredOptions: import("@angular/core").Signal<SelectOption[]>;
    isSelected(val: string): boolean;
    toggleOpen(): void;
    toggleOption(val: string): void;
    onSearch(event: Event): void;
    private handleClickOutside;
}
//# sourceMappingURL=advanced-select.component.d.ts.map