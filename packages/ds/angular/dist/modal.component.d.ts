export type ModalSize = 'sm' | 'md' | 'lg';
export declare class ModalComponent {
    isOpen: import("@angular/core").InputSignal<boolean>;
    size: import("@angular/core").InputSignal<ModalSize>;
    title: import("@angular/core").InputSignal<string>;
    closeOnOverlayClick: import("@angular/core").InputSignal<boolean>;
    closeOnEsc: import("@angular/core").InputSignal<boolean>;
    showCloseButton: import("@angular/core").InputSignal<boolean>;
    hasFooter: import("@angular/core").InputSignal<boolean>;
    close: import("@angular/core").OutputEmitterRef<void>;
    hasHeader: () => boolean;
}
//# sourceMappingURL=modal.component.d.ts.map