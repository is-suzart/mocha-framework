export type ToastVariant = 'success' | 'error' | 'warning' | 'info';
export type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
export type ToastColor = 'rosewater' | 'flamingo' | 'pink' | 'mauve' | 'red' | 'maroon' | 'peach' | 'yellow' | 'green' | 'teal' | 'sky' | 'sapphire' | 'blue' | 'lavender';
export interface ToastOptions {
    id?: string;
    title?: string;
    description?: string;
    variant?: ToastVariant;
    duration?: number;
    position?: ToastPosition;
    filled?: boolean;
    color?: ToastColor;
    className?: string;
    style?: Record<string, string>;
}
export interface ToastItem {
    id: string;
    title: string;
    description: string;
    variant: ToastVariant;
    duration: number;
    position: ToastPosition;
    filled: boolean;
    color: ToastColor | '';
    className: string;
    style: Record<string, string>;
    createdAt: number;
    exiting: boolean;
}
export declare class ToastService {
    readonly toasts: import("@angular/core").WritableSignal<ToastItem[]>;
    /** Programmatic toast function (static-style) */
    toast(options: ToastOptions | string): string;
    dismiss(id: string): void;
    success(title: string, description?: string): string;
    error(title: string, description?: string): string;
    warning(title: string, description?: string): string;
    info(title: string, description?: string): string;
}
//# sourceMappingURL=toast.service.d.ts.map