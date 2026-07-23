import { useState } from "react";
import { ColorPicker, Button } from '@mocha-ds/react';
import type { ColorPickerVariant, ColorPickerSize } from '@mocha-ds/react';

function copyToClipboard(text: string) { navigator.clipboard.writeText(text); }

export default function ColorPickerPage() {
  const [colorPickerVal, setColorPickerVal] = useState('#cba6f7');
  const [colorPickerVariant, setColorPickerVariant] = useState<ColorPickerVariant>('both');
  const [colorPickerSize, setColorPickerSize] = useState<ColorPickerSize>('md');
  const [colorPickerFlavor, setColorPickerFlavor] = useState<'latte' | 'frappe' | 'macchiato' | 'mocha'>('mocha');
  const [colorPickerShowHexInput, setColorPickerShowHexInput] = useState(true);
  const [activeTab, setActiveTab] = useState<'react' | 'vue' | 'angular'>('react');

  const getReactCode = () => `<span class="hl-tag">&lt;ColorPicker</span>\n  <span class="hl-attr">value</span>=<span class="hl-str">"${colorPickerVal}"</span>\n  <span class="hl-attr">onChange</span>=<span class="hl-str">{(val) => setValue(val)}</span>\n  <span class="hl-attr">flavor</span>=<span class="hl-str">"${colorPickerFlavor}"</span>\n  <span class="hl-attr">variant</span>=<span class="hl-str">"${colorPickerVariant}"</span>\n  <span class="hl-attr">size</span>=<span class="hl-str">"${colorPickerSize}"</span>\n  <span class="hl-attr">showHexInput</span>=<span class="hl-str">{${colorPickerShowHexInput}}</span>\n<span class="hl-tag">/&gt;</span>`;
  const getVueCode = () => `<span class="hl-tag">&lt;CtpColorPicker</span>\n  <span class="hl-attr">v-model:value</span>=<span class="hl-str">"color"</span>\n  <span class="hl-attr">flavor</span>=<span class="hl-str">"${colorPickerFlavor}"</span>\n<span class="hl-tag">/&gt;</span>`;
  const getAngularCode = () => `<span class="hl-tag">&lt;color-picker</span>\n  <span class="hl-attr">[value]</span>=<span class="hl-str">"color"</span>\n  <span class="hl-attr">(change)</span>=<span class="hl-str">"color = $event"</span>\n<span class="hl-tag">&gt;&lt;/color-picker&gt;</span>`;

  return (
    <section>
      <h2 className="section-title"><span>🎨</span> Color Picker Component</h2>
      <div className="playground-section">
        <div className="playground-card" style={{ height: 'fit-content' }}>
          <h3 style={{ margin: '0 0 1.2rem 0', fontSize: '1.2rem', color: 'var(--ctp-mauve)' }}>ColorPicker Settings</h3>
          <div className="control-grid">
            <div className="control-group">
              <label htmlFor="cp-variant-select">Picker Variant</label>
              <select id="cp-variant-select" value={colorPickerVariant} onChange={(e) => setColorPickerVariant(e.target.value as ColorPickerVariant)}>
                <option value="both">Both (Swatches + Custom)</option>
                <option value="swatches">Swatches Only</option>
                <option value="custom">Custom Spectrum Only</option>
              </select>
            </div>
            <div className="control-group">
              <label htmlFor="cp-size-select">Component Size</label>
              <select id="cp-size-select" value={colorPickerSize} onChange={(e) => setColorPickerSize(e.target.value as ColorPickerSize)}>
                <option value="sm">Small (sm)</option>
                <option value="md">Medium (md)</option>
                <option value="lg">Large (lg)</option>
              </select>
            </div>
            <div className="control-group">
              <label htmlFor="cp-flavor-select">Accent Palette Flavor</label>
              <select id="cp-flavor-select" value={colorPickerFlavor} onChange={(e) => setColorPickerFlavor(e.target.value as any)}>
                <option value="latte">Latte (Light)</option>
                <option value="frappe">Frappé</option>
                <option value="macchiato">Macchiato</option>
                <option value="mocha">Mocha</option>
              </select>
            </div>
            <div className="control-group" style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
              <label className="checkbox-label" style={{ marginTop: '22px' }}><input type="checkbox" checked={colorPickerShowHexInput} onChange={(e) => setColorPickerShowHexInput(e.target.checked)} />Show HEX text input</label>
            </div>
          </div>
        </div>
        <div className="playground-card playground-card--preview">
          <h3 style={{ margin: '0 0 1.2rem 0', fontSize: '1.2rem' }}>Interactive Canvas</h3>
          <div className="preview-canvas" style={{ minHeight: '160px', flexDirection: 'column', gap: '20px', padding: '2rem' }}>
            <ColorPicker value={colorPickerVal} onChange={setColorPickerVal} flavor={colorPickerFlavor} variant={colorPickerVariant} size={colorPickerSize} showHexInput={colorPickerShowHexInput} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--ctp-subtext0)' }}>Current Selected Value:</span>
              <strong style={{ fontFamily: 'monospace', color: colorPickerVal, textShadow: '0 0 8px rgba(0,0,0,0.2)' }}>{colorPickerVal.toUpperCase()}</strong>
            </div>
          </div>
          <div>
            <div className="tabs-header">
              {(['react', 'vue', 'angular'] as const).map((tab) => <button key={tab} className={`tab-btn ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</button>)}
            </div>
            <div className="code-container">
              <button className="code-copy-btn" onClick={() => { const code = activeTab === 'react' ? getReactCode() : activeTab === 'vue' ? getVueCode() : getAngularCode(); copyToClipboard(code.replace(/<[^>]*>/g, '')); }}>Copy Code</button>
              <pre className="code-block"><code dangerouslySetInnerHTML={{ __html: activeTab === 'react' ? getReactCode() : activeTab === 'vue' ? getVueCode() : getAngularCode() }} /></pre>
            </div>
          </div>
        </div>
      </div>
      <div style={{ marginTop: '2rem' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--ctp-text)' }}>🎨 Dynamic Card Customization Demo</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div style={{ padding: '2rem', borderRadius: '12px', backgroundColor: 'var(--ctp-mantle)', border: `2px solid ${colorPickerVal}`, boxShadow: `0 8px 32px -4px ${colorPickerVal}15, 0 0 16px ${colorPickerVal}10`, display: 'flex', flexDirection: 'column', gap: '1.2rem', transition: 'all 0.3s ease' }}>
            <h4 style={{ margin: 0, fontSize: '1.25rem', color: colorPickerVal }}>Card With Active Picker Color</h4>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--ctp-subtext1)', lineHeight: 1.5 }}>This card dynamically adopts the currently picked color as its accent border and shadow. Adjust the color picker above to see real-time reflection.</p>
            <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
              <Button variant="filled" style={{ backgroundColor: colorPickerVal, borderColor: 'transparent', color: '#fff' }}>Accent Action</Button>
            </div>
          </div>
          <div style={{ padding: '2rem', borderRadius: '12px', backgroundColor: 'var(--ctp-crust)', border: '1px solid var(--ctp-surface0)', display: 'flex', flexDirection: 'column', gap: '0.8rem', fontFamily: 'monospace', fontSize: '0.85rem' }}>
            <span style={{ fontWeight: 600, color: 'var(--ctp-subtext0)' }}>Color Details</span>
            <span>HEX: <strong style={{ color: colorPickerVal }}>{colorPickerVal.toUpperCase()}</strong></span>
            <span>Flavor palette: <strong>{colorPickerFlavor}</strong></span>
            <span>Variant mode: <strong>{colorPickerVariant}</strong></span>
          </div>
        </div>
      </div>
    </section>
  );
}
