var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, input, signal, effect } from '@angular/core';
let CarouselComponent = class CarouselComponent {
    constructor() {
        this.showArrows = input(true);
        this.showDots = input(true);
        this.autoPlay = input(false);
        this.autoPlayInterval = input(4000);
        this.current = signal(0);
        this.slides = [0];
        this.intervalId = null;
        effect(() => {
            if (this.autoPlay() && this.slides.length > 1) {
                this.intervalId = setInterval(() => this.next(), this.autoPlayInterval());
                return () => { if (this.intervalId)
                    clearInterval(this.intervalId); };
            }
        });
    }
    goTo(index) {
        const max = this.slides.length - 1;
        this.current.set(Math.max(0, Math.min(index, max)));
    }
    prev() { this.goTo(this.current() - 1); }
    next() { this.goTo(this.current() + 1); }
};
CarouselComponent = __decorate([
    Component({
        selector: 'carousel',
        standalone: true,
        template: `
    <div class="carousel" role="region" aria-label="Carousel">
      <div class="carousel-viewport">
        <div class="carousel-track" [style.transform]="'translateX(-' + current() * 100 + '%)'">
          @for (slide of slides; track $index) {
            <div class="carousel-slide" role="group" aria-roledescription="slide" [attr.aria-label]="'Slide ' + ($index + 1) + ' of ' + slides.length">
              <ng-content />
            </div>
          }
        </div>
      </div>
      @if (showArrows() && slides.length > 1) {
        <button class="carousel-btn carousel-btn" data-state="prev" (click)="prev()" [disabled]="current() === 0" aria-label="Previous slide">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <button class="carousel-btn carousel-btn" data-state="next" (click)="next()" [disabled]="current() === slides.length - 1" aria-label="Next slide">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
      }
      @if (showDots() && slides.length > 1) {
        <div class="carousel-dots" role="tablist" aria-label="Slides">
          @for (dot of slides; track $index) {
            <button
              class="carousel-dot" [attr.data-state]="$index === current() ? 'active' : null"
              (click)="goTo($index)"
              role="tab"
              [attr.aria-selected]="$index === current()"
              [attr.aria-label]="'Go to slide ' + ($index + 1)"
            ></button>
          }
        </div>
      }
    </div>
  `
    }),
    __metadata("design:paramtypes", [])
], CarouselComponent);
export { CarouselComponent };
//# sourceMappingURL=carousel.component.js.map