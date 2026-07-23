import { useState } from "react";
import { ProgressBar } from '@mocha-ds/react';
import type { ProgressBarSize, ProgressBarColor } from '@mocha-ds/react';
import { colors } from '../data/colors';

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
}

export default function ProgressPage() {
  const [progressVal, setProgressVal] = useState(45);
  const [progressSize, setProgressSize] = useState<ProgressBarSize>('md');
  const [progressColor, setProgressColor] = useState<ProgressBarColor>('mauve');
  const [progressStriped, setProgressStriped] = useState(false);
  const [progressAnimated, setProgressAnimated] = useState(false);
  const [progressIndeterminate, setProgressIndeterminate] = useState(false);
  const [progressShowValue, setProgressShowValue] = useState(true);
  const [progressValPosition, setProgressValPosition] = useState<'inside' | 'outside'>('outside');
  const [progressLabel, setProgressLabel] = useState('Downloading layout packages');
  const [scrollAccent, setScrollAccent] = useState<ProgressBarColor>('mauve');
  const [activeTab, setActiveTab] = useState<'react' | 'vue' | 'angular'>('react');

  const getReactProgressCode = () => {
    const props: string[] = [];
    if (!progressIndeterminate) props.push(`value={${progressVal}}`);
    if (progressSize !== 'md') props.push(`size="${progressSize}"`);
    if (progressColor !== 'mauve') props.push(`color="${progressColor}"`);
    if (progressStriped) props.push('striped');
    if (progressAnimated) props.push('animated');
    if (progressIndeterminate) props.push('indeterminate');
    if (progressShowValue) props.push('showValue');
    if (progressShowValue && progressValPosition !== 'outside') props.push(`valuePosition="${progressValPosition}"`);
    if (progressLabel) props.push(`label="${progressLabel}"`);
    return `<span class="hl-tag">&lt;ProgressBar</span>\n  ${props.map(p => `<span class="hl-attr">${p.split('=')[0]}</span>${p.includes('=') ? `=<span class="hl-str">${p.substring(p.indexOf('=') + 1)}</span>` : ''}`).join('\n  ')}\n<span class="hl-tag">/&gt;</span>`;
  };

  const getVueProgressCode = () => {
    const props: string[] = [];
    if (!progressIndeterminate) props.push(`:value="${progressVal}"`);
    if (progressSize !== 'md') props.push(`size="${progressSize}"`);
    if (progressColor !== 'mauve') props.push(`color="${progressColor}"`);
    if (progressStriped) props.push(':striped="true"');
    if (progressAnimated) props.push(':animated="true"');
    if (progressIndeterminate) props.push(':indeterminate="true"');
    if (progressShowValue) props.push(':show-value="true"');
    if (progressShowValue && progressValPosition !== 'outside') props.push(`value-position="${progressValPosition}"`);
    if (progressLabel) props.push(`label="${progressLabel}"`);
    return `<span class="hl-tag">&lt;CtpProgressBar</span>\n  ${props.map(p => `<span class="hl-attr">${p.split('=')[0]}</span>${p.includes('=') ? `=<span class="hl-str">${p.substring(p.indexOf('=') + 1)}</span>` : ''}`).join('\n  ')}\n<span class="hl-tag">/&gt;</span>`;
  };

  const getAngularProgressCode = () => {
    const props: string[] = [];
    if (!progressIndeterminate) props.push(`[value]="${progressVal}"`);
    if (progressSize !== 'md') props.push(`size="${progressSize}"`);
    if (progressColor !== 'mauve') props.push(`color="${progressColor}"`);
    if (progressStriped) props.push('[striped]="true"');
    if (progressAnimated) props.push('[animated]="true"');
    if (progressIndeterminate) props.push('[indeterminate]="true"');
    if (progressShowValue) props.push('[showValue]="true"');
    if (progressShowValue && progressValPosition !== 'outside') props.push(`valuePosition="${progressValPosition}"`);
    if (progressLabel) props.push(`label="${progressLabel}"`);
    return `<span class="hl-tag">&lt;progressbar</span>\n  ${props.map(p => `<span class="hl-attr">${p.split('=')[0]}</span>${p.includes('=') ? `=<span class="hl-str">${p.substring(p.indexOf('=') + 1)}</span>` : ''}`).join('\n  ')}\n<span class="hl-tag">&gt;&lt;/progressbar&gt;</span>`;
  };

  const getRawTextCode = () => {
    const code = activeTab === 'react' ? getReactProgressCode() : activeTab === 'vue' ? getVueProgressCode() : getAngularProgressCode();
    return code.replace(/<[^>]*>/g, '');
  };

  return (
    <section>
      <h2 className="section-title"><span>📈</span> Progress Bar & Scrollbar Utilities</h2>
      <div className="playground-section">
        <div className="playground-card" style={{ gap: '1.2rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Progress Bar Configuration</h3>
          <div className="control-grid">
            <div className="control-group control-group--full">
              <label htmlFor="progress-label-input">Label Text</label>
              <input id="progress-label-input" type="text" value={progressLabel} onChange={(e) => setProgressLabel(e.target.value)} />
            </div>
            <div className="control-group">
              <label htmlFor="progress-color-select">Color Accent</label>
              <select id="progress-color-select" value={progressColor} onChange={(e) => setProgressColor(e.target.value as ProgressBarColor)}>
                {colors.map((c) => <option key={c.name} value={c.name.toLowerCase()}>{c.name}</option>)}
              </select>
            </div>
            <div className="control-group">
              <label htmlFor="progress-size-select">Size Height</label>
              <select id="progress-size-select" value={progressSize} onChange={(e) => setProgressSize(e.target.value as ProgressBarSize)}>
                <option value="sm">Small (sm, 6px)</option>
                <option value="md">Medium (md, 10px)</option>
                <option value="lg">Large (lg, 16px)</option>
              </select>
            </div>
            <div className="control-group">
              <label htmlFor="progress-val-input">Progress Value: {progressVal}%</label>
              <input id="progress-val-input" type="range" min="0" max="100" value={progressVal} onChange={(e) => setProgressVal(Number(e.target.value))} disabled={progressIndeterminate} style={{ cursor: 'pointer', accentColor: `var(--ctp-${progressColor})` }} />
            </div>
            <div className="control-group">
              <label htmlFor="progress-position-select">Value Position</label>
              <select id="progress-position-select" value={progressValPosition} onChange={(e) => setProgressValPosition(e.target.value as any)} disabled={!progressShowValue || progressSize !== 'lg'}>
                <option value="outside">Outside (above bar)</option>
                <option value="inside">Inside (centered, LG height only)</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '4px' }}>
            <label className="checkbox-label"><input type="checkbox" checked={progressIndeterminate} onChange={(e) => setProgressIndeterminate(e.target.checked)} />Indeterminate Loop Loading</label>
            <label className="checkbox-label"><input type="checkbox" checked={progressStriped} onChange={(e) => setProgressStriped(e.target.checked)} />Striped Diagonal Texture</label>
            <label className="checkbox-label"><input type="checkbox" checked={progressAnimated} onChange={(e) => setProgressAnimated(e.target.checked)} disabled={!progressStriped} />Animate Stripe Movement</label>
            <label className="checkbox-label"><input type="checkbox" checked={progressShowValue} onChange={(e) => setProgressShowValue(e.target.checked)} disabled={progressIndeterminate} />Show Value Percentage Text</label>
          </div>
        </div>
        <div className="playground-card playground-card--preview">
          <h3 style={{ margin: '0 0 1.2rem 0', fontSize: '1.2rem' }}>Component Preview</h3>
          <div className="preview-canvas" style={{ padding: '2rem', minHeight: '160px' }}>
            <div style={{ width: '100%' }}>
              <ProgressBar value={progressVal} size={progressSize} color={progressColor} striped={progressStriped} animated={progressAnimated} indeterminate={progressIndeterminate} showValue={progressShowValue} valuePosition={progressValPosition} label={progressLabel || undefined} />
            </div>
          </div>
          <div>
            <div className="tabs-header">
              {(['react', 'vue', 'angular'] as const).map((tab) => (
                <button key={tab} className={`tab-btn ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</button>
              ))}
            </div>
            <div className="code-container">
              <button className="code-copy-btn" onClick={() => copyToClipboard(getRawTextCode())}>Copy Code</button>
              <pre className="code-block"><code dangerouslySetInnerHTML={{ __html: activeTab === 'react' ? getReactProgressCode() : activeTab === 'vue' ? getVueProgressCode() : getAngularProgressCode() }} /></pre>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '2.5rem', marginBottom: '3rem' }}>
        <h3 style={{ margin: '0 0 0.8rem 0' }}>✨ Custom Scrollbar Utility vs Browser Default Scrollbar ✨</h3>
        <p style={{ margin: '0 0 1.5rem 0', fontSize: '0.9rem', color: 'var(--ctp-subtext0)' }}>
          Compare standard browser scrollbars with the customized, premium, color-mix hoverable <code>.scrollbar</code> utility.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--ctp-mantle)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--ctp-surface0)', marginBottom: '1.5rem' }}>
          <span style={{ fontWeight: 'bold', fontSize: '0.88rem' }}>Scroll Thumb Hover Accent:</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {colors.map((c) => (
              <button key={c.name} onClick={() => setScrollAccent(c.name.toLowerCase() as any)} style={{ background: `var(${c.variable})`, border: `2px solid ${scrollAccent === c.name.toLowerCase() ? 'var(--ctp-text)' : 'transparent'}`, width: '20px', height: '20px', borderRadius: '50%', cursor: 'pointer', boxShadow: 'var(--ctp-shadow-sm)', transition: 'transform 0.15s ease' }} title={`Highlight in ${c.name} on hover`} />
            ))}
          </div>
          <span style={{ textTransform: 'capitalize', fontSize: '0.85rem', fontWeight: 'bold', color: `var(--ctp-${scrollAccent})` }}>{scrollAccent}</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div className="playground-card" style={{ gap: '1rem', padding: '1.5rem' }}>
            <h4 style={{ margin: 0, color: 'var(--ctp-subtext1)' }}>🚫 Default Browser Scrollbar</h4>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--ctp-subtext0)' }}>Stiff edges, default system colors, lacks design system coordination.</p>
            <div style={{ height: '240px', overflowY: 'scroll', backgroundColor: 'var(--ctp-crust)', borderRadius: '8px', padding: '12px', border: '1px solid var(--ctp-surface0)', lineHeight: '1.6', fontSize: '0.85rem', fontFamily: 'monospace', whiteSpace: 'pre' }}>
              {Array.from({ length: 25 }).map((_, i) => `[SYS_DEFAULT_LOG_LINE_${i + 1}]: Loading asset catalog... done!\n[SYS_DEFAULT_LOG_LINE_${i + 1}]: Allocating buffer page cache...\n[SYS_DEFAULT_LOG_LINE_${i + 1}]: Initializing theme variables... done!\n`).join('')}
            </div>
          </div>
          <div className="playground-card" style={{ gap: '1rem', padding: '1.5rem' }}>
            <h4 style={{ margin: 0, color: `var(--ctp-${scrollAccent})` }}>✨ Catppuccin Scrollbar (<code>.scrollbar</code>)</h4>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--ctp-subtext0)' }}>Rounded shape, thin width, mantle background integration, hover highlights.</p>
            <div className={`scrollbar scrollbar--${scrollAccent}`} style={{ height: '240px', overflowY: 'scroll', backgroundColor: 'var(--ctp-crust)', borderRadius: '8px', padding: '12px', border: '1px solid var(--ctp-surface0)', lineHeight: '1.6', fontSize: '0.85rem', fontFamily: 'monospace', whiteSpace: 'pre' }}>
              {Array.from({ length: 25 }).map((_, i) => `[CTP_ACCENT_LOG_LINE_${i + 1}]: Loading asset catalog... done!\n[CTP_ACCENT_LOG_LINE_${i + 1}]: Allocating buffer page cache...\n[CTP_ACCENT_LOG_LINE_${i + 1}]: Initializing theme variables... done!\n`).join('')}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
