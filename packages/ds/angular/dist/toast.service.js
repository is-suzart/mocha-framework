var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable, signal } from '@angular/core';
let toastIdCounter = 0;
const defaultToast = {
    title: '',
    description: '',
    variant: 'info',
    duration: 4000,
    position: 'bottom-right',
    filled: false,
    color: '',
    className: '',
    style: {},
};
let ToastService = class ToastService {
    constructor() {
        this.toasts = signal([]);
    }
    /** Programmatic toast function (static-style) */
    toast(options) {
        const opts = typeof options === 'string' ? { title: options } : options;
        const id = `toast-${++toastIdCounter}`;
        const item = {
            ...defaultToast,
            ...opts,
            id: opts.id || id,
            createdAt: Date.now(),
            exiting: false,
        };
        this.toasts.update(prev => [...prev, item]);
        return item.id;
    }
    dismiss(id) {
        this.toasts.update(prev => prev.map(t => t.id === id && !t.exiting ? { ...t, exiting: true } : t));
        setTimeout(() => {
            this.toasts.update(prev => prev.filter(t => t.id !== id));
        }, 200);
    }
    success(title, description) {
        return this.toast({ title, description, variant: 'success' });
    }
    error(title, description) {
        return this.toast({ title, description, variant: 'error' });
    }
    warning(title, description) {
        return this.toast({ title, description, variant: 'warning' });
    }
    info(title, description) {
        return this.toast({ title, description, variant: 'info' });
    }
};
ToastService = __decorate([
    Injectable({ providedIn: 'root' })
], ToastService);
export { ToastService };
//# sourceMappingURL=toast.service.js.map