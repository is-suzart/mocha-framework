import { useState } from "react";
import { Toaster, toast } from '@mocha-ds/react';
import type { ToastColor } from '@mocha-ds/react';
import { colors } from '../data/colors';

export default function ToastPage() {
  const [toastPosition, setToastPosition] = useState<'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'>('bottom-right');
  const [toastFilled, setToastFilled] = useState(false);
  const [toastColor, setToastColor] = useState<ToastColor | ''>('');
  const [toastCustomClass, setToastCustomClass] = useState('');

  return (
    <section>
      <h2 className="section-title"><span>🍞</span> Toast / Snackbar Playground</h2>
      <div className="playground-section">
        <div className="playground-card">
          <h3>Position</h3>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {(['top-right', 'top-left', 'bottom-right', 'bottom-left', 'top-center', 'bottom-center'] as const).map(p => (
              <button key={p} className={`btn btn--sm ${toastPosition === p ? 'btn--filled btn--mauve' : 'btn--outline'}`} onClick={() => setToastPosition(p)}>{p}</button>
            ))}
          </div>
        </div>
        <div className="playground-card">
          <h3>Mode</h3>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button className={`btn btn--sm ${!toastFilled ? 'btn--filled btn--mauve' : 'btn--outline'}`} onClick={() => setToastFilled(false)}>Accent (borda)</button>
            <button className={`btn btn--sm ${toastFilled ? 'btn--filled btn--mauve' : 'btn--outline'}`} onClick={() => setToastFilled(true)}>Filled (fundo)</button>
          </div>
        </div>
        <div className="playground-card">
          <h3>Color Override</h3>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <button className={`btn btn--sm ${!toastColor ? 'btn--filled btn--mauve' : 'btn--outline'}`} onClick={() => setToastColor('')}>Default (via variant)</button>
            {colors.map(c => (
              <button key={c.name} title={c.name} onClick={() => setToastColor(c.name.toLowerCase() as ToastColor)} style={{ width: 32, height: 32, borderRadius: 8, border: toastColor === c.name.toLowerCase() ? '3px solid var(--ctp-text)' : '2px solid transparent', background: `var(${c.variable})`, cursor: 'pointer', outline: 'none' }} />
            ))}
          </div>
        </div>
        <div className="playground-card">
          <h3>Custom CSS Class</h3>
          <input type="text" placeholder="e.g. my-toast-class" value={toastCustomClass} onChange={e => setToastCustomClass(e.target.value)} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--ctp-surface0)', background: 'var(--ctp-mantle)', color: 'var(--ctp-text)', width: '100%', maxWidth: 300 }} />
        </div>
        <div className="playground-card">
          <h3>Trigger Toasts</h3>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {(['info', 'success', 'warning', 'error'] as const).map(variant => (
              <button key={variant} className="btn" onClick={() => toast({ title: variant === 'info' ? 'Saved' : variant === 'success' ? 'Success!' : variant === 'warning' ? 'Warning' : 'Error', description: variant === 'info' ? 'Your changes have been saved.' : variant === 'success' ? 'Operation completed.' : variant === 'warning' ? 'Please check your input.' : 'Something went wrong.', variant, position: toastPosition, filled: toastFilled, color: toastColor || undefined, className: toastCustomClass || undefined })}>
                {variant.charAt(0).toUpperCase() + variant.slice(1)} Toast
              </button>
            ))}
          </div>
        </div>
      </div>
      <Toaster position={toastPosition} />
    </section>
  );
}
