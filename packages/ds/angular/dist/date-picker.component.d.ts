export type DatePickerMode = 'single' | 'range';
export type DatePickerColor = 'rosewater' | 'flamingo' | 'pink' | 'mauve' | 'red' | 'maroon' | 'peach' | 'yellow' | 'green' | 'teal' | 'sky' | 'sapphire' | 'blue' | 'lavender';
export declare class DatePickerComponent {
    value: import("@angular/core").InputSignal<Date | null>;
    mode: import("@angular/core").InputSignal<DatePickerMode>;
    color: import("@angular/core").InputSignal<DatePickerColor>;
    disabled: import("@angular/core").InputSignal<boolean>;
    valueChange: import("@angular/core").OutputEmitterRef<Date | null>;
    protected MONTHS: string[];
    protected DAYS: string[];
    isOpen: import("@angular/core").WritableSignal<boolean>;
    viewYear: import("@angular/core").WritableSignal<number>;
    viewMonth: import("@angular/core").WritableSignal<number>;
    protected triggerClass: import("@angular/core").Signal<string>;
    protected displayText: import("@angular/core").Signal<string>;
    protected calendarDays: import("@angular/core").Signal<(number | null)[]>;
    isSelected(day: number): boolean;
    toggleOpen(): void;
    prevMonth(): void;
    nextMonth(): void;
    selectDate(day: number): void;
}
//# sourceMappingURL=date-picker.component.d.ts.map