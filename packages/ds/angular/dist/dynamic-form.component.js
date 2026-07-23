var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component, input, output, signal, computed } from '@angular/core';
let DynamicFormComponent = class DynamicFormComponent {
    constructor() {
        this.schema = input([]);
        this.submitText = input('Enviar');
        this.submit = output();
        this.formValues = signal({});
        this.values = computed(() => {
            const init = {};
            for (const field of this.schema()) {
                init[field.id] = this.formValues()[field.id] ?? field.defaultValue ?? '';
            }
            return init;
        });
    }
    setValue(id, event) {
        const target = event.target;
        this.formValues.update(v => ({ ...v, [id]: target.value }));
    }
    setChecked(id, event) {
        const target = event.target;
        this.formValues.update(v => ({ ...v, [id]: target.checked }));
    }
    onSubmit() {
        this.submit.emit(this.values());
    }
};
DynamicFormComponent = __decorate([
    Component({
        selector: 'dynamic-form',
        standalone: true,
        template: `
    <form [class]="'dynamic-form'" (ngSubmit)="onSubmit()">
      <div class="form-grid">
        @for (field of schema(); track field.id) {
          <div class="form-group" [class.form-col-12]="true">
            <label class="form-group-label">
              {{ field.label }}
              @if (field.required) {
                <span class="form-group-required-indicator">*</span>
              }
            </label>

            @switch (field.type) {
              @case ('textarea') {
                <textarea
                  class="form-control form-control--md form-control--rounded"
                  [placeholder]="field.placeholder || ''"
                  [value]="values()[field.id] || ''"
                  (input)="setValue(field.id, $event)"
                ></textarea>
              }
              @case ('select') {
                <select
                  class="form-control form-control--md form-control--rounded"
                  [value]="values()[field.id] || ''"
                  (change)="setValue(field.id, $event)"
                >
                  <option value="">Selecione...</option>
                  @for (opt of field.options || []; track opt.value) {
                    <option [value]="opt.value">{{ opt.label }}</option>
                  }
                </select>
              }
              @case ('checkbox') {
                <label class="checkbox-row">
                  <input
                    type="checkbox"
                    [checked]="values()[field.id] || false"
                    (change)="setChecked(field.id, $event)"
                  />
                  <span class="checkbox-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </span>
                  <span>{{ field.label }}</span>
                </label>
              }
              @default {
                <input
                  [type]="field.type"
                  class="form-control form-control--md form-control--rounded"
                  [placeholder]="field.placeholder || ''"
                  [value]="values()[field.id] || ''"
                  (input)="setValue(field.id, $event)"
                />
              }
            }
          </div>
        }
      </div>
      <div style="margin-top:16px">
        <button
          type="submit"
          class="btn btn--filled btn--mauve btn--md btn--rounded"
        >
          {{ submitText() }}
        </button>
      </div>
    </form>
  `
    })
], DynamicFormComponent);
export { DynamicFormComponent };
//# sourceMappingURL=dynamic-form.component.js.map