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
let TextEditorComponent = class TextEditorComponent {
    constructor(el) {
        this.el = el;
        this.value = input('');
        this.placeholder = input('Digite aqui...');
        this.color = input('mauve');
        this.readOnly = input(false);
        this.showCount = input(false);
        this.valueChange = output();
        this.activeTags = signal([]);
        this.content = signal('');
        this.containerClass = computed(() => {
            return [
                'text-editor',
                `text-editor--${this.color()}`,
            ].filter(Boolean).join(' ');
        });
    }
    exec(command) {
        document.execCommand(command, false);
        this.updateContent();
        this.updateActiveTags();
    }
    onInput() {
        this.updateContent();
    }
    onKeydown(event) {
        if (event.key === 'Tab') {
            event.preventDefault();
            document.execCommand('insertHTML', false, '&emsp;');
        }
    }
    updateContent() {
        const editorEl = this.el.nativeElement.querySelector('.text-editor-content');
        if (editorEl) {
            this.content.set(editorEl.innerHTML);
            this.valueChange.emit(editorEl.innerHTML);
        }
    }
    updateActiveTags() {
        const tags = [];
        if (document.queryCommandState('bold'))
            tags.push('B');
        if (document.queryCommandState('italic'))
            tags.push('I');
        if (document.queryCommandState('underline'))
            tags.push('U');
        this.activeTags.set(tags);
    }
};
TextEditorComponent = __decorate([
    Component({
        selector: 'text-editor',
        standalone: true,
        template: `
    <div [class]="containerClass()">
      <div class="text-editor-toolbar">
        <button type="button" (click)="exec('bold')" [class.text-editor-btn--active]="activeTags().includes('B')" title="Negrito"><strong>B</strong></button>
        <button type="button" (click)="exec('italic')" [class.text-editor-btn--active]="activeTags().includes('I')" title="Itálico"><em>I</em></button>
        <button type="button" (click)="exec('underline')" [class.text-editor-btn--active]="activeTags().includes('U')" title="Sublinhado"><u>U</u></button>
      </div>
      <div
        #editorRef
        class="text-editor-content"
        contenteditable="true"
        (input)="onInput()"
        (keydown)="onKeydown($event)"
      ></div>
      @if (showCount()) {
        <div class="text-editor-footer">{{ content().length }} caracteres</div>
      }
    </div>
  `
    }),
    __metadata("design:paramtypes", [ElementRef])
], TextEditorComponent);
export { TextEditorComponent };
//# sourceMappingURL=text-editor.component.js.map