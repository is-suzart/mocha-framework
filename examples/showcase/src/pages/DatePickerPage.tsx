import { useState } from "react";
import { DatePicker } from '@mocha-ds/react';
import type { DatePickerMode, FormControlColor } from '@mocha-ds/react';

export default function DatePickerPage() {
  const [dpMode, setDpMode] = useState<DatePickerMode>('single');
  const [dpColor, setDpColor] = useState<FormControlColor>('mauve');
  const [dpDate, setDpDate] = useState<Date | null>(null);
  const [dpRange, setDpRange] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null });
  const [dpShowToday, setDpShowToday] = useState(true);
  const [dpDisabled, setDpDisabled] = useState(false);

  return (
    <section className="playground-section">
      <h2 className="section-title"><span>📅</span> Date Picker Component</h2>
      <div className="playground-layout">
        <div className="demo-stage">
          <h3 className="stage-title">Live Preview</h3>
          <div style={{ padding: '2rem', backgroundColor: 'var(--ctp-mantle)', borderRadius: '12px', border: '1px solid var(--ctp-surface0)', minHeight: '260px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '1.5rem' }}>
            <DatePicker mode={dpMode} color={dpColor} value={(dpMode === 'single' ? dpDate : dpRange) as any} onChange={(val: any) => { if (dpMode === 'single') setDpDate(val as Date | null); else setDpRange(val as { start: Date | null; end: Date | null }); }} showToday={dpShowToday} disabled={dpDisabled} />
          </div>
        </div>
        <div className="playground-controls">
          <h3 className="controls-title">DatePicker Customizer</h3>
          <div className="control-group">
            <label className="control-label">Selection Mode</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {(['single', 'range'] as const).map((m) => (
                <button key={m} onClick={() => { setDpMode(m); setDpDate(null); setDpRange({ start: null, end: null }); }} style={{ flex: 1, padding: '0.4rem 0.75rem', borderRadius: '6px', border: dpMode === m ? '1px solid var(--ctp-mauve)' : '1px solid var(--ctp-surface1)', backgroundColor: dpMode === m ? 'var(--ctp-mauve)' : 'transparent', color: dpMode === m ? 'var(--ctp-base)' : 'var(--ctp-text)', cursor: 'pointer', fontWeight: 'bold', fontFamily: 'var(--ctp-font-family)' }}>{m.toUpperCase()}</button>
              ))}
            </div>
          </div>
          <div className="control-group" style={{ marginTop: '1.25rem' }}>
            <label className="control-label">Accent Color</label>
            <select value={dpColor} onChange={(e) => setDpColor(e.target.value as FormControlColor)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', backgroundColor: 'var(--ctp-surface0)', border: '1px solid var(--ctp-surface1)', color: 'var(--ctp-text)', fontFamily: 'var(--ctp-font-family)', outline: 'none' }}>
              <option value="mauve">Mauve</option>
              <option value="blue">Blue</option>
              <option value="green">Green</option>
              <option value="red">Red</option>
              <option value="yellow">Yellow</option>
              <option value="pink">Pink</option>
            </select>
          </div>
          <div className="control-group" style={{ marginTop: '1.25rem' }}>
            <label className="control-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}><input type="checkbox" checked={dpShowToday} onChange={(e) => setDpShowToday(e.target.checked)} style={{ cursor: 'pointer' }} /><span>Show Today Button</span></label>
          </div>
          <div className="control-group" style={{ marginTop: '0.75rem' }}>
            <label className="control-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}><input type="checkbox" checked={dpDisabled} onChange={(e) => setDpDisabled(e.target.checked)} style={{ cursor: 'pointer' }} /><span>Disabled</span></label>
          </div>
        </div>
      </div>
      <div style={{ marginTop: '2rem' }}>
        <pre className="code-block" style={{ padding: '1rem', overflowX: 'auto' }}>
          <code>{`import { DatePicker } from '@mocha-ds/react';

<DatePicker
  mode="${dpMode}"
  color="${dpColor}"
  onChange={(val) => console.log(val)}
  showToday={${dpShowToday}}
  disabled={${dpDisabled}}
/>`}</code>
        </pre>
      </div>
    </section>
  );
}
