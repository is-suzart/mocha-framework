var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component, input, computed, output, signal, inject } from '@angular/core';
let AccordionComponent = class AccordionComponent {
    constructor() {
        this.variant = input('default');
        this.colorMode = input('none');
        this.accentColor = input(undefined);
        this.allowMultiple = input(false);
        this.defaultValue = input(undefined);
        this.value = input(undefined);
        this.valueChange = output();
        this.openValuesSignal = signal([]);
        this.defaultValueApplied = false;
        this.isControlled = computed(() => this.value() !== undefined);
        this.openValues = computed(() => {
            if (this.isControlled()) {
                const v = this.value();
                return Array.isArray(v) ? v : [v];
            }
            return this.openValuesSignal();
        });
    }
    ngOnInit() {
        const dv = this.defaultValue();
        if (dv !== undefined) {
            this.openValuesSignal.set(Array.isArray(dv) ? dv : [dv]);
        }
        this.defaultValueApplied = true;
    }
    toggleValue(itemValue) {
        let next;
        const current = this.openValues();
        if (this.allowMultiple()) {
            next = current.includes(itemValue)
                ? current.filter(v => v !== itemValue)
                : [...current, itemValue];
        }
        else {
            next = current.includes(itemValue) ? [] : [itemValue];
        }
        if (!this.isControlled()) {
            this.openValuesSignal.set(next);
        }
        this.valueChange.emit(this.allowMultiple() ? next : (next[0] || ''));
    }
};
AccordionComponent = __decorate([
    Component({
        selector: 'accordion',
        standalone: true,
        host: {
            '[class.accordion]': 'true',
            '[attr.data-variant]': 'variant()',
            '[attr.data-color]': 'colorMode() !== "none" ? colorMode() : null',
            '[attr.data-accent]': 'accentColor() || null',
        },
        template: `<ng-content></ng-content>`
    })
], AccordionComponent);
export { AccordionComponent };
let AccordionItemComponent = class AccordionItemComponent {
    constructor() {
        this.value = input.required();
        this.disabled = input(false);
        this.showChevron = input(true);
        this.accordion = inject(AccordionComponent, { optional: true });
        this.isOpen = computed(() => {
            if (this.accordion) {
                return this.accordion.openValues().includes(this.value());
            }
            return false;
        });
    }
    handleClick() {
        if (this.disabled())
            return;
        if (this.accordion) {
            this.accordion.toggleValue(this.value());
        }
    }
};
AccordionItemComponent = __decorate([
    Component({
        selector: 'accordion-item',
        standalone: true,
        host: {
            '[class.accordion-item]': 'true',
            '[attr.data-state]': 'isOpen() ? "open" : (disabled() ? "disabled" : null)',
        },
        template: `
    <button
      type="button"
      class="accordion-header"
      [disabled]="disabled()"
      [attr.aria-expanded]="isOpen()"
      (click)="handleClick()"
    >
      <span class="accordion-title">
        <ng-content select="[header]"></ng-content>
      </span>
      @if (showChevron()) {
        <svg class="accordion-chevron" viewBox="0 0 24 24">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      }
    </button>
    <div class="accordion-collapse" [attr.aria-hidden]="!isOpen()">
      <div class="accordion-content">
        <div class="accordion-body">
          <ng-content></ng-content>
        </div>
      </div>
    </div>
  `
    })
], AccordionItemComponent);
export { AccordionItemComponent };
let AccordionHeaderComponent = class AccordionHeaderComponent {
    constructor() {
        this.showChevron = input(true);
        this.innerDisabled = input(false);
        this.innerIsOpen = input(false);
        this.innerValue = input('');
        this.headerClick = output();
    }
};
AccordionHeaderComponent = __decorate([
    Component({
        selector: 'accordion-header',
        standalone: true,
        template: `
    <button
      type="button"
      class="accordion-header"
      [disabled]="innerDisabled()"
      [attr.aria-expanded]="innerIsOpen()"
      (click)="headerClick.emit()"
    >
      <span class="accordion-title">
        <ng-content></ng-content>
      </span>
      @if (showChevron()) {
        <svg class="accordion-chevron" viewBox="0 0 24 24">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      }
    </button>
  `
    })
], AccordionHeaderComponent);
export { AccordionHeaderComponent };
let AccordionBodyComponent = class AccordionBodyComponent {
};
AccordionBodyComponent = __decorate([
    Component({
        selector: 'accordion-body',
        standalone: true,
        host: { '[class.accordion-body]': 'true' },
        template: `<ng-content></ng-content>`
    })
], AccordionBodyComponent);
export { AccordionBodyComponent };
//# sourceMappingURL=accordion.component.js.map