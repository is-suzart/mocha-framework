import { useState } from "react";
import { Tooltip, Button } from '@mocha-ds/react';
import { TrashIcon, InfoIcon } from '@mocha-ds/react';
import type { Placement, ButtonColor } from '@mocha-ds/react';

function copyToClipboard(text: string) { navigator.clipboard.writeText(text); }

export default function TooltipPage() {
  const [tooltipPlacement, setTooltipPlacement] = useState<Placement>('top');
  const [tooltipColor, setTooltipColor] = useState<ButtonColor | 'dark' | 'light'>('dark');
  const [tooltipDelay, setTooltipDelay] = useState(150);
  const [tooltipAutoFlip, setTooltipAutoFlip] = useState(true);
  const [activeTab, setActiveTab] = useState<'react' | 'vue' | 'angular'>('react');

  const getReactTooltipCode = () => `<span class="hl-tag">&lt;Tooltip</span>\n  <span class="hl-attr">content</span>=<span class="hl-str">"Configurações do painel"</span>\n  <span class="hl-attr">placement</span>=<span class="hl-str">"${tooltipPlacement}"</span>\n  <span class="hl-attr">color</span>=<span class="hl-str">"${tooltipColor}"</span>\n  <span class="hl-attr">delay</span>=<span class="hl-str">{${tooltipDelay}}</span>\n  <span class="hl-attr">autoFlip</span>=<span class="hl-str">{${tooltipAutoFlip}}</span>\n<span class="hl-tag">&gt;</span>\n  <span class="hl-tag">&lt;Button&gt;</span>Passar Mouse<span class="hl-tag">&lt;/Button&gt;</span>\n<span class="hl-tag">&lt;/Tooltip&gt;</span>`;

  const getVueTooltipCode = () => `<span class="hl-tag">&lt;CtpTooltip</span> <span class="hl-attr">content</span>=<span class="hl-str">"Configurações do painel"</span> <span class="hl-attr">placement</span>=<span class="hl-str">"${tooltipPlacement}"</span> <span class="hl-attr">color</span>=<span class="hl-str">"${tooltipColor}"</span><span class="hl-tag">&gt;</span>\n  <span class="hl-tag">&lt;CtpButton&gt;</span>Passar Mouse<span class="hl-tag">&lt;/CtpButton&gt;</span>\n<span class="hl-tag">&lt;/CtpTooltip&gt;</span>`;

  const getAngularTooltipCode = () => `<span class="hl-tag">&lt;button</span> <span class="hl-attr">button</span> <span class="hl-attr">[ctpTooltip]</span>=<span class="hl-str">"'Configurações do painel'"</span> <span class="hl-attr">tooltipPlacement</span>=<span class="hl-str">"${tooltipPlacement}"</span> <span class="hl-attr">tooltipColor</span>=<span class="hl-str">"${tooltipColor}"</span><span class="hl-tag">&gt;</span>Passar Mouse<span class="hl-tag">&lt;/button&gt;</span>`;

  return (
    <section>
      <h2 className="section-title"><span>💬</span> Tooltip Portal Component</h2>
      <div className="playground-section">
        <div className="demo-stage" style={{ width: '100%', minHeight: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h3 className="stage-title">Interactive Stage</h3>
          <div style={{ padding: '4rem 2rem', backgroundColor: 'var(--ctp-mantle)', borderRadius: '12px', border: '1px solid var(--ctp-surface0)', display: 'flex', gap: '2rem', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
            <Tooltip content="Olá! Eu sou um Tooltip posicionado via Portal." placement={tooltipPlacement} color={tooltipColor} delay={tooltipDelay} autoFlip={tooltipAutoFlip}>
              <Button color="mauve">Passe o Mouse Aqui</Button>
            </Tooltip>
            <Tooltip content="Ação deletar é irreversível!" placement={tooltipPlacement} color="red" delay={tooltipDelay} autoFlip={tooltipAutoFlip}>
              <button className="btn btn--outline btn--red btn--md btn--rounded" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><TrashIcon size={16} />Excluir Item</button>
            </Tooltip>
            <Tooltip content="Informações adicionais sobre o sistema" placement={tooltipPlacement} color="blue" delay={tooltipDelay} autoFlip={tooltipAutoFlip}>
              <span style={{ cursor: 'help', color: 'var(--ctp-blue)', display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'underline dotted', fontWeight: 600 }}><InfoIcon size={18} />Mais Informações</span>
            </Tooltip>
          </div>
        </div>
        <div className="playground-controls">
          <h3 className="controls-title">Tooltip Customizer</h3>
          <div className="control-group">
            <label className="control-label">Tooltip Placement</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.4rem' }}>
              {(['top', 'top-start', 'top-end', 'bottom', 'bottom-start', 'bottom-end', 'left', 'right'] as const).map((p) => (
                <button key={p} onClick={() => setTooltipPlacement(p)} style={{ padding: '0.4rem', borderRadius: '6px', border: tooltipPlacement === p ? '1px solid var(--ctp-mauve)' : '1px solid var(--ctp-surface1)', backgroundColor: tooltipPlacement === p ? 'var(--ctp-mauve)' : 'transparent', color: tooltipPlacement === p ? 'var(--ctp-base)' : 'var(--ctp-text)', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.75rem' }}>{p}</button>
              ))}
            </div>
          </div>
          <div className="control-group" style={{ marginTop: '1.25rem' }}>
            <label className="control-label">Tooltip Color Presets</label>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              {(['dark', 'light'] as const).map((v) => (
                <button key={v} onClick={() => setTooltipColor(v)} style={{ flex: 1, padding: '0.4rem', borderRadius: '6px', border: tooltipColor === v ? '1px solid var(--ctp-mauve)' : '1px solid var(--ctp-surface1)', backgroundColor: tooltipColor === v ? 'var(--ctp-mauve)' : 'transparent', color: tooltipColor === v ? 'var(--ctp-base)' : 'var(--ctp-text)', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.75rem', textTransform: 'capitalize' }}>{v} theme</button>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.4rem' }}>
              {['rosewater', 'flamingo', 'pink', 'mauve', 'red', 'peach', 'yellow', 'green', 'teal', 'blue', 'sky', 'lavender', 'sapphire', 'maroon'].map((c) => (
                <button key={c} onClick={() => setTooltipColor(c as any)} title={c.charAt(0).toUpperCase() + c.slice(1)} style={{ height: '24px', borderRadius: '4px', border: tooltipColor === c ? '2px solid white' : '1px solid var(--ctp-surface1)', backgroundColor: `var(--ctp-${c})`, cursor: 'pointer' }} />
              ))}
            </div>
          </div>
          <div className="control-group" style={{ marginTop: '1.25rem' }}>
            <label className="control-label" style={{ display: 'flex', justifyContent: 'space-between' }}><span>Hover Delay ({tooltipDelay}ms)</span></label>
            <input type="range" min="50" max="1000" step="50" value={tooltipDelay} onChange={(e) => setTooltipDelay(Number(e.target.value))} style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--ctp-mauve)' }} />
          </div>
          <div className="control-group" style={{ marginTop: '1.25rem' }}>
            <label className="control-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}><input type="checkbox" checked={tooltipAutoFlip} onChange={(e) => setTooltipAutoFlip(e.target.checked)} style={{ cursor: 'pointer' }} /><span>Enable Viewport Auto-Flip</span></label>
          </div>
        </div>
      </div>
      <div style={{ marginTop: '2rem' }}>
        <div className="tabs-header" style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--ctp-surface1)', paddingBottom: '1px' }}>
          {['react', 'vue', 'angular'].map((tab) => (
            <button key={tab} className={`tab-btn ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab as any)} style={{ padding: '0.5rem 1rem', border: 'none', background: 'none', color: activeTab === tab ? 'var(--ctp-mauve)' : 'var(--ctp-subtext0)', borderBottom: activeTab === tab ? '2px solid var(--ctp-mauve)' : 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: activeTab === tab ? 'bold' : 'normal' }}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</button>
          ))}
        </div>
        <div className="code-container" style={{ position: 'relative', marginTop: '1rem', borderRadius: '8px', overflow: 'hidden' }}>
          <button className="code-copy-btn" onClick={() => { const code = activeTab === 'react' ? getReactTooltipCode() : activeTab === 'vue' ? getVueTooltipCode() : getAngularTooltipCode(); copyToClipboard(code.replace(/<[^>]*>/g, '')); }} style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', padding: '0.3rem 0.6rem', fontSize: '0.8rem', borderRadius: '4px', border: '1px solid var(--ctp-surface1)', backgroundColor: 'var(--ctp-surface0)', color: 'var(--ctp-text)', cursor: 'pointer' }}>Copy Code</button>
          <pre className="code-block" style={{ margin: 0, padding: '1rem', overflowX: 'auto', backgroundColor: 'var(--ctp-mantle)', borderRadius: '8px' }}><code dangerouslySetInnerHTML={{ __html: activeTab === 'react' ? getReactTooltipCode() : activeTab === 'vue' ? getVueTooltipCode() : getAngularTooltipCode() }} /></pre>
        </div>
      </div>
    </section>
  );
}
