var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, InjectionToken, inject, signal } from '@angular/core';
export const MOCHA_PREFIX = new InjectionToken('MOCHA_PREFIX', {
    factory: () => '',
});
let PrefixService = class PrefixService {
    constructor() {
        this.prefix = signal('');
        try {
            const injected = inject(MOCHA_PREFIX, { optional: true });
            if (injected) {
                this.prefix.set(injected);
            }
        }
        catch {
            // Not provided, keep default empty string
        }
    }
};
PrefixService = __decorate([
    Injectable({ providedIn: 'root' }),
    __metadata("design:paramtypes", [])
], PrefixService);
export { PrefixService };
//# sourceMappingURL=prefix-context.js.map