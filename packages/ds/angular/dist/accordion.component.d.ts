import { OnInit } from '@angular/core';
export type AccordionVariant = 'default' | 'split';
export type AccordionColorMode = 'none' | 'colored' | 'tonal';
export type AccordionAccentColor = 'rosewater' | 'flamingo' | 'pink' | 'mauve' | 'red' | 'maroon' | 'peach' | 'yellow' | 'green' | 'teal' | 'sky' | 'sapphire' | 'blue' | 'lavender';
export declare class AccordionComponent implements OnInit {
    variant: import("@angular/core").InputSignal<AccordionVariant>;
    colorMode: import("@angular/core").InputSignal<AccordionColorMode>;
    accentColor: import("@angular/core").InputSignal<AccordionAccentColor | undefined>;
    allowMultiple: import("@angular/core").InputSignal<boolean>;
    defaultValue: import("@angular/core").InputSignal<string | string[] | undefined>;
    value: import("@angular/core").InputSignal<string | string[] | undefined>;
    valueChange: import("@angular/core").OutputEmitterRef<string | string[]>;
    private openValuesSignal;
    private defaultValueApplied;
    ngOnInit(): void;
    isControlled: import("@angular/core").Signal<boolean>;
    openValues: import("@angular/core").Signal<string[]>;
    toggleValue(itemValue: string): void;
}
export declare class AccordionItemComponent {
    value: import("@angular/core").InputSignal<string>;
    disabled: import("@angular/core").InputSignal<boolean>;
    showChevron: import("@angular/core").InputSignal<boolean>;
    private accordion;
    isOpen: import("@angular/core").Signal<boolean>;
    handleClick(): void;
}
export declare class AccordionHeaderComponent {
    showChevron: import("@angular/core").InputSignal<boolean>;
    innerDisabled: import("@angular/core").InputSignal<boolean>;
    innerIsOpen: import("@angular/core").InputSignal<boolean>;
    innerValue: import("@angular/core").InputSignal<string>;
    headerClick: import("@angular/core").OutputEmitterRef<void>;
}
export declare class AccordionBodyComponent {
}
//# sourceMappingURL=accordion.component.d.ts.map