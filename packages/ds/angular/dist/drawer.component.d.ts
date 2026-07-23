export type DrawerPosition = 'left' | 'right' | 'top' | 'bottom';
export type DrawerSize = 'sm' | 'md' | 'lg' | 'full';
export type DrawerColor = 'rosewater' | 'flamingo' | 'pink' | 'mauve' | 'red' | 'maroon' | 'peach' | 'yellow' | 'green' | 'teal' | 'sky' | 'sapphire' | 'blue' | 'lavender';
export declare class DrawerComponent {
    isOpen: import("@angular/core").InputSignal<boolean>;
    position: import("@angular/core").InputSignal<DrawerPosition>;
    size: import("@angular/core").InputSignal<DrawerSize>;
    color: import("@angular/core").InputSignal<DrawerColor>;
    title: import("@angular/core").InputSignal<string>;
    footer: import("@angular/core").InputSignal<string>;
    closeOnOverlayClick: import("@angular/core").InputSignal<boolean>;
    closeOnEsc: import("@angular/core").InputSignal<boolean>;
    showCloseButton: import("@angular/core").InputSignal<boolean>;
    close: import("@angular/core").OutputEmitterRef<void>;
    onClose(): void;
}
//# sourceMappingURL=drawer.component.d.ts.map