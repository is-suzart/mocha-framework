import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { usePrefix } from './PrefixContext';
import { cn, cnEl } from './cn';
import ReactDOM from 'react-dom';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';
export type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
export type ToastColor =
  | 'rosewater' | 'flamingo' | 'pink' | 'mauve' | 'red' | 'maroon'
  | 'peach' | 'yellow' | 'green' | 'teal' | 'sky' | 'sapphire' | 'blue' | 'lavender';

export interface ToastOptions {
  id?: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  position?: ToastPosition;
  filled?: boolean;
  color?: ToastColor;
  className?: string;
  style?: React.CSSProperties;
}

interface ToastItem extends Required<ToastOptions> {
  id: string;
  createdAt: number;
  exiting: boolean;
}

interface ToastContextValue {
  toasts: ToastItem[];
  addToast: (options: ToastOptions) => string;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let toastCount = 0;
const listeners = new Set<(toast: ToastOptions) => void>();

function toast(options: ToastOptions | string): string {
  const opts: ToastOptions = typeof options === 'string' ? { title: options } : options;
  const id = `toast-${++toastCount}`;
  listeners.forEach(fn => fn({ ...opts, id }));
  return id;
}

const defaultToast: Required<ToastOptions> = {
  id: '',
  title: '',
  description: '',
  variant: 'info',
  duration: 4000,
  position: 'bottom-right',
  filled: false,
  color: '' as ToastColor,
  className: '',
  style: {},
};

function getIcon(variant: ToastVariant): React.ReactNode {
  switch (variant) {
    case 'success':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      );
    case 'error':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      );
    case 'warning':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      );
    case 'info':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      );
  }
}

function ToastItem({ data, onRemove }: { data: ToastItem; onRemove: (id: string) => void }) {
  const prefix = usePrefix();
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const [exiting, setExiting] = useState(false);

  const handleClose = useCallback(() => {
    setExiting(true);
    setTimeout(() => onRemove(data.id), 200);
  }, [data.id, onRemove]);

  useEffect(() => {
    if (data.duration > 0) {
      timerRef.current = setTimeout(handleClose, data.duration);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [data.duration, handleClose]);

  const classes = [
    cn(prefix, 'toast'),
    data.className,
  ].filter(Boolean).join(' ');

  return (
    <div
      className={classes}
      role="alert"
      aria-live="assertive"
      data-state={exiting ? 'exiting' : data.variant}
      data-color={data.color || undefined}
      data-variant={data.filled ? 'filled' : undefined}
      style={data.style && Object.keys(data.style).length > 0 ? data.style : undefined}
    >
      <div className={cnEl(prefix, 'toast', 'icon')}>{getIcon(data.variant)}</div>
      <div className={cnEl(prefix, 'toast', 'content')}>
        {data.title && <div className={cnEl(prefix, 'toast', 'title')}>{data.title}</div>}
        {data.description && <div className={cnEl(prefix, 'toast', 'description')}>{data.description}</div>}
      </div>
      <button className={cnEl(prefix, 'toast', 'close')} onClick={handleClose} aria-label="Dismiss">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
      {data.duration > 0 && (
        <div
          className={cnEl(prefix, 'toast', 'progress')}
          style={{ animationDuration: `${data.duration}ms` }}
        />
      )}
    </div>
  );
}

export const Toaster: React.FC<{
  position?: ToastPosition;
  toastOptions?: Partial<ToastOptions>;
}> = ({ position: defaultPosition = 'bottom-right', toastOptions: defaultOptions = {} }) => {
  const prefix = usePrefix();
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handler = (opts: ToastOptions) => {
      const item: ToastItem = {
        ...defaultToast,
        ...defaultOptions,
        ...opts,
        position: opts.position || defaultPosition,
        id: opts.id || `toast-${Date.now()}`,
        createdAt: Date.now(),
        exiting: false,
      };
      setToasts(prev => [...prev, item]);
    };
    listeners.add(handler);
    return () => { listeners.delete(handler); };
  }, [defaultPosition, defaultOptions]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  if (!mounted) return null;

  const grouped = new Map<ToastPosition, ToastItem[]>();
  toasts.forEach(t => {
    const group = grouped.get(t.position) || [];
    group.push(t);
    grouped.set(t.position, group);
  });

  return ReactDOM.createPortal(
    <>
      {Array.from(grouped.entries()).map(([pos, items]) => (
        <div key={pos} className={cn(prefix, 'toast-container')} data-state={pos}>
          {items.map(t => (
            <ToastItem key={t.id} data={t} onRemove={removeToast} />
          ))}
        </div>
      ))}
    </>,
    document.body
  );
};

Toaster.displayName = 'Toaster';

export function useToast() {
  const ctx = useContext(ToastContext);
  return {
    toast: ctx?.addToast || toast,
    dismiss: ctx?.removeToast,
  };
}

export { toast };

export const ToastProvider: React.FC<{ children: React.ReactNode; position?: ToastPosition }> = ({
  children,
  position = 'bottom-right',
}) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((options: ToastOptions): string => {
    const id = `toast-${++toastCount}`;
    const item: ToastItem = {
      ...defaultToast,
      ...options,
      position: options.position || position,
      id,
      createdAt: Date.now(),
      exiting: false,
    };
    setToasts(prev => [...prev, item]);
    return id;
  }, [position]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
};

ToastProvider.displayName = 'ToastProvider';
