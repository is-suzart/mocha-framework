export type AlertVariant = 'info' | 'success' | 'warning' | 'error';
export declare class AlertComponent {
    variant: import("@angular/core").InputSignal<AlertVariant>;
    title: import("@angular/core").InputSignal<string>;
    dismissible: import("@angular/core").InputSignal<boolean>;
    icon: import("@angular/core").InputSignal<string>;
    dismiss: import("@angular/core").OutputEmitterRef<void>;
    private dismissed;
    isVisible: import("@angular/core").Signal<boolean>;
    handleDismiss(): void;
}
//# sourceMappingURL=alert.component.d.ts.map