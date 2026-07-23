var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, input, computed, output, model, forwardRef, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
let ButtonGroupComponent = class ButtonGroupComponent {
    constructor(cdr) {
        this.cdr = cdr;
        this.orientation = input('horizontal');
        this.variant = input('filled');
        this.shape = input('rounded');
        this.selectionMode = input('none');
        this.value = model(null);
        this.disabled = model(false);
        this.change = output();
        this.buttonElementsMap = new Map();
        this.onChangeFn = () => { };
        this.onTouchedFn = () => { };
        this.isPillReady = computed(() => {
            const style = this.pillStyle();
            return !('opacity' in style);
        });
        this.pillStyle = computed(() => {
            const activeVal = this.value();
            const mode = this.selectionMode();
            if (mode !== 'single' || activeVal === null || activeVal === undefined) {
                return { opacity: '0', pointerEvents: 'none' };
            }
            const activeEl = this.buttonElementsMap.get(activeVal);
            if (!activeEl || !this.containerRef) {
                return { opacity: '0', pointerEvents: 'none' };
            }
            const containerRect = this.containerRef.nativeElement.getBoundingClientRect();
            const activeRect = activeEl.getBoundingClientRect();
            const left = activeRect.left - containerRect.left;
            const top = activeRect.top - containerRect.top;
            const width = activeRect.width;
            const height = activeRect.height;
            return {
                transform: `translate(${left}px, ${top}px)`,
                width: `${width}px`,
                height: `${height}px`
            };
        });
    }
    ngAfterViewInit() {
        if (typeof ResizeObserver !== 'undefined' && this.containerRef) {
            this.resizeObserver = new ResizeObserver(() => {
                this.cdr.detectChanges();
            });
            this.resizeObserver.observe(this.containerRef.nativeElement);
        }
        // Initial compute cycle
        setTimeout(() => {
            this.cdr.detectChanges();
        }, 0);
    }
    ngOnDestroy() {
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
    }
    registerButton(val, el) {
        this.buttonElementsMap.set(val, el);
        this.cdr.detectChanges();
    }
    unregisterButton(val) {
        this.buttonElementsMap.delete(val);
        this.cdr.detectChanges();
    }
    selectButton(btnValue) {
        if (this.disabled())
            return;
        const mode = this.selectionMode();
        if (mode === 'none' || btnValue === undefined || btnValue === null)
            return;
        let nextVal;
        if (mode === 'single') {
            nextVal = btnValue;
        }
        else if (mode === 'multiple') {
            const currentVal = this.value();
            const currentArray = Array.isArray(currentVal) ? currentVal : [];
            if (currentArray.includes(btnValue)) {
                nextVal = currentArray.filter((v) => v !== btnValue);
            }
            else {
                nextVal = [...currentArray, btnValue];
            }
        }
        this.value.set(nextVal);
        this.onChangeFn(nextVal);
        this.onTouchedFn();
        this.change.emit(nextVal);
        this.cdr.detectChanges();
    }
    isButtonActive(btnValue) {
        const mode = this.selectionMode();
        const currentVal = this.value();
        if (mode === 'none' || btnValue === undefined || btnValue === null)
            return false;
        if (mode === 'single') {
            return currentVal === btnValue;
        }
        if (mode === 'multiple') {
            return Array.isArray(currentVal) && currentVal.includes(btnValue);
        }
        return false;
    }
    // ControlValueAccessor implementation
    writeValue(value) {
        this.value.set(value);
        this.cdr.detectChanges();
    }
    registerOnChange(fn) {
        this.onChangeFn = fn;
    }
    registerOnTouched(fn) {
        this.onTouchedFn = fn;
    }
    setDisabledState(isDisabled) {
        this.disabled.set(isDisabled);
        this.cdr.detectChanges();
    }
    handleKeyDown(e) {
        if (this.selectionMode() !== 'single' || this.disabled())
            return;
        const keys = Array.from(this.buttonElementsMap.keys());
        const currentIndex = keys.indexOf(this.value());
        if (currentIndex === -1)
            return;
        let nextIndex = currentIndex;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            nextIndex = (currentIndex + 1) % keys.length;
            e.preventDefault();
        }
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            nextIndex = (currentIndex - 1 + keys.length) % keys.length;
            e.preventDefault();
        }
        if (nextIndex !== currentIndex) {
            const nextValue = keys[nextIndex];
            this.selectButton(nextValue);
            setTimeout(() => {
                const nextEl = this.buttonElementsMap.get(nextValue);
                nextEl?.focus();
            }, 0);
        }
    }
};
__decorate([
    ViewChild('container'),
    __metadata("design:type", ElementRef)
], ButtonGroupComponent.prototype, "containerRef", void 0);
ButtonGroupComponent = __decorate([
    Component({
        selector: 'button-group',
        standalone: true,
        template: `
    <div
      #container
      class="btn-group"
      [attr.data-orientation]="orientation()"
      [attr.data-variant]="variant()"
      [attr.data-shape]="shape()"
      [attr.data-state]="(selectionMode() === 'single' && isPillReady() ? 'pill-active ' : '') + (selectionMode() !== 'none' ? selectionMode() : '') || null"
      [attr.role]="selectionMode() === 'single' ? 'radiogroup' : null"
      (keydown)="handleKeyDown($event)"
    >
      @if (selectionMode() === 'single') {
        <div class="btn-group-pill" [style]="pillStyle()"></div>
      }
      <ng-content></ng-content>
    </div>
  `,
        providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => ButtonGroupComponent),
                multi: true
            }
        ]
    }),
    __metadata("design:paramtypes", [ChangeDetectorRef])
], ButtonGroupComponent);
export { ButtonGroupComponent };
//# sourceMappingURL=button-group.component.js.map