var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, input, output, ElementRef, ViewChild, HostListener, computed, signal, effect } from '@angular/core';
const flavorColors = {
    latte: {
        rosewater: '#dc8a78',
        flamingo: '#dd7878',
        pink: '#ea76cb',
        mauve: '#8839ef',
        red: '#d20f39',
        maroon: '#e64553',
        peach: '#fe640b',
        yellow: '#df8e1d',
        green: '#40a02b',
        teal: '#179287',
        sky: '#04a5e5',
        sapphire: '#209fb5',
        blue: '#1e66f5',
        lavender: '#7287fd'
    },
    frappe: {
        rosewater: '#f2d5cf',
        flamingo: '#eebebe',
        pink: '#f4b8e4',
        mauve: '#ca9ee6',
        red: '#e78284',
        maroon: '#ea999c',
        peach: '#ef9f76',
        yellow: '#e5c890',
        green: '#a6d189',
        teal: '#81c8be',
        sky: '#99d1db',
        sapphire: '#85c1dc',
        blue: '#8caaee',
        lavender: '#babbf1'
    },
    macchiato: {
        rosewater: '#f4dbd6',
        flamingo: '#f0c6c6',
        pink: '#f5bde6',
        mauve: '#c6a0f6',
        red: '#ed8796',
        maroon: '#ee99a0',
        peach: '#f5a97f',
        yellow: '#eed49f',
        green: '#a6da95',
        teal: '#8bd5ca',
        sky: '#91d7e3',
        sapphire: '#7dc4e4',
        blue: '#8aadf4',
        lavender: '#b7bdf8'
    },
    mocha: {
        rosewater: '#f5e0dc',
        flamingo: '#f2cdcd',
        pink: '#f5c2e7',
        mauve: '#cba6f7',
        red: '#f38ba8',
        maroon: '#eba0ac',
        peach: '#fab387',
        yellow: '#f9e2af',
        green: '#a6e3a1',
        teal: '#94e2d5',
        sky: '#89dceb',
        sapphire: '#74c7ec',
        blue: '#89b4fa',
        lavender: '#b4befe'
    }
};
// Hex to HSV
function hexToHsv(hex) {
    let r = 0, g = 0, b = 0;
    const cleanHex = hex.replace('#', '');
    if (cleanHex.length === 3) {
        r = parseInt(cleanHex[0] + cleanHex[0], 16);
        g = parseInt(cleanHex[1] + cleanHex[1], 16);
        b = parseInt(cleanHex[2] + cleanHex[2], 16);
    }
    else if (cleanHex.length === 6) {
        r = parseInt(cleanHex.substring(0, 2), 16);
        g = parseInt(cleanHex.substring(2, 4), 16);
        b = parseInt(cleanHex.substring(4, 6), 16);
    }
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const v = max;
    const d = max - min;
    s = max === 0 ? 0 : d / max;
    if (max !== min) {
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
    }
    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        v: Math.round(v * 100)
    };
}
// HSV to Hex
function hsvToHex(h, s, v) {
    const sat = s / 100;
    const val = v / 100;
    const c = val * sat;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = val - c;
    let r = 0, g = 0, b = 0;
    if (h >= 0 && h < 60) {
        r = c;
        g = x;
        b = 0;
    }
    else if (h >= 60 && h < 120) {
        r = x;
        g = c;
        b = 0;
    }
    else if (h >= 120 && h < 180) {
        r = 0;
        g = c;
        b = x;
    }
    else if (h >= 180 && h < 240) {
        r = 0;
        g = x;
        b = c;
    }
    else if (h >= 240 && h < 300) {
        r = x;
        g = 0;
        b = c;
    }
    else if (h >= 300 && h <= 360) {
        r = c;
        g = 0;
        b = x;
    }
    const rHex = Math.round((r + m) * 255).toString(16).padStart(2, '0');
    const gHex = Math.round((g + m) * 255).toString(16).padStart(2, '0');
    const bHex = Math.round((b + m) * 255).toString(16).padStart(2, '0');
    return `#${rHex}${gHex}${bHex}`;
}
let ColorPickerComponent = class ColorPickerComponent {
    constructor() {
        this.value = input('');
        this.flavor = input('mocha');
        this.variant = input('both');
        this.size = input('md');
        this.color = input('mauve');
        this.showHexInput = input(true);
        this.change = output();
        this.localHex = signal('');
        this.showPopover = false;
        // Local Picker Color States as Signals
        this.h = signal(280);
        this.s = signal(100);
        this.v = signal(100);
        this.swatches = computed(() => {
            const list = flavorColors[this.flavor()];
            return Object.entries(list).map(([name, hex]) => ({ name, hex }));
        });
        this.hueColor = computed(() => {
            return hsvToHex(this.h(), 100, 100);
        });
        effect(() => {
            const val = this.value();
            this.localHex.set(val);
            const hexRegex = /^#[0-9a-fA-F]{6}$/;
            if (hexRegex.test(val)) {
                const hsvObj = hexToHsv(val);
                this.h.set(hsvObj.h);
                this.s.set(hsvObj.s);
                this.v.set(hsvObj.v);
            }
        });
    }
    togglePopover() {
        this.showPopover = !this.showPopover;
    }
    onDocumentClick(event) {
        if (this.showPopover &&
            this.popoverWrapper &&
            !this.popoverWrapper.nativeElement.contains(event.target)) {
            this.showPopover = false;
        }
    }
    handleSwatchClick(hexVal) {
        const cleanHex = hexVal.toLowerCase();
        this.localHex.set(cleanHex);
        this.change.emit(cleanHex);
    }
    handlePadChange(clientX, clientY) {
        if (!this.pad)
            return;
        const rect = this.pad.nativeElement.getBoundingClientRect();
        const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        const y = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
        const newS = Math.round(x * 100);
        const newV = Math.round((1 - y) * 100);
        this.s.set(newS);
        this.v.set(newV);
        const hex = hsvToHex(this.h(), newS, newV);
        this.change.emit(hex);
    }
    handlePadMouseDown(e) {
        this.handlePadChange(e.clientX, e.clientY);
        const handleMouseMove = (moveEvent) => {
            this.handlePadChange(moveEvent.clientX, moveEvent.clientY);
        };
        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }
    handlePadTouchStart(e) {
        const touch = e.touches[0];
        if (!touch)
            return;
        this.handlePadChange(touch.clientX, touch.clientY);
        const handleTouchMove = (moveEvent) => {
            const moveTouch = moveEvent.touches[0];
            if (moveTouch) {
                this.handlePadChange(moveTouch.clientX, moveTouch.clientY);
            }
        };
        const handleTouchEnd = () => {
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
        };
        document.addEventListener('touchmove', handleTouchMove);
        document.addEventListener('touchend', handleTouchEnd);
    }
    handleHueSliderChange(e) {
        const target = e.target;
        const newH = parseInt(target.value);
        this.h.set(newH);
        const hex = hsvToHex(newH, this.s(), this.v());
        this.change.emit(hex);
    }
    handleTextInputChange(e) {
        const target = e.target;
        let textVal = target.value;
        if (!textVal.startsWith('#')) {
            textVal = '#' + textVal;
        }
        textVal = textVal.substring(0, 7);
        this.localHex.set(textVal);
        const hexRegex = /^#[0-9a-fA-F]{6}$/;
        if (hexRegex.test(textVal)) {
            const cleanHex = textVal.toLowerCase();
            this.change.emit(cleanHex);
        }
    }
};
__decorate([
    ViewChild('popoverWrapper'),
    __metadata("design:type", ElementRef)
], ColorPickerComponent.prototype, "popoverWrapper", void 0);
__decorate([
    ViewChild('pad'),
    __metadata("design:type", ElementRef)
], ColorPickerComponent.prototype, "pad", void 0);
__decorate([
    HostListener('document:mousedown', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [MouseEvent]),
    __metadata("design:returntype", void 0)
], ColorPickerComponent.prototype, "onDocumentClick", null);
ColorPickerComponent = __decorate([
    Component({
        selector: 'color-picker',
        standalone: true,
        template: `
    <div class="colorpicker" [attr.data-size]="size()">
      <div class="colorpicker-row">
        <!-- Render Swatches if selected -->
        @if (variant() === 'swatches' || variant() === 'both') {
          <div class="colorpicker-swatches">
            @for (swatch of swatches(); track swatch.hex) {
              <button
                type="button"
                class="colorpicker-chip"
                [attr.data-state]="value().toLowerCase() === swatch.hex.toLowerCase() ? 'active' : null"
                [style.backgroundColor]="swatch.hex"
                (click)="handleSwatchClick(swatch.hex)"
                [attr.title]="swatch.name + ' (' + swatch.hex + ')'"
                [attr.aria-label]="swatch.name"
                [attr.aria-pressed]="value().toLowerCase() === swatch.hex.toLowerCase()"
              ></button>
            }
          </div>
        }

        <!-- Divider if both are shown -->
        @if (variant() === 'both') {
          <div class="colorpicker-divider"></div>
        }

        <!-- Render Custom Picker Trigger -->
        @if (variant() === 'custom' || variant() === 'both') {
          <div class="colorpicker-popover-wrapper" #popoverWrapper>
            <button
              type="button"
              class="colorpicker-custom-trigger"
              [style.backgroundColor]="value()"
              (click)="togglePopover()"
              aria-label="Custom color spectrum picker"
              [attr.aria-expanded]="showPopover"
            ></button>

            @if (showPopover) {
              <div class="colorpicker-popover">
                <!-- SV Pad -->
                <div
                  #pad
                  class="colorpicker-sv-pad"
                  [style.backgroundColor]="hueColor()"
                  (mousedown)="handlePadMouseDown($event)"
                  (touchstart)="handlePadTouchStart($event)"
                >
                  <div class="colorpicker-sv-gradient-s"></div>
                  <div class="colorpicker-sv-gradient-v"></div>
                  <div
                    class="colorpicker-sv-marker"
                    [style.left.%]="s()"
                    [style.top.%]="100 - v()"
                  ></div>
                </div>
                
                <!-- Hue Slider -->
                <div class="colorpicker-hue-container">
                  <input
                    type="range"
                    min="0"
                    max="360"
                    [value]="h()"
                    (input)="handleHueSliderChange($event)"
                    class="colorpicker-hue-slider"
                    aria-label="Hue spectrum selection"
                  />
                </div>
                
                <!-- Footer -->
                <div class="colorpicker-popover-footer">
                  <div
                    class="colorpicker-popover-preview"
                    [style.backgroundColor]="value()"
                  ></div>
                  <span class="colorpicker-popover-value">
                    {{ value().toUpperCase() }}
                  </span>
                </div>
              </div>
            }
          </div>
        }

        <!-- Render Text hex input -->
        @if (showHexInput()) {
          <div class="colorpicker-input-group">
            <span class="colorpicker-input-prefix">#</span>
            <input
              type="text"
              class="colorpicker-input"
              [value]="localHex().replace('#', '').toUpperCase()"
              (input)="handleTextInputChange($event)"
              placeholder="FFFFFF"
              aria-label="Hex color value"
            />
          </div>
        }
      </div>
    </div>
  `
    }),
    __metadata("design:paramtypes", [])
], ColorPickerComponent);
export { ColorPickerComponent };
//# sourceMappingURL=color-picker.component.js.map