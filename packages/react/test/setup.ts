import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

class IntersectionObserverMock {
  readonly root: Element | null = null;
  readonly rootMargin: string = '';
  readonly thresholds: ReadonlyArray<number> = [];
  private callback: IntersectionObserverCallback;

  constructor(callback: IntersectionObserverCallback, _options?: IntersectionObserverInit) {
    this.callback = callback;
  }

  observe(_target: Element) {
    setTimeout(() => {
      this.callback([{ isIntersecting: true, target: _target } as IntersectionObserverEntry], this);
    }, 0);
  }
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] { return []; }
}

global.ResizeObserver = ResizeObserverMock as any;
global.IntersectionObserver = IntersectionObserverMock as any;

afterEach(() => {
  cleanup();
  document.body.innerHTML = '';
});
