var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, input, computed, output, signal, ElementRef } from '@angular/core';
let MultiSelectComponent = class MultiSelectComponent {
    constructor(el) {
        this.el = el;
        this.options = input([]);
        this.value = input([]);
        this.placeholder = input('Selecione...');
        this.searchable = input(true);
        this.color = input('mauve');
        this.valueChange = output();
        this.isOpen = signal(false);
        this.searchQuery = signal('');
        this.containerClass = computed(() => {
            return ['multi-select'].filter(Boolean).join(' ');
        });
        this.selectedLabels = computed(() => {
            return this.options()
                .filter(o => this.value().includes(o.value))
                .map(o => o.label);
        });
        this.filteredOptions = computed(() => {
            const query = this.searchQuery().toLowerCase();
            if (!query)
                return this.options();
            return this.options().filter(o => o.label.toLowerCase().includes(query));
        });
        this.handleClickOutside();
    }
    isSelected(val) {
        return this.value().includes(val);
    }
    toggleOpen() {
        this.isOpen.update(v => !v);
        if (!this.isOpen())
            this.searchQuery.set('');
    }
    toggleOption(val) {
        const current = [...this.value()];
        const idx = current.indexOf(val);
        if (idx >= 0) {
            current.splice(idx, 1);
        }
        else {
            current.push(val);
        }
        this.valueChange.emit(current);
    }
    onSearch(event) {
        this.searchQuery.set(event.target.value);
    }
    handleClickOutside() {
        document.addEventListener('click', (e) => {
            if (!this.el.nativeElement.contains(e.target)) {
                this.isOpen.set(false);
                this.searchQuery.set('');
            }
        });
    }
};
MultiSelectComponent = __decorate([
    Component({
        selector: 'multi-select',
        standalone: true,
        template: `
    <div [class]="containerClass()" style="position:relative">
      <div
        class="multi-select-trigger"
        (click)="toggleOpen()"
      >
        @if (selectedLabels().length > 0) {
          <span class="multi-select-tags">
            @for (label of selectedLabels(); track label) {
              <span class="multi-select-tag">{{ label }}</span>
            }
          </span>
        } @else {
          <span class="multi-select-placeholder">{{ placeholder() }}</span>
        }
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>

      @if (isOpen()) {
        <div class="multi-select-dropdown" style="position:absolute;top:100%;left:0;right:0;z-index:1050">
          @if (searchable()) {
            <input
              class="multi-select-search"
              type="text"
              placeholder="Buscar..."
              (input)="onSearch($event)"
            />
          }
          <div class="multi-select-options">
            @for (opt of filteredOptions(); track opt.value) {
              <label class="multi-select-option">
                <input
                  type="checkbox"
                  [checked]="isSelected(opt.value)"
                  (change)="toggleOption(opt.value)"
                />
                <span>{{ opt.label }}</span>
              </label>
            }
          </div>
        </div>
      }
    </div>
  `
    }),
    __metadata("design:paramtypes", [ElementRef])
], MultiSelectComponent);
export { MultiSelectComponent };
//# sourceMappingURL=advanced-select.component.js.map