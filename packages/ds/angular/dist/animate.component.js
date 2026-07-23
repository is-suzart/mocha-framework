var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, input, computed, ViewChild, ElementRef, signal, } from '@angular/core';
let AnimateComponent = class AnimateComponent {
    constructor() {
        this.animation = input('fade-up');
        this.duration = input('normal');
        this.delay = input(0);
        this.easing = input('out');
        this.once = input(true);
        this.threshold = input(0.2);
        this.visible = signal(false);
        this.observer = null;
        this.animClass = computed(() => {
            const parts = [
                `anim--${this.animation()}`,
                this.duration() !== 'normal' ? `anim--duration-${this.duration()}` : '',
                this.easing() !== 'out' ? `anim--ease-${this.easing()}` : '',
            ];
            return parts.filter(Boolean).join(' ');
        });
        this.animStyle = computed(() => {
            const style = {};
            if (this.delay() > 0)
                style['--ctp-anim-delay'] = `${this.delay()}ms`;
            if (!this.visible())
                style['animationPlayState'] = 'paused';
            return style;
        });
    }
    get isBrowser() {
        return typeof document !== 'undefined';
    }
    ngAfterViewInit() {
        this.createObserver();
    }
    ngOnDestroy() {
        this.observer?.disconnect();
    }
    createObserver() {
        if (!this.isBrowser || typeof IntersectionObserver === 'undefined') {
            this.visible.set(true);
            return;
        }
        this.observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                this.visible.set(true);
                if (this.once())
                    this.observer?.unobserve(this.containerRef.nativeElement);
            }
            else if (!this.once()) {
                this.visible.set(false);
            }
        }, { threshold: this.threshold() });
        this.observer.observe(this.containerRef.nativeElement);
    }
};
__decorate([
    ViewChild('container'),
    __metadata("design:type", ElementRef)
], AnimateComponent.prototype, "containerRef", void 0);
AnimateComponent = __decorate([
    Component({
        selector: 'animate',
        standalone: true,
        template: `
    <div #container [class]="animClass()" [style]="animStyle()">
      <ng-content />
    </div>
  `,
    })
], AnimateComponent);
export { AnimateComponent };
//# sourceMappingURL=animate.component.js.map