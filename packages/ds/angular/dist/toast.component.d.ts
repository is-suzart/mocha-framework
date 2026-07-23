import { ToastPosition, ToastItem } from './toast.service';
export declare class ToasterComponent {
    private toastService;
    readonly positions: ToastPosition[];
    keys: {
        (o: object): string[];
        (o: {}): string[];
    };
    groupedToasts(position: ToastPosition): ToastItem[] | null;
    dismiss(id: string): void;
}
//# sourceMappingURL=toast.component.d.ts.map