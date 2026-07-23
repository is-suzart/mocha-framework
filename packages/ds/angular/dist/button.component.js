var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component, input, computed, output, inject, ElementRef } from '@angular/core';
import { ButtonGroupComponent } from './button-group.component';
let ButtonComponent = class ButtonComponent {
    constructor() {
        this.variant = input('filled');
        this.color = input('mauve');
        this.size = input('md');
        this.shape = input('rounded');
        this.isLoading = input(false);
        this.leftIcon = input('');
        this.rightIcon = input('');
        this.value = input(undefined);
        this.disabled = input(false);
        this.click = output();
        this.buttonGroup = inject(ButtonGroupComponent, { optional: true });
        this.el = inject(ElementRef);
        this.isGroupSingle = computed(() => {
            return this.buttonGroup ? this.buttonGroup.selectionMode() === 'single' : false;
        });
        this.isGroupDisabled = computed(() => {
            return this.buttonGroup ? this.buttonGroup.disabled() : false;
        });
        this.isDisabled = computed(() => {
            return this.disabled() || this.isGroupDisabled() || this.isLoading();
        });
        this.isActive = computed(() => {
            if (!this.buttonGroup || this.value() === null || this.value() === undefined)
                return false;
            return this.buttonGroup.isButtonActive(this.value());
        });
        this.resolvedState = computed(() => {
            if (this.isLoading())
                return 'loading';
            if (this.isActive())
                return 'active';
            return undefined;
        });
    }
    handleClick(event) {
        if (this.buttonGroup && this.value() !== null && this.value() !== undefined) {
            this.buttonGroup.selectButton(this.value());
        }
        this.click.emit(event);
    }
    ngAfterViewInit() {
        if (this.buttonGroup && this.value() !== null && this.value() !== undefined) {
            this.buttonGroup.registerButton(this.value(), this.el.nativeElement);
        }
    }
    ngOnDestroy() {
        if (this.buttonGroup && this.value() !== null && this.value() !== undefined) {
            this.buttonGroup.unregisterButton(this.value());
        }
    }
};
ButtonComponent = __decorate([
    Component({
        selector: 'button[btn]',
        standalone: true,
        host: {
            '[attr.data-variant]': 'variant()',
            '[attr.data-color]': 'color()',
            '[attr.data-size]': 'size()',
            '[attr.data-shape]': 'shape()',
            '[attr.data-state]': 'resolvedState()',
            '[class.btn]': 'true',
            '[disabled]': 'isDisabled()',
            '[attr.role]': 'isGroupSingle() ? "radio" : null',
            '[attr.aria-checked]': 'isGroupSingle() ? isActive() : null',
            '[attr.tabindex]': 'isGroupSingle() ? (isActive() ? 0 : -1) : 0',
        },
        template: `
    <span class="btn-content">
      @if (isLoading()) {
        <span class="btn-spinner" aria-hidden="true"></span>
      }
      <span class="btn-icon-left" style="display: inline-flex; align-items: center">
        <ng-content select="[leftIcon]"></ng-content>
      </span>
      <ng-content></ng-content>
      <span class="btn-icon-right" style="display: inline-flex; align-items: center">
        <ng-content select="[rightIcon]"></ng-content>
      </span>
    </span>
  `
    })
], ButtonComponent);
export { ButtonComponent };
//# sourceMappingURL=button.component.js.map