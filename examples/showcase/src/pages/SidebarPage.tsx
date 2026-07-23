import { useState } from "react";
import { Sidebar } from '@mocha-ds/react';

export default function SidebarPage() {
  const [sbVariant, setSbVariant] = useState<'fixed' | 'floated'>('fixed');
  const [sbCollapsed, setSbCollapsed] = useState(false);
  const [sbExpandOnHover, setSbExpandOnHover] = useState(true);
  const [sbActiveItem, setSbActiveItem] = useState(0);

  return (
    <section>
      <h2 className="section-title"><span>🚪</span> Rich Sidebar Component</h2>
      <div className="playground-section">
        <div className="demo-stage" style={{ width: '100%' }}>
          <h3 className="stage-title">Sidebar Simulator</h3>
          <div style={{ display: 'flex', height: '400px', border: '1px solid var(--ctp-surface1)', borderRadius: '12px', overflow: 'hidden' }}>
            <Sidebar variant={sbVariant} collapsed={sbCollapsed} expandOnHover={sbExpandOnHover}>
              <Sidebar.Header>
                <span style={{ fontWeight: 800 }}>🐱 Menu</span>
              </Sidebar.Header>
              <Sidebar.Section>
                {[
                  { icon: '🏠', label: 'Dashboard' },
                  { icon: '📊', label: 'Analytics' },
                  { icon: '📂', label: 'Projects' },
                  { icon: '💬', label: 'Messages' },
                  { icon: '⚙️', label: 'Settings' }
                ].map((item, idx) => (
                  <Sidebar.Item key={idx} icon={item.icon} label={item.label} active={sbActiveItem === idx} onClick={() => setSbActiveItem(idx)} />
                ))}
              </Sidebar.Section>
            </Sidebar>
            <div style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: 'var(--ctp-base)', color: 'var(--ctp-text)', boxSizing: 'border-box' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>
                {['🏠', '📊', '📂', '💬', '⚙️'][sbActiveItem]}
              </div>
              <h3 style={{ margin: 0, fontWeight: 800 }}>Página: {['Dashboard', 'Analytics', 'Projects', 'Messages', 'Settings'][sbActiveItem]}</h3>
              <p style={{ margin: '8px 0 0', fontSize: '0.85rem', color: 'var(--ctp-subtext0)', textAlign: 'center' }}>Simulação de conteúdo ativo. Alterne as seções do menu lateral.</p>
            </div>
          </div>
        </div>
        <div className="playground-controls">
          <h3 className="controls-title">Sidebar Customizer</h3>
          <div className="control-group">
            <label className="control-label">Sidebar Visual Style</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {(['fixed', 'floated'] as const).map(v => (
                <button key={v} onClick={() => setSbVariant(v)} style={{ flex: 1, padding: '0.4rem 0.75rem', borderRadius: '6px', border: sbVariant === v ? '1px solid var(--ctp-mauve)' : '1px solid var(--ctp-surface1)', backgroundColor: sbVariant === v ? 'var(--ctp-mauve)' : 'transparent', color: sbVariant === v ? 'var(--ctp-base)' : 'var(--ctp-text)', cursor: 'pointer', fontWeight: 'bold', fontFamily: 'var(--ctp-font-family)' }}>{v.toUpperCase()}</button>
              ))}
            </div>
          </div>
          <div className="control-group" style={{ marginTop: '1.25rem' }}>
            <label className="control-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}><input type="checkbox" checked={sbCollapsed} onChange={(e) => setSbCollapsed(e.target.checked)} /><span>Collapsed (Mini Mode)</span></label>
          </div>
          <div className="control-group" style={{ marginTop: '0.5rem' }}>
            <label className="control-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}><input type="checkbox" checked={sbExpandOnHover} onChange={(e) => setSbExpandOnHover(e.target.checked)} disabled={!sbCollapsed} /><span>Expand on Hover (when Collapsed)</span></label>
          </div>
          <div style={{ marginTop: '1.5rem', padding: '0.75rem', borderRadius: '8px', backgroundColor: 'color-mix(in srgb, var(--ctp-mauve) 8%, transparent)', border: '1px solid var(--ctp-surface1)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--ctp-subtext0)', display: 'block', lineHeight: 1.3 }}>💡 <strong>Como testar:</strong> Ative a opção <strong>"Collapsed (Mini Mode)"</strong> e passe o mouse sobre o menu lateral.</span>
          </div>
        </div>
      </div>
      <div style={{ marginTop: '2rem' }}>
        <div className="code-container" style={{ position: 'relative', marginTop: '0.5rem', borderRadius: '8px', overflow: 'hidden' }}>
          <pre className="code-block" style={{ margin: 0, padding: '1rem', overflowX: 'auto', backgroundColor: 'var(--ctp-mantle)', borderRadius: '8px' }}>
            <code dangerouslySetInnerHTML={{ __html: `<span class="hl-tag">&lt;Sidebar</span>\n  <span class="hl-attr">variant</span>=<span class="hl-str">"${sbVariant}"</span>\n  <span class="hl-attr">collapsed</span>=<span class="hl-str">{${sbCollapsed}}</span>\n  <span class="hl-attr">expandOnHover</span>=<span class="hl-str">{${sbExpandOnHover}}</span>\n<span class="hl-tag">&gt;</span>\n  <span class="hl-tag">&lt;Sidebar.Header&gt;</span>🐱 Brand<span class="hl-tag">&lt;/Sidebar.Header&gt;</span>\n  <span class="hl-tag">&lt;Sidebar.Section&gt;</span>\n    <span class="hl-tag">&lt;Sidebar.Item</span> <span class="hl-attr">icon</span>=<span class="hl-str">"🏠"</span> <span class="hl-attr">label</span>=<span class="hl-str">"Dashboard"</span> <span class="hl-tag">/&gt;</span>\n  <span class="hl-tag">&lt;/Sidebar.Section&gt;</span>\n<span class="hl-tag">&lt;/Sidebar&gt;</span>` }} />
          </pre>
        </div>
      </div>
    </section>
  );
}
