import { ElementRef } from '@angular/core';
export type TextEditorColor = 'rosewater' | 'flamingo' | 'pink' | 'mauve' | 'red' | 'maroon' | 'peach' | 'yellow' | 'green' | 'teal' | 'sky' | 'sapphire' | 'blue' | 'lavender';
export declare class TextEditorComponent {
    private el;
    value: import("@angular/core").InputSignal<string>;
    placeholder: import("@angular/core").InputSignal<string>;
    color: import("@angular/core").InputSignal<TextEditorColor>;
    readOnly: import("@angular/core").InputSignal<boolean>;
    showCount: import("@angular/core").InputSignal<boolean>;
    valueChange: import("@angular/core").OutputEmitterRef<string>;
    activeTags: import("@angular/core").WritableSignal<string[]>;
    content: import("@angular/core").WritableSignal<string>;
    constructor(el: ElementRef);
    protected containerClass: import("@angular/core").Signal<string>;
    exec(command: string): void;
    onInput(): void;
    onKeydown(event: KeyboardEvent): void;
    private updateContent;
    private updateActiveTags;
}
//# sourceMappingURL=text-editor.component.d.ts.map