import { useState } from "react";
import { Dropdown, Button } from '@mocha-ds/react';
import { UserIcon, SettingsIcon, BellIcon, ExternalLinkIcon, TrashIcon } from '@mocha-ds/react';
import type { Placement, ButtonColor } from '@mocha-ds/react';

function copyToClipboard(text: string) { navigator.clipboard.writeText(text); }

export default function DropdownPage() {
  const [dropdownPlacement, setDropdownPlacement] = useState<Placement>('bottom-start');
  const [dropdownColor, setDropdownColor] = useState<ButtonColor>('mauve');
  const [dropdownCloseOnItemClick, setDropdownCloseOnItemClick] = useState(true);
  const [dropdownAutoFlip, setDropdownAutoFlip] = useState(true);
  const [activeTab, setActiveTab] = useState<'react' | 'vue' | 'angular'>('react');

  const getReactDropdownCode = () => `<span class="hl-tag">&lt;Dropdown</span>\n  <span class="hl-attr">trigger</span>=<span class="hl-str">{&lt;Button color="${dropdownColor}"&gt;Abrir Menu&lt;/Button&gt;}</span>\n  <span class="hl-attr">placement</span>=<span class="hl-str">"${dropdownPlacement}"</span>\n  <span class="hl-attr">color</span>=<span class="hl-str">"${dropdownColor}"</span>\n  <span class="hl-attr">closeOnItemClick</span>=<span class="hl-str">{${dropdownCloseOnItemClick}}</span>\n  <span class="hl-attr">autoFlip</span>=<span class="hl-str">{${dropdownAutoFlip}}</span>\n<span class="hl-tag">&gt;</span>\n  <span class="hl-tag">&lt;Dropdown.Header&gt;</span>Ações do Usuário<span class="hl-tag">&lt;/Dropdown.Header&gt;</span>\n  <span class="hl-tag">&lt;Dropdown.Item</span> <span class="hl-attr">icon</span>=<span class="hl-str">{&lt;UserIcon /&gt;}</span><span class="hl-tag">&gt;</span>Meu Perfil<span class="hl-tag">&lt;/Dropdown.Item&gt;</span>\n  <span class="hl-tag">&lt;Dropdown.Item</span> <span class="hl-attr">icon</span>=<span class="hl-str">{&lt;SettingsIcon /&gt;}</span><span class="hl-tag">&gt;</span>Configurações<span class="hl-tag">&lt;/Dropdown.Item&gt;</span>\n  <span class="hl-tag">&lt;Dropdown.Divider /&gt;</span>\n  <span class="hl-tag">&lt;Dropdown.Item</span> <span class="hl-attr">danger</span> <span class="hl-attr">icon</span>=<span class="hl-str">{&lt;TrashIcon /&gt;}</span><span class="hl-tag">&gt;</span>Excluir Conta<span class="hl-tag">&lt;/Dropdown.Item&gt;</span>\n<span class="hl-tag">&lt;/Dropdown&gt;</span>`;

  const getVueDropdownCode = () => `<span class="hl-tag">&lt;CtpDropdown</span> <span class="hl-attr">placement</span>=<span class="hl-str">"${dropdownPlacement}"</span> <span class="hl-attr">color</span>=<span class="hl-str">"${dropdownColor}"</span><span class="hl-tag">&gt;</span>\n  <span class="hl-tag">&lt;template</span> <span class="hl-attr">#trigger</span><span class="hl-tag">&gt;</span>\n    <span class="hl-tag">&lt;CtpButton&gt;</span>Abrir Menu<span class="hl-tag">&lt;/CtpButton&gt;</span>\n  <span class="hl-tag">&lt;/template&gt;</span>\n  <span class="hl-tag">&lt;CtpDropdownHeader&gt;</span>Ações do Usuário<span class="hl-tag">&lt;/CtpDropdownHeader&gt;</span>\n  <span class="hl-tag">&lt;CtpDropdownItem&gt;</span>Meu Perfil<span class="hl-tag">&lt;/CtpDropdownItem&gt;</span>\n  <span class="hl-tag">&lt;CtpDropdownDivider /&gt;</span>\n  <span class="hl-tag">&lt;CtpDropdownItem</span> <span class="hl-attr">danger</span><span class="hl-tag">&gt;</span>Excluir Conta<span class="hl-tag">&lt;/CtpDropdownItem&gt;</span>\n<span class="hl-tag">&lt;/CtpDropdown&gt;</span>`;

  const getAngularDropdownCode = () => `<span class="hl-tag">&lt;dropdown</span> <span class="hl-attr">placement</span>=<span class="hl-str">"${dropdownPlacement}"</span> <span class="hl-attr">color</span>=<span class="hl-str">"${dropdownColor}"</span><span class="hl-tag">&gt;</span>\n  <span class="hl-tag">&lt;button</span> <span class="hl-attr">button</span> <span class="hl-attr">dropdownTrigger</span><span class="hl-tag">&gt;</span>Abrir Menu<span class="hl-tag">&lt;/button&gt;</span>\n  <span class="hl-tag">&lt;dropdown-header&gt;</span>Ações do Usuário<span class="hl-tag">&lt;/dropdown-header&gt;</span>\n  <span class="hl-tag">&lt;dropdown-item&gt;</span>Meu Perfil<span class="hl-tag">&lt;/dropdown-item&gt;</span>\n  <span class="hl-tag">&lt;dropdown-divider&gt;&lt;/dropdown-divider&gt;</span>\n  <span class="hl-tag">&lt;dropdown-item</span> <span class="hl-attr">[danger]</span>=<span class="hl-str">"true"</span><span class="hl-tag">&gt;</span>Excluir Conta<span class="hl-tag">&lt;/dropdown-item&gt;</span>\n<span class="hl-tag">&lt;/dropdown&gt;</span>`;

  return (
    <section>
      <h2 className="section-title"><span>▾</span> Dropdown Portal Component</h2>
      <div className="playground-section">
        <div className="demo-stage" style={{ width: '100%', minHeight: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h3 className="stage-title">Interactive Stage</h3>
          <div style={{ padding: '4rem 2rem', backgroundColor: 'var(--ctp-mantle)', borderRadius: '12px', border: '1px solid var(--ctp-surface0)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Dropdown trigger={<Button color={dropdownColor}>Abrir Menu de Opções</Button>} placement={dropdownPlacement} color={dropdownColor} closeOnItemClick={dropdownCloseOnItemClick} autoFlip={dropdownAutoFlip}>
              <Dropdown.Header>Minha Conta</Dropdown.Header>
              <Dropdown.Item icon={<UserIcon size={16} />}>Perfil do Usuário</Dropdown.Item>
              <Dropdown.Item icon={<SettingsIcon size={16} />}>Configurações</Dropdown.Item>
              <Dropdown.Item icon={<BellIcon size={16} />} disabled>Notificações (Desativado)</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Header>Ações Rápidas</Dropdown.Header>
              <Dropdown.Item icon={<ExternalLinkIcon size={16} />}>Ver Site Externo</Dropdown.Item>
              <Dropdown.Item icon={<TrashIcon size={16} />} danger>Excluir Conta</Dropdown.Item>
            </Dropdown>
          </div>
        </div>
        <div className="playground-controls">
          <h3 className="controls-title">Dropdown Customizer</h3>
          <div className="control-group">
            <label className="control-label">Dropdown Placement</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.4rem' }}>
              {(['bottom-start', 'bottom-end', 'bottom', 'top-start', 'top-end', 'top', 'left', 'right'] as const).map((p) => (
                <button key={p} onClick={() => setDropdownPlacement(p)} style={{ padding: '0.4rem', borderRadius: '6px', border: dropdownPlacement === p ? '1px solid var(--ctp-mauve)' : '1px solid var(--ctp-surface1)', backgroundColor: dropdownPlacement === p ? 'var(--ctp-mauve)' : 'transparent', color: dropdownPlacement === p ? 'var(--ctp-base)' : 'var(--ctp-text)', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.75rem' }}>{p}</button>
              ))}
            </div>
          </div>
          <div className="control-group" style={{ marginTop: '1.25rem' }}>
            <label className="control-label">Accent Color</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.4rem' }}>
              {['rosewater', 'flamingo', 'pink', 'mauve', 'red', 'peach', 'yellow', 'green', 'teal', 'blue', 'sky', 'lavender', 'sapphire', 'maroon'].map((c) => (
                <button key={c} onClick={() => setDropdownColor(c as any)} title={c.charAt(0).toUpperCase() + c.slice(1)} style={{ height: '24px', borderRadius: '4px', border: dropdownColor === c ? '2px solid white' : '1px solid var(--ctp-surface1)', backgroundColor: `var(--ctp-${c})`, cursor: 'pointer' }} />
              ))}
            </div>
          </div>
          <div className="control-group" style={{ marginTop: '1.25rem' }}>
            <label className="control-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}><input type="checkbox" checked={dropdownCloseOnItemClick} onChange={(e) => setDropdownCloseOnItemClick(e.target.checked)} style={{ cursor: 'pointer' }} /><span>Close Menu on Item Click</span></label>
          </div>
          <div className="control-group" style={{ marginTop: '0.75rem' }}>
            <label className="control-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}><input type="checkbox" checked={dropdownAutoFlip} onChange={(e) => setDropdownAutoFlip(e.target.checked)} style={{ cursor: 'pointer' }} /><span>Enable Viewport Auto-Flip</span></label>
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
          <button className="code-copy-btn" onClick={() => { const code = activeTab === 'react' ? getReactDropdownCode() : activeTab === 'vue' ? getVueDropdownCode() : getAngularDropdownCode(); copyToClipboard(code.replace(/<[^>]*>/g, '')); }} style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', padding: '0.3rem 0.6rem', fontSize: '0.8rem', borderRadius: '4px', border: '1px solid var(--ctp-surface1)', backgroundColor: 'var(--ctp-surface0)', color: 'var(--ctp-text)', cursor: 'pointer' }}>Copy Code</button>
          <pre className="code-block" style={{ margin: 0, padding: '1rem', overflowX: 'auto', backgroundColor: 'var(--ctp-mantle)', borderRadius: '8px' }}><code dangerouslySetInnerHTML={{ __html: activeTab === 'react' ? getReactDropdownCode() : activeTab === 'vue' ? getVueDropdownCode() : getAngularDropdownCode() }} /></pre>
        </div>
      </div>
    </section>
  );
}
