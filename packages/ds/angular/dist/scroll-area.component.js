var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, input, ViewChild, ElementRef, signal } from '@angular/core';
let ScrollAreaComponent = class ScrollAreaComponent {
    constructor() {
        this.height = input('100%');
        this.showVertical = signal(false);
        this.showHorizontal = signal(false);
        this.thumbTop = signal(0);
        this.thumbLeft = signal(0);
        this.thumbHeight = signal(0);
        this.thumbWidth = signal(0);
        this.isDraggingV = false;
        this.isDraggingH = false;
    }
    updateThumbs() {
        const vp = this.viewportEl?.nativeElement;
        if (!vp)
            return;
        const { scrollTop, scrollLeft, scrollHeight, scrollWidth, clientHeight, clientWidth } = vp;
        this.showVertical.set(scrollHeight > clientHeight);
        this.showHorizontal.set(scrollWidth > clientWidth);
        if (scrollHeight > clientHeight) {
            this.thumbHeight.set((clientHeight / scrollHeight) * clientHeight);
            this.thumbTop.set((scrollTop / scrollHeight) * clientHeight);
        }
        if (scrollWidth > clientWidth) {
            this.thumbWidth.set((clientWidth / scrollWidth) * clientWidth);
            this.thumbLeft.set((scrollLeft / scrollWidth) * clientWidth);
        }
    }
    startDragV(e) {
        e.preventDefault();
        this.isDraggingV = true;
        const vp = this.viewportEl.nativeElement;
        const startY = e.clientY;
        const startScrollTop = vp.scrollTop;
        const onMove = (ev) => {
            const dy = ev.clientY - startY;
            const ratio = dy / (vp.clientHeight - this.thumbHeight());
            vp.scrollTop = startScrollTop + ratio * (vp.scrollHeight - vp.clientHeight);
        };
        const onUp = () => {
            this.isDraggingV = false;
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onUp);
        };
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
    }
    startDragH(e) {
        e.preventDefault();
        this.isDraggingH = true;
        const vp = this.viewportEl.nativeElement;
        const startX = e.clientX;
        const startScrollLeft = vp.scrollLeft;
        const onMove = (ev) => {
            const dx = ev.clientX - startX;
            const ratio = dx / (vp.clientWidth - this.thumbWidth());
            vp.scrollLeft = startScrollLeft + ratio * (vp.scrollWidth - vp.clientWidth);
        };
        const onUp = () => {
            this.isDraggingH = false;
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onUp);
        };
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
    }
};
__decorate([
    ViewChild('viewport'),
    __metadata("design:type", ElementRef)
], ScrollAreaComponent.prototype, "viewportEl", void 0);
ScrollAreaComponent = __decorate([
    Component({
        selector: 'scroll-area',
        standalone: true,
        template: `
    <div class="scroll-area" [style.height]="height()">
      <div #viewport class="scroll-area-viewport" (scroll)="updateThumbs()">
        <ng-content />
      </div>
      @if (showVertical()) {
        <div class="scroll-area-scrollbar" data-orientation="vertical" [style.opacity]="isDraggingV ? 1 : 0.6">
          <div
            class="scroll-area-thumb"
            [style.height.px]="thumbHeight()"
            [style.transform]="'translateY(' + thumbTop() + 'px)'"
            (mousedown)="startDragV($event)"
          ></div>
        </div>
      }
      @if (showHorizontal()) {
        <div class="scroll-area-scrollbar" data-orientation="horizontal" [style.opacity]="isDraggingH ? 1 : 0.6">
          <div
            class="scroll-area-thumb"
            [style.width.px]="thumbWidth()"
            [style.transform]="'translateX(' + thumbLeft() + 'px)'"
            (mousedown)="startDragH($event)"
          ></div>
        </div>
      }
      @if (showVertical() && showHorizontal()) {
        <div class="scroll-area-corner"></div>
      }
    </div>
  `
    })
], ScrollAreaComponent);
export { ScrollAreaComponent };
//# sourceMappingURL=scroll-area.component.js.map