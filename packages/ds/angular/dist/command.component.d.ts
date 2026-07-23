import { ElementRef } from '@angular/core';
export interface CommandItem {
    id: string;
    label: string;
    group?: string;
    shortcut?: string;
    onSelect?: () => void;
}
export declare class CommandComponent {
    items: import("@angular/core").InputSignal<CommandItem[]>;
    open: import("@angular/core").InputSignal<boolean>;
    placeholder: import("@angular/core").InputSignal<string>;
    emptyMessage: import("@angular/core").InputSignal<string>;
    openChange: import("@angular/core").OutputEmitterRef<boolean>;
    inputEl: ElementRef<HTMLInputElement>;
    query: import("@angular/core").WritableSignal<string>;
    selectedIndex: import("@angular/core").WritableSignal<number>;
    isOpen: import("@angular/core").WritableSignal<boolean>;
    private internalOpen;
    constructor();
    filtered: import("@angular/core").Signal<CommandItem[]>;
    grouped: import("@angular/core").Signal<Record<string, CommandItem[]>>;
    groupKeys: import("@angular/core").Signal<string[]>;
    flatFiltered: import("@angular/core").Signal<CommandItem[]>;
    onWindowKeyDown(e: KeyboardEvent): void;
    toggle(): void;
    close(): void;
    onInput(e: Event): void;
    onKeyDown(e: KeyboardEvent): void;
    selectItem(item: CommandItem): void;
    onOverlayClick(e: MouseEvent): void;
}
//# sourceMappingURL=command.component.d.ts.map