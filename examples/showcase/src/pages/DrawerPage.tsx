import { useState } from "react";
import { Drawer, Button } from '@mocha-ds/react';
import type { DrawerPosition, DrawerSize, FormControlColor } from '@mocha-ds/react';
import { colors } from '../data/colors';

function copyToClipboard(text: string) { navigator.clipboard.writeText(text); }

export default function DrawerPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerPosition, setDrawerPosition] = useState<DrawerPosition>('right');
  const [drawerSize, setDrawerSize] = useState<DrawerSize>('md');
  const [drawerAccent, setDrawerAccent] = useState<FormControlColor>('mauve');
  const [drawerTitle, setDrawerTitle] = useState('Menu de Ajustes');
  const [drawerCloseOnOverlayClick, setDrawerCloseOnOverlayClick] = useState(true);
  const [drawerCloseOnEsc, setDrawerCloseOnEsc] = useState(true);
  const [drawerShowCloseButton, setDrawerShowCloseButton] = useState(true);
  const [drawerShowFooter, setDrawerShowFooter] = useState(true);
  const [activeTab, setActiveTab] = useState<'react' | 'vue' | 'angular'>('react');

  const getReactDrawerCode = () => {
    const props: string[] = [];
    props.push('isOpen={isDrawerOpen}');
    props.push('onClose={() => setIsDrawerOpen(false)}');
    if (drawerTitle) props.push(`title="${drawerTitle}"`);
    if (drawerPosition !== 'right') props.push(`position="${drawerPosition}"`);
    if (drawerSize !== 'md') props.push(`size="${drawerSize}"`);
    if (drawerAccent !== 'mauve') props.push(`color="${drawerAccent}"`);
    if (!drawerCloseOnOverlayClick) props.push('closeOnOverlayClick={false}');
    if (!drawerCloseOnEsc) props.push('closeOnEsc={false}');
    if (!drawerShowCloseButton) props.push('showCloseButton={false}');
    return `<span class="hl-tag">&lt;Drawer</span>\n  ${props.map(p => `<span class="hl-attr">${p.split('=')[0]}</span>${p.includes('=') ? `=<span class="hl-str">${p.slice(p.indexOf('=') + 1)}</span>` : ''}`).join('\n  ')}\n<span class="hl-tag">&gt;</span>\n  <span class="hl-text">&lt;p&gt;Conteúdo do Drawer...&lt;/p&gt;</span>\n<span class="hl-tag">&lt;/Drawer&gt;</span>`;
  };

  const getVueDrawerCode = () => {
    const props: string[] = ['v-model:is-open="isDrawerOpen"'];
    if (drawerTitle) props.push(`title="${drawerTitle}"`);
    if (drawerPosition !== 'right') props.push(`position="${drawerPosition}"`);
    if (drawerSize !== 'md') props.push(`size="${drawerSize}"`);
    if (drawerAccent !== 'mauve') props.push(`color="${drawerAccent}"`);
    return `<span class="hl-tag">&lt;CtpDrawer</span>\n  ${props.map(p => `<span class="hl-attr">${p.split('=')[0]}</span>${p.includes('=') ? `=<span class="hl-str">${p.slice(p.indexOf('=') + 1)}</span>` : ''}`).join('\n  ')}\n  <span class="hl-attr">@close</span>=<span class="hl-str">"isDrawerOpen = false"</span>\n<span class="hl-tag">&gt;</span>\n<span class="hl-tag">&lt;/CtpDrawer&gt;</span>`;
  };

  const getAngularDrawerCode = () => {
    const props: string[] = ['[isOpen]="isDrawerOpen"', '(close)="isDrawerOpen = false"'];
    if (drawerTitle) props.push(`title="${drawerTitle}"`);
    if (drawerPosition !== 'right') props.push(`position="${drawerPosition}"`);
    if (drawerSize !== 'md') props.push(`size="${drawerSize}"`);
    if (drawerAccent !== 'mauve') props.push(`color="${drawerAccent}"`);
    return `<span class="hl-tag">&lt;drawer</span>\n  ${props.map(p => `<span class="hl-attr">${p.split('=')[0]}</span>${p.includes('=') ? `=<span class="hl-str">${p.slice(p.indexOf('=') + 1)}</span>` : ''}`).join('\n  ')}\n<span class="hl-tag">&gt;</span>\n<span class="hl-tag">&lt;/drawer&gt;</span>`;
  };

  return (
    <section>
      <h2 className="section-title"><span>🚪</span> Retractable Drawer Panel Showcase</h2>
      <div className="playground-section">
        <div className="playground-card" style={{ height: 'fit-content' }}>
          <h3 style={{ margin: '0 0 1.2rem 0', fontSize: '1.2rem', color: 'var(--ctp-mauve)' }}>Drawer Configuration</h3>
          <div className="control-grid">
            <div className="control-group">
              <label htmlFor="drawer-position-select">Slide Position</label>
              <select id="drawer-position-select" value={drawerPosition} onChange={(e) => setDrawerPosition(e.target.value as DrawerPosition)}>
                <option value="right">Right (Direita)</option>
                <option value="left">Left (Esquerda)</option>
                <option value="top">Top (Topo)</option>
                <option value="bottom">Bottom (Base)</option>
              </select>
            </div>
            <div className="control-group">
              <label htmlFor="drawer-size-select">Drawer Size</label>
              <select id="drawer-size-select" value={drawerSize} onChange={(e) => setDrawerSize(e.target.value as DrawerSize)}>
                <option value="sm">Small (sm)</option>
                <option value="md">Medium (md)</option>
                <option value="lg">Large (lg)</option>
                <option value="full">Full Screen (full)</option>
              </select>
            </div>
            <div className="control-group">
              <label htmlFor="drawer-accent-select">Accent Color</label>
              <select id="drawer-accent-select" value={drawerAccent} onChange={(e) => setDrawerAccent(e.target.value as FormControlColor)}>
                {colors.map((c) => <option key={c.name} value={c.name.toLowerCase()}>{c.name}</option>)}
              </select>
            </div>
            <div className="control-group">
              <label htmlFor="drawer-title-input">Header Title</label>
              <input id="drawer-title-input" type="text" value={drawerTitle} onChange={(e) => setDrawerTitle(e.target.value)} />
            </div>
          </div>
          <div style={{ marginTop: '12px', borderTop: '1px solid var(--ctp-surface0)', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label>Toggles & Overlay Behaviors</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
              <label className="checkbox-label"><input type="checkbox" checked={drawerCloseOnOverlayClick} onChange={(e) => setDrawerCloseOnOverlayClick(e.target.checked)} />Close on backdrop click</label>
              <label className="checkbox-label"><input type="checkbox" checked={drawerCloseOnEsc} onChange={(e) => setDrawerCloseOnEsc(e.target.checked)} />Close on ESC key press</label>
              <label className="checkbox-label"><input type="checkbox" checked={drawerShowCloseButton} onChange={(e) => setDrawerShowCloseButton(e.target.checked)} />Show close cross button</label>
              <label className="checkbox-label"><input type="checkbox" checked={drawerShowFooter} onChange={(e) => setDrawerShowFooter(e.target.checked)} />Show footer actions</label>
            </div>
          </div>
        </div>
        <div className="playground-card playground-card--preview">
          <h3 style={{ margin: '0 0 1.2rem 0', fontSize: '1.2rem' }}>Component Trigger Preview</h3>
          <div className="preview-canvas" style={{ minHeight: '180px', flexDirection: 'column', gap: '12px' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--ctp-subtext0)', textAlign: 'center' }}>Clique no botão abaixo para abrir o Drawer.</span>
            <Button variant="filled" color={drawerAccent} onClick={() => setIsDrawerOpen(true)}>Abrir Painel Lateral (Drawer)</Button>
          </div>
          <div>
            <div className="tabs-header">
              {(['react', 'vue', 'angular'] as const).map((tab) => (
                <button key={tab} className={`tab-btn ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</button>
              ))}
            </div>
            <div className="code-container">
              <button className="code-copy-btn" onClick={() => { const code = activeTab === 'react' ? getReactDrawerCode() : activeTab === 'vue' ? getVueDrawerCode() : getAngularDrawerCode(); copyToClipboard(code.replace(/<[^>]*>/g, '')); }}>Copy Code</button>
              <pre className="code-block"><code dangerouslySetInnerHTML={{ __html: activeTab === 'react' ? getReactDrawerCode() : activeTab === 'vue' ? getVueDrawerCode() : getAngularDrawerCode() }} /></pre>
            </div>
          </div>
        </div>
      </div>
      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title={<span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>🚪 {drawerTitle}</span>} position={drawerPosition} size={drawerSize} color={drawerAccent} closeOnOverlayClick={drawerCloseOnOverlayClick} closeOnEsc={drawerCloseOnEsc} showCloseButton={drawerShowCloseButton} footer={drawerShowFooter ? (<><Button variant="ghost" color="red" onClick={() => setIsDrawerOpen(false)}>Cancelar</Button><Button variant="filled" color="green" onClick={() => setIsDrawerOpen(false)}>Salvar Ajustes</Button></>) : undefined}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <p style={{ margin: 0 }}>Este é o painel lateral deslizante do sistema de design Catppuccin, posicionado no lado <strong>{drawerPosition}</strong>.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label htmlFor="drawer-demo-name" style={{ fontSize: '0.8rem' }}>Nome de Usuário</label>
            <input id="drawer-demo-name" type="text" defaultValue="Miau da Silva" style={{ backgroundColor: 'var(--ctp-base)', border: '1px solid var(--ctp-surface1)' }} />
          </div>
        </div>
      </Drawer>
    </section>
  );
}
