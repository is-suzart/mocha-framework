var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component, input } from '@angular/core';
let FormGroupComponent = class FormGroupComponent {
    constructor() {
        this.label = input('');
        this.description = input('');
        this.error = input('');
        this.required = input(false);
        this.htmlFor = input('');
    }
};
FormGroupComponent = __decorate([
    Component({
        selector: 'form-group',
        standalone: true,
        template: `
    <div [class]="'form-group'">
      @if (label()) {
        <label [for]="htmlFor()" class="form-group-label">
          {{ label() }}
          @if (required()) {
            <span class="form-group-required-indicator" aria-hidden="true">*</span>
          }
        </label>
      }
      <ng-content></ng-content>
      @if (error()) {
        <span class="form-group-error" role="alert">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style="flex-shrink:0">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          {{ error() }}
        </span>
      } @else if (description()) {
        <span class="form-group-description">{{ description() }}</span>
      }
    </div>
  `
    })
], FormGroupComponent);
export { FormGroupComponent };
//# sourceMappingURL=form-group.component.js.map