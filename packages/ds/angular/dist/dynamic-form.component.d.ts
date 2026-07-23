export interface FieldSchema {
    id: string;
    label: string;
    type: 'text' | 'number' | 'email' | 'textarea' | 'select' | 'checkbox';
    placeholder?: string;
    required?: boolean;
    defaultValue?: any;
    options?: {
        label: string;
        value: any;
    }[];
}
export declare class DynamicFormComponent {
    schema: import("@angular/core").InputSignal<FieldSchema[]>;
    submitText: import("@angular/core").InputSignal<string>;
    submit: import("@angular/core").OutputEmitterRef<Record<string, any>>;
    private formValues;
    values: import("@angular/core").Signal<Record<string, any>>;
    setValue(id: string, event: Event): void;
    setChecked(id: string, event: Event): void;
    onSubmit(): void;
}
//# sourceMappingURL=dynamic-form.component.d.ts.map