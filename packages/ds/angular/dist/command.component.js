var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, input, output, signal, computed, effect, HostListener, ViewChild, ElementRef } from '@angular/core';
let CommandComponent = class CommandComponent {
    constructor() {
        this.items = input([]);
        this.open = input(false);
        this.placeholder = input('Search commands...');
        this.emptyMessage = input('No results found.');
        this.openChange = output();
        this.query = signal('');
        this.selectedIndex = signal(0);
        this.isOpen = signal(false);
        this.internalOpen = false;
        this.filtered = computed(() => {
            const q = this.query().toLowerCase();
            return this.items().filter(item => item.label.toLowerCase().includes(q));
        });
        this.grouped = computed(() => {
            const groups = {};
            for (const item of this.filtered()) {
                const g = item.group || 'General';
                if (!groups[g])
                    groups[g] = [];
                groups[g].push(item);
            }
            return groups;
        });
        this.groupKeys = computed(() => Object.keys(this.grouped()));
        this.flatFiltered = computed(() => this.filtered());
        effect(() => {
            const controlled = this.open();
            if (this.internalOpen !== controlled) {
                this.internalOpen = controlled;
                this.isOpen.set(controlled);
                if (controlled) {
                    this.query.set('');
                    this.selectedIndex.set(0);
                    setTimeout(() => this.inputEl?.nativeElement?.focus(), 50);
                }
            }
        });
    }
    onWindowKeyDown(e) {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            this.toggle();
        }
        if (e.key === 'Escape' && this.isOpen()) {
            this.close();
        }
    }
    toggle() {
        const next = !this.isOpen();
        this.internalOpen = next;
        this.isOpen.set(next);
        this.openChange.emit(next);
        if (next) {
            this.query.set('');
            this.selectedIndex.set(0);
        }
    }
    close() {
        this.internalOpen = false;
        this.isOpen.set(false);
        this.openChange.emit(false);
    }
    onInput(e) {
        this.query.set(e.target.value);
        this.selectedIndex.set(0);
    }
    onKeyDown(e) {
        const flat = this.flatFiltered();
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            this.selectedIndex.update(i => Math.min(i + 1, flat.length - 1));
        }
        else if (e.key === 'ArrowUp') {
            e.preventDefault();
            this.selectedIndex.update(i => Math.max(i - 1, 0));
        }
        else if (e.key === 'Enter' && flat[this.selectedIndex()]) {
            flat[this.selectedIndex()].onSelect?.();
            this.close();
        }
    }
    selectItem(item) {
        item.onSelect?.();
        this.close();
    }
    onOverlayClick(e) {
        if (e.target.classList.contains('command-overlay')) {
            this.close();
        }
    }
};
__decorate([
    ViewChild('inputEl'),
    __metadata("design:type", ElementRef)
], CommandComponent.prototype, "inputEl", void 0);
__decorate([
    HostListener('window:keydown', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [KeyboardEvent]),
    __metadata("design:returntype", void 0)
], CommandComponent.prototype, "onWindowKeyDown", null);
CommandComponent = __decorate([
    Component({
        selector: 'command',
        standalone: true,
        template: `
    @if (isOpen()) {
      <div class="command-overlay" (click)="onOverlayClick($event)" role="dialog" aria-modal="true" aria-label="Command palette">
        <div class="command">
          <div class="command-input-wrapper">
            <svg class="command-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              #inputEl
              class="command-input"
              [placeholder]="placeholder()"
              (input)="onInput($event)"
              (keydown)="onKeyDown($event)"
            />
          </div>
          <div class="command-list">
            @if (flatFiltered().length === 0) {
              <div class="command-empty">{{ emptyMessage() }}</div>
            } @else {
              @for (group of groupKeys(); track group) {
                <div>
                  <div class="command-group-label">{{ group }}</div>
                  @for (item of grouped()[group]; track item.id) {
                    <div
                      class="command-item" [attr.data-state]="flatFiltered().indexOf(item) === selectedIndex() ? 'selected' : null"
                      (click)="selectItem(item)"
                      (mouseenter)="selectedIndex.set(flatFiltered().indexOf(item))"
                    >
                      <span class="command-item-label">{{ item.label }}</span>
                      @if (item.shortcut) {
                        <span class="command-item-shortcut">{{ item.shortcut }}</span>
                      }
                    </div>
                  }
                </div>
              }
            }
          </div>
        </div>
      </div>
    }
  `
    }),
    __metadata("design:paramtypes", [])
], CommandComponent);
export { CommandComponent };
//# sourceMappingURL=command.component.js.map